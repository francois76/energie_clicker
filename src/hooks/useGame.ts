import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Construction, Energy, EnergyState, GameMode, GamePhase, PurchaseOption, Technology, Upgrade } from '../types';
import {
  ALL_ITEMS,
  DOCUMENTARIES,
  ENERGIES,
  ERAS,
  INITIAL_BASE_CONSUMPTION,
  INITIAL_CAPACITY,
  INITIAL_STOCK_RATIO,
  MILESTONES,
  MODE_CONFIG,
  TECHNOLOGIES,
  UPGRADES
} from '../data/gameData';
import { clamp } from '../utils/format';

type Item = Technology | Upgrade;

type GameState = {
  mode: GameMode;
  speed: number;
  allowGameOver: boolean;
  elapsedSeconds: number;
  eraIndex: number;
  milestoneIndex: number;
  phase: GamePhase;
  phaseRemainingSeconds: number;
  energies: Record<Energy, EnergyState>;
  baseConsumption: Record<Energy, number>;
  baseProduction: Record<Energy, number>;
  baseStorage: Record<Energy, number>;
  owned: Record<string, number>;
  purchasedUpgrades: Record<string, boolean>;
  constructions: Construction[];
  pollutionVisible: boolean;
  pollution: number;
  pollutionRate: number;
  pollutionCountdown: number | null;
  producersDismantled: number;
  totalElectricityProduced: number;
  totalFuelConsumed: number;
  modalDocumentaryId: string | null;
  finalShownAt: number | null;
};

const itemById = new Map<string, Item>(ALL_ITEMS.map((item) => [item.id, item]));
const techById = new Map<string, Technology>(TECHNOLOGIES.map((item) => [item.id, item]));
const milestoneById = new Map(MILESTONES.map((item) => [item.id, item]));
const upgradeById = new Map(UPGRADES.map((item) => [item.id, item]));

function isUpgrade(item: Item): item is Upgrade {
  return 'effect' in item;
}

function createInitialEnergies(): Record<Energy, EnergyState> {
  return ENERGIES.reduce((acc, energy) => {
    const unlocked = energy === 'heat';
    acc[energy] = {
      stock: unlocked ? INITIAL_CAPACITY[energy] * INITIAL_STOCK_RATIO[energy] : 0,
      capacity: INITIAL_CAPACITY[energy],
      productionPerSecond: 0,
      consumptionPerSecond: INITIAL_BASE_CONSUMPTION[energy],
      crisisCountdown: null,
      unlocked
    };
    return acc;
  }, {} as Record<Energy, EnergyState>);
}

function makeInitialState(mode: GameMode): GameState {
  const cfg = MODE_CONFIG[mode];
  return {
    mode,
    speed: 1,
    allowGameOver: true,
    elapsedSeconds: 0,
    eraIndex: 0,
    milestoneIndex: 0,
    phase: 'milestone',
    phaseRemainingSeconds: cfg.milestoneTotalSeconds,
    energies: createInitialEnergies(),
    baseConsumption: { ...INITIAL_BASE_CONSUMPTION },
    baseProduction: { heat: 0, mechanical: 0, fuel: 0, electricity: 0 },
    baseStorage: { heat: 0, mechanical: 0, fuel: 0, electricity: 0 },
    owned: {},
    purchasedUpgrades: {},
    constructions: [],
    pollutionVisible: false,
    pollution: 0,
    pollutionRate: 0,
    pollutionCountdown: null,
    producersDismantled: 0,
    totalElectricityProduced: 0,
    totalFuelConsumed: 0,
    modalDocumentaryId: ERAS[0].documentaryId,
    finalShownAt: null
  };
}

function addRecord(target: Record<Energy, number>, delta?: Partial<Record<Energy, number>>, multiplier = 1) {
  if (!delta) return;
  for (const energy of ENERGIES) {
    target[energy] += (delta[energy] ?? 0) * multiplier;
  }
}

function multiplyCost(cost: Partial<Record<Energy, number>>, quantity: number, mode: GameMode): Partial<Record<Energy, number>> {
  const multiplier = MODE_CONFIG[mode].costMultiplier * quantity;
  const result: Partial<Record<Energy, number>> = {};
  for (const energy of ENERGIES) {
    const value = cost[energy];
    if (value) result[energy] = value * multiplier;
  }
  return result;
}

function itemMatchesUpgrade(item: Technology, upgrade: Upgrade): boolean {
  const idMatch = upgrade.affectsTechnologyIds?.includes(item.id) ?? false;
  const tagMatch = upgrade.affectsTags?.some((tag) => item.tags?.includes(tag)) ?? false;
  return idMatch || tagMatch;
}

function computeMultiplierForTech(tech: Technology, state: GameState, key: 'productionMultiplier' | 'pollutionMultiplier' | 'storageMultiplier') {
  return UPGRADES.reduce((multiplier, upgrade) => {
    if (!state.purchasedUpgrades[upgrade.id] || !itemMatchesUpgrade(tech, upgrade)) return multiplier;
    return multiplier * (upgrade.effect[key] ?? 1);
  }, 1);
}

function computeClickMultiplier(state: GameState) {
  const initial = MODE_CONFIG[state.mode].clickMultiplier as number;
  return UPGRADES.reduce<number>((multiplier, upgrade) => {
    if (!state.purchasedUpgrades[upgrade.id]) return multiplier;
    return multiplier * (upgrade.effect.clickMultiplier ?? 1);
  }, initial);
}

function deriveState(raw: GameState): GameState {
  const production: Record<Energy, number> = { ...raw.baseProduction };
  const consumption: Record<Energy, number> = { ...raw.baseConsumption };
  const storage: Record<Energy, number> = { ...raw.baseStorage };
  let pollutionRate = 0;

  for (const [techId, quantity] of Object.entries(raw.owned)) {
    const tech = techById.get(techId);
    if (!tech || quantity <= 0) continue;
    const productionMultiplier = computeMultiplierForTech(tech, raw, 'productionMultiplier');
    const storageMultiplier = computeMultiplierForTech(tech, raw, 'storageMultiplier');
    const pollutionMultiplier = computeMultiplierForTech(tech, raw, 'pollutionMultiplier');
    addRecord(production, tech.productionPerSecond, quantity * productionMultiplier * MODE_CONFIG[raw.mode].passiveGainMultiplier);
    addRecord(consumption, tech.consumptionPerSecond, quantity);
    addRecord(storage, tech.storageBonus, quantity * storageMultiplier);
    pollutionRate += (tech.pollutionPerSecond ?? tech.hiddenPollutionDebtPerSecond ?? 0) * quantity * pollutionMultiplier;
    pollutionRate += (tech.pollutionDeltaPerSecond ?? 0) * quantity;
  }

  pollutionRate += raw.pollutionRate;
  pollutionRate = Math.max(-0.25, pollutionRate);

  const energies = { ...raw.energies };
  for (const energy of ENERGIES) {
    const capacity = Math.max(10, INITIAL_CAPACITY[energy] + storage[energy]);
    const unlocked = energies[energy].unlocked;
    energies[energy] = {
      ...energies[energy],
      capacity,
      stock: Math.min(energies[energy].stock, capacity),
      productionPerSecond: production[energy],
      consumptionPerSecond: Math.max(0, consumption[energy])
    };
  }

  return { ...raw, energies, pollutionRate };
}

function canAfford(state: GameState, cost: Partial<Record<Energy, number>>) {
  return ENERGIES.every((energy) => (state.energies[energy].stock + 1e-6) >= (cost[energy] ?? 0));
}

function getAvailableSlots(state: GameState) {
  return ERAS[state.eraIndex].constructionSlots + MODE_CONFIG[state.mode].constructionSlotBonus;
}

function revealEnergy(energies: Record<Energy, EnergyState>, energy: Energy) {
  const next = { ...energies };
  if (!next[energy].unlocked) {
    next[energy] = {
      ...next[energy],
      unlocked: true,
      stock: Math.max(next[energy].stock, next[energy].capacity * INITIAL_STOCK_RATIO[energy])
    };
  }
  return next;
}

function applyMilestone(state: GameState): GameState {
  const era = ERAS[state.eraIndex];
  const milestoneId = era.milestones[state.milestoneIndex];
  const milestone = milestoneById.get(milestoneId);
  if (!milestone) return state;

  const impact = MODE_CONFIG[state.mode].milestoneImpactMultiplier;
  const baseConsumption = { ...state.baseConsumption };
  const baseProduction = { ...state.baseProduction };
  const baseStorage = { ...state.baseStorage };
  addRecord(baseConsumption, milestone.consumptionDelta, impact);
  addRecord(baseProduction, milestone.productionDelta, impact);
  addRecord(baseStorage, milestone.storageDelta, impact);

  let nextState: GameState = {
    ...state,
    baseConsumption,
    baseProduction,
    baseStorage,
    pollution: clamp(state.pollution + (milestone.hiddenPollutionDebtDelta ?? 0) * impact, 0, 140),
    pollutionRate: state.pollutionRate + (milestone.pollutionDeltaPerSecond ?? 0) * impact,
    modalDocumentaryId: milestone.documentaryId
  };

  if (state.milestoneIndex < era.milestones.length - 1) {
    nextState = {
      ...nextState,
      milestoneIndex: state.milestoneIndex + 1,
      phaseRemainingSeconds: MODE_CONFIG[state.mode].milestoneTotalSeconds
    };
  } else if (era.nextEraId) {
    nextState = {
      ...nextState,
      phase: 'transition',
      phaseRemainingSeconds: MODE_CONFIG[state.mode].transitionSeconds,
      modalDocumentaryId: ERAS[state.eraIndex + 1]?.documentaryId ?? nextState.modalDocumentaryId
    };
  } else {
    nextState = {
      ...nextState,
      phase: 'finalHold',
      phaseRemainingSeconds: MODE_CONFIG[state.mode].finalHoldSeconds,
      modalDocumentaryId: 'tech_fusion'
    };
  }

  return deriveState(nextState);
}

function applyEraTransition(state: GameState): GameState {
  const nextEraIndex = Math.min(state.eraIndex + 1, ERAS.length - 1);
  const nextEra = ERAS[nextEraIndex];
  let energies = state.energies;
  for (const energy of nextEra.unlockedEnergies) {
    energies = revealEnergy(energies, energy);
  }
  const pollutionVisible = state.pollutionVisible || nextEra.id === 'trente_glorieuses';
  return deriveState({
    ...state,
    eraIndex: nextEraIndex,
    milestoneIndex: 0,
    phase: 'milestone',
    phaseRemainingSeconds: MODE_CONFIG[state.mode].milestoneTotalSeconds,
    energies,
    pollutionVisible,
    pollution: pollutionVisible && !state.pollutionVisible ? Math.min(state.pollution, 65) : state.pollution,
    modalDocumentaryId: nextEra.documentaryId
  });
}

function completeConstruction(state: GameState, construction: Construction): GameState {
  const item = itemById.get(construction.technologyId);
  if (!item) return state;
  const owned = { ...state.owned };
  const purchasedUpgrades = { ...state.purchasedUpgrades };
  let modalDocumentaryId = item.documentaryId ?? state.modalDocumentaryId;

  if (isUpgrade(item)) {
    purchasedUpgrades[item.id] = true;
  } else {
    owned[item.id] = (owned[item.id] ?? 0) + construction.quantity;
  }

  return deriveState({ ...state, owned, purchasedUpgrades, modalDocumentaryId });
}

function tickState(state: GameState, dt: number): GameState {
  if (state.phase === 'gameOver' || state.phase === 'final') return state;

  let next = deriveState({ ...state, elapsedSeconds: state.elapsedSeconds + dt });

  const constructions: Construction[] = [];
  for (const construction of next.constructions) {
    const updated = { ...construction, remainingSeconds: construction.remainingSeconds - dt };
    if (updated.remainingSeconds <= 0) {
      next = completeConstruction(next, construction);
    } else {
      constructions.push(updated);
    }
  }
  next = { ...next, constructions };

  const energies = { ...next.energies };
  let gameOver = false;
  let totalElectricityProduced = next.totalElectricityProduced;
  let totalFuelConsumed = next.totalFuelConsumed;

  for (const energy of ENERGIES) {
    if (!energies[energy].unlocked) continue;
    const current = energies[energy];
    const net = current.productionPerSecond - current.consumptionPerSecond;
    const stock = clamp(current.stock + net * dt, 0, current.capacity);
    const inCrisis = stock <= 0.0001 && net < 0;
    let crisisCountdown = current.crisisCountdown;
    if (inCrisis) {
      crisisCountdown = crisisCountdown == null ? MODE_CONFIG[next.mode].crisisSeconds : crisisCountdown - dt;
      if (crisisCountdown <= 0 && next.allowGameOver) gameOver = true;
    } else {
      crisisCountdown = null;
    }
    energies[energy] = { ...current, stock, crisisCountdown };
    if (energy === 'electricity') totalElectricityProduced += Math.max(0, current.productionPerSecond) * dt;
    if (energy === 'fuel') totalFuelConsumed += Math.max(0, current.consumptionPerSecond) * dt;
  }

  const pollution = clamp(next.pollution + next.pollutionRate * dt, 0, 140);
  let pollutionCountdown = next.pollutionCountdown;
  if (next.pollutionVisible && pollution >= 100) {
    pollutionCountdown = pollutionCountdown == null ? MODE_CONFIG[next.mode].crisisSeconds : pollutionCountdown - dt;
    if (pollutionCountdown <= 0 && next.allowGameOver) gameOver = true;
  } else {
    pollutionCountdown = null;
  }

  next = { ...next, energies, pollution, pollutionCountdown, totalElectricityProduced, totalFuelConsumed };

  if (gameOver) {
    return { ...next, phase: 'gameOver' };
  }

  const phaseRemainingSeconds = next.phaseRemainingSeconds - dt;
  if (phaseRemainingSeconds <= 0) {
    if (next.phase === 'milestone') return applyMilestone({ ...next, phaseRemainingSeconds: 0 });
    if (next.phase === 'transition') return applyEraTransition({ ...next, phaseRemainingSeconds: 0 });
    if (next.phase === 'finalHold') return { ...next, phase: 'final', finalShownAt: next.elapsedSeconds };
  }

  return { ...next, phaseRemainingSeconds };
}

export function useGame(initialMode: GameMode) {
  const [state, setState] = useState<GameState>(() => deriveState(makeInitialState(initialMode)));
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastRef.current == null) lastRef.current = timestamp;
      const rawDt = Math.min(0.25, (timestamp - lastRef.current) / 1000);
      lastRef.current = timestamp;
      setState((current) => tickState(current, rawDt * current.speed));
      frameRef.current = window.requestAnimationFrame(loop);
    };
    frameRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const currentEra = ERAS[state.eraIndex];
  const currentMilestone = currentEra.milestones[state.milestoneIndex]
    ? milestoneById.get(currentEra.milestones[state.milestoneIndex]) ?? null
    : null;
  const nextEra = currentEra.nextEraId ? ERAS[state.eraIndex + 1] ?? null : null;

  const isMilestoneVisible = state.phase === 'milestone' && state.phaseRemainingSeconds <= MODE_CONFIG[state.mode].milestoneVisibleSeconds;

  const availableItems = useMemo(() => {
    const unlocked = new Set(currentEra.technologiesUnlocked);
    for (let i = 0; i < state.eraIndex; i += 1) {
      ERAS[i].technologiesUnlocked.forEach((id) => unlocked.add(id));
    }
    return ALL_ITEMS.filter((item) => unlocked.has(item.id));
  }, [currentEra, state.eraIndex]);

  const activeDocumentary = state.modalDocumentaryId ? DOCUMENTARIES[state.modalDocumentaryId] : null;

  const click = useCallback(() => {
    setState((current) => {
      const era = ERAS[current.eraIndex];
      const multiplier = computeClickMultiplier(current);
      const energies = { ...current.energies };
      for (const energy of ENERGIES) {
        const gain = era.clickAction.gain[energy] ?? 0;
        if (!gain || !energies[energy].unlocked) continue;
        energies[energy] = { ...energies[energy], stock: clamp(energies[energy].stock + gain * multiplier, 0, energies[energy].capacity) };
      }
      const pollution = current.eraIndex === ERAS.length - 1 && current.purchasedUpgrades.smart_grid
        ? Math.max(0, current.pollution - 0.03 * multiplier)
        : current.pollution;
      return { ...current, energies, pollution };
    });
  }, []);

  const purchase = useCallback((itemId: string, optionId: string, quantity: number) => {
    setState((current) => {
      const item = itemById.get(itemId);
      if (!item) return current;
      if (isUpgrade(item) && current.purchasedUpgrades[item.id]) return current;
      if (!isUpgrade(item) && item.maxQuantity && (current.owned[item.id] ?? 0) + quantity > item.maxQuantity) return current;
      if (current.constructions.length >= getAvailableSlots(current)) return current;
      const option = item.purchaseOptions.find((candidate) => candidate.id === optionId);
      if (!option) return current;
      if (option.requirements?.some((requiredId) => !current.purchasedUpgrades[requiredId] && !(current.owned[requiredId] > 0))) return current;
      const cost = multiplyCost(option.cost, quantity, current.mode);
      if (!canAfford(current, cost)) return current;
      const energies = { ...current.energies };
      for (const energy of ENERGIES) {
        energies[energy] = { ...energies[energy], stock: energies[energy].stock - (cost[energy] ?? 0) };
      }
      const pollution = clamp(current.pollution + (option.pollutionDebt ?? option.pollutionInstant ?? 0) * MODE_CONFIG[current.mode].milestoneImpactMultiplier, 0, 140);
      const construction: Construction = {
        id: `${itemId}-${optionId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        technologyId: itemId,
        optionId,
        quantity,
        remainingSeconds: Math.max(1, option.buildTimeSeconds * Math.sqrt(quantity) * MODE_CONFIG[current.mode].buildTimeMultiplier),
        totalSeconds: Math.max(1, option.buildTimeSeconds * Math.sqrt(quantity) * MODE_CONFIG[current.mode].buildTimeMultiplier),
        startedAt: current.elapsedSeconds
      };
      return deriveState({ ...current, energies, pollution, constructions: [...current.constructions, construction] });
    });
  }, []);

  const dismantle = useCallback((technologyId: string) => {
    setState((current) => {
      const tech = techById.get(technologyId);
      if (!tech || !tech.removable || (current.owned[technologyId] ?? 0) <= 0) return current;
      return deriveState({
        ...current,
        owned: { ...current.owned, [technologyId]: (current.owned[technologyId] ?? 0) - 1 },
        producersDismantled: current.producersDismantled + 1,
        modalDocumentaryId: 'tech_filters'
      });
    });
  }, []);

  const closeDocumentary = useCallback(() => setState((current) => ({ ...current, modalDocumentaryId: null })), []);

  const refuelAndContinue = useCallback(() => {
    setState((current) => {
      const energies = { ...current.energies };
      for (const energy of ENERGIES) {
        if (!energies[energy].unlocked) continue;
        energies[energy] = {
          ...energies[energy],
          stock: Math.max(energies[energy].stock, energies[energy].capacity * 0.3),
          crisisCountdown: null
        };
      }
      return {
        ...current,
        phase: current.phase === 'gameOver' ? 'milestone' : current.phase,
        energies,
        pollution: Math.min(current.pollution, 65),
        pollutionCountdown: null
      };
    });
  }, []);

  const debug = useMemo(() => ({
    addEnergy: (energy: Energy, amount = 250) => setState((current) => {
      const energies = revealEnergy(current.energies, energy);
      energies[energy] = { ...energies[energy], stock: clamp(energies[energy].stock + amount, 0, energies[energy].capacity) };
      return { ...current, energies };
    }),
    refuel: () => setState((current) => {
      const energies = { ...current.energies };
      for (const energy of ENERGIES) {
        if (energies[energy].unlocked) energies[energy] = { ...energies[energy], stock: energies[energy].capacity * 0.3, crisisCountdown: null };
      }
      return { ...current, energies, pollution: Math.min(current.pollution, 65), pollutionCountdown: null };
    }),
    nextMilestone: () => setState((current) => current.phase === 'milestone' ? applyMilestone({ ...current, phaseRemainingSeconds: 0 }) : current),
    nextEra: () => setState((current) => current.phase === 'transition' ? applyEraTransition(current) : ({ ...current, phase: 'transition', phaseRemainingSeconds: 1 })),
    setSpeed: (speed: number) => setState((current) => ({ ...current, speed })),
    toggleGameOver: () => setState((current) => ({ ...current, allowGameOver: !current.allowGameOver }))
  }), []);

  const getOptionCost = useCallback((option: PurchaseOption, quantity: number) => multiplyCost(option.cost, quantity, state.mode), [state.mode]);

  return {
    state,
    currentEra,
    currentMilestone,
    nextEra,
    isMilestoneVisible,
    availableItems,
    activeDocumentary,
    availableSlots: getAvailableSlots(state),
    actions: {
      click,
      purchase,
      dismantle,
      closeDocumentary,
      refuelAndContinue,
      debug,
      getOptionCost,
      canAfford: (cost: Partial<Record<Energy, number>>) => canAfford(state, cost)
    }
  };
}
