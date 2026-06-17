import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Construction, Energy, EnergyState, GameMode, GamePhase, OwnedGeneration, PurchaseOption, Technology, Upgrade } from '../types';
import {
  ALL_ITEMS,
  DOCUMENTARIES,
  ENERGIES,
  ERAS,
  INITIAL_BASE_CONSUMPTION,
  INITIAL_CAPACITY,
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
  paused: boolean;
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
  ownedGenerations: Record<string, OwnedGeneration[]>;
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

const SAVE_KEY = 'energie-clicker-save-v1';
const SPEEDS = [1, 3, 10] as const;

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
      stock: 0,
      capacity: INITIAL_CAPACITY[energy],
      productionPerSecond: 0,
      consumptionPerSecond: INITIAL_BASE_CONSUMPTION[energy],
      crisisCountdown: unlocked && INITIAL_BASE_CONSUMPTION[energy] > 0 ? MODE_CONFIG.normal.crisisSeconds : null,
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
    paused: false,
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
    ownedGenerations: {},
    purchasedUpgrades: {},
    constructions: [],
    pollutionVisible: false,
    pollution: 0,
    pollutionRate: 0,
    pollutionCountdown: null,
    producersDismantled: 0,
    totalElectricityProduced: 0,
    totalFuelConsumed: 0,
    modalDocumentaryId: null,
    finalShownAt: null
  };
}

function readSavedState(mode: GameMode): GameState | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    const modalDocumentaryId = ERAS.some((era) => era.documentaryId === parsed.modalDocumentaryId)
      || MILESTONES.some((milestone) => milestone.documentaryId === parsed.modalDocumentaryId)
      ? parsed.modalDocumentaryId
      : null;
    return deriveState({ ...makeInitialState(mode), ...parsed, mode, modalDocumentaryId });
  } catch {
    return null;
  }
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

function computeMultiplierForTech(tech: Technology, upgradeIds: readonly string[], key: 'productionMultiplier' | 'pollutionMultiplier' | 'storageMultiplier') {
  return upgradeIds.reduce((multiplier, upgradeId) => {
    const upgrade = upgradeById.get(upgradeId);
    if (!upgrade || !itemMatchesUpgrade(tech, upgrade)) return multiplier;
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

function getDefaultLifetimeSeconds(tech: Technology) {
  const byEra: Record<Technology['era'], number> = {
    prehistoire: 210,
    agriculture: 300,
    industrie: 360,
    electricite_petrole: 480,
    trente_glorieuses: 600,
    moderne_futur: 720
  };
  return tech.lifetimeSeconds ?? byEra[tech.era];
}

function computeLifetimeForTech(tech: Technology, upgradeIds: readonly string[]) {
  return upgradeIds.reduce((lifetime, upgradeId) => {
    const upgrade = upgradeById.get(upgradeId);
    if (!upgrade || !itemMatchesUpgrade(tech, upgrade)) return lifetime;
    return lifetime * (upgrade.effect.lifetimeMultiplier ?? 1);
  }, getDefaultLifetimeSeconds(tech));
}

function deriveState(raw: GameState): GameState {
  const production: Record<Energy, number> = { ...raw.baseProduction };
  const consumption: Record<Energy, number> = { ...raw.baseConsumption };
  const storage: Record<Energy, number> = { ...raw.baseStorage };
  let pollutionRate = 0;

  const generationEntries = Object.keys(raw.ownedGenerations).length > 0
    ? Object.entries(raw.ownedGenerations)
    : Object.entries(raw.owned).map(([techId, quantity]) => {
      const tech = techById.get(techId);
      const lifetime = tech ? computeLifetimeForTech(tech, []) : 1;
      return [techId, [{ id: `${techId}-legacy`, label: 'Génération initiale', quantity, upgradeIds: [], remainingLifetimeSeconds: lifetime, totalLifetimeSeconds: lifetime }]] as const;
    });

  for (const [techId, generations] of generationEntries) {
    const tech = techById.get(techId);
    if (!tech) continue;
    for (const generation of generations) {
      if (generation.quantity <= 0) continue;
      const productionMultiplier = computeMultiplierForTech(tech, generation.upgradeIds, 'productionMultiplier');
      const storageMultiplier = computeMultiplierForTech(tech, generation.upgradeIds, 'storageMultiplier');
      const pollutionMultiplier = computeMultiplierForTech(tech, generation.upgradeIds, 'pollutionMultiplier');
      addRecord(production, tech.productionPerSecond, generation.quantity * productionMultiplier * MODE_CONFIG[raw.mode].passiveGainMultiplier);
      addRecord(consumption, tech.consumptionPerSecond, generation.quantity);
      addRecord(storage, tech.storageBonus, generation.quantity * storageMultiplier);
      pollutionRate += (tech.pollutionPerSecond ?? tech.hiddenPollutionDebtPerSecond ?? 0) * generation.quantity * pollutionMultiplier;
      pollutionRate += (tech.pollutionDeltaPerSecond ?? 0) * generation.quantity;
    }
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

function getActiveUpgradeIdsForTechnology(tech: Technology, state: GameState) {
  return UPGRADES
    .filter((upgrade) => state.purchasedUpgrades[upgrade.id] && itemMatchesUpgrade(tech, upgrade) && upgrade.appliesTo !== 'existing')
    .map((upgrade) => upgrade.id);
}

function makeGenerationLabel(upgradeIds: string[]) {
  if (upgradeIds.length === 0) return 'Avant amélioration';
  return upgradeIds.map((upgradeId) => upgradeById.get(upgradeId)?.name ?? upgradeId).join(' + ');
}

function ageOwnedGenerations(state: GameState, dt: number): GameState {
  const ownedGenerations: Record<string, OwnedGeneration[]> = {};
  const owned: Record<string, number> = {};

  for (const [techId, generations] of Object.entries(state.ownedGenerations)) {
    const alive = generations
      .map((generation) => ({
        ...generation,
        remainingLifetimeSeconds: generation.remainingLifetimeSeconds - dt
      }))
      .filter((generation) => generation.remainingLifetimeSeconds > 0);
    if (alive.length === 0) continue;
    ownedGenerations[techId] = alive;
    owned[techId] = alive.reduce((total, generation) => total + generation.quantity, 0);
  }

  return { ...state, owned, ownedGenerations };
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
      stock: 0,
      crisisCountdown: next[energy].consumptionPerSecond > 0 ? MODE_CONFIG.normal.crisisSeconds : null
    };
  }
  return next;
}

function openDocumentary(state: GameState, documentaryId?: string | null): GameState {
  if (!documentaryId || state.modalDocumentaryId) return state;
  return {
    ...state,
    modalDocumentaryId: documentaryId,
    paused: true
  };
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

  let nextState: GameState = openDocumentary({
    ...state,
    baseConsumption,
    baseProduction,
    baseStorage,
    pollution: clamp(state.pollution + (milestone.hiddenPollutionDebtDelta ?? 0) * impact, 0, 140),
    pollutionRate: state.pollutionRate + (milestone.pollutionDeltaPerSecond ?? 0) * impact
  }, milestone.documentaryId);

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
      modalDocumentaryId: nextState.modalDocumentaryId
    };
  } else {
    nextState = {
      ...nextState,
      phase: 'finalHold',
      phaseRemainingSeconds: MODE_CONFIG[state.mode].finalHoldSeconds,
      modalDocumentaryId: nextState.modalDocumentaryId
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
  const baseConsumption = { ...state.baseConsumption };
  addRecord(baseConsumption, nextEra.entryConsumptionDelta, MODE_CONFIG[state.mode].milestoneImpactMultiplier);
  const pollutionVisible = state.pollutionVisible || nextEra.id === 'trente_glorieuses';
  return deriveState({
    ...state,
    eraIndex: nextEraIndex,
    speed: 1,
    paused: true,
    milestoneIndex: 0,
    phase: 'milestone',
    phaseRemainingSeconds: MODE_CONFIG[state.mode].milestoneTotalSeconds,
    energies,
    baseConsumption,
    pollutionVisible,
    pollution: pollutionVisible && !state.pollutionVisible ? Math.min(state.pollution, 65) : state.pollution,
    modalDocumentaryId: nextEra.documentaryId
  });
}

function completeConstruction(state: GameState, construction: Construction): GameState {
  const item = itemById.get(construction.technologyId);
  if (!item) return state;
  const owned = { ...state.owned };
  const ownedGenerations = { ...state.ownedGenerations };
  const purchasedUpgrades = { ...state.purchasedUpgrades };
  let nextState: GameState = state;

  if (isUpgrade(item)) {
    purchasedUpgrades[item.id] = true;
  } else {
    owned[item.id] = (owned[item.id] ?? 0) + construction.quantity;
    const upgradeIds = getActiveUpgradeIdsForTechnology(item, state);
    const generationKey = upgradeIds.join('|') || 'base';
    const generations = [...(ownedGenerations[item.id] ?? [])];
    const existingIndex = generations.findIndex((generation) => generation.upgradeIds.join('|') === generationKey);
    if (existingIndex >= 0) {
      generations[existingIndex] = {
        ...generations[existingIndex],
        quantity: generations[existingIndex].quantity + construction.quantity,
        remainingLifetimeSeconds: Math.max(generations[existingIndex].remainingLifetimeSeconds, computeLifetimeForTech(item, upgradeIds))
      };
    } else {
      const lifetime = computeLifetimeForTech(item, upgradeIds);
      generations.push({
        id: `${item.id}-${generationKey}`,
        label: makeGenerationLabel(upgradeIds),
        quantity: construction.quantity,
        upgradeIds,
        remainingLifetimeSeconds: lifetime,
        totalLifetimeSeconds: lifetime
      });
    }
    ownedGenerations[item.id] = generations;
  }

  nextState = { ...state, owned, ownedGenerations, purchasedUpgrades };
  return deriveState(nextState);
}

function tickState(state: GameState, dt: number): GameState {
  if (state.phase === 'gameOver' || state.phase === 'final') return state;

  let next = deriveState(ageOwnedGenerations({ ...state, elapsedSeconds: state.elapsedSeconds + dt }, dt));

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
  const [state, setState] = useState<GameState>(() => readSavedState(initialMode) ?? deriveState(makeInitialState(initialMode)));
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastRef.current == null) lastRef.current = timestamp;
      const rawDt = Math.min(0.25, (timestamp - lastRef.current) / 1000);
      lastRef.current = timestamp;
      setState((current) => tickState(current, current.paused ? 0 : rawDt * current.speed));
      frameRef.current = window.requestAnimationFrame(loop);
    };
    frameRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

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
    return ALL_ITEMS
      .filter((item) => unlocked.has(item.id))
      .sort((a, b) => {
        const aCurrent = currentEra.technologiesUnlocked.includes(a.id) ? 0 : 1;
        const bCurrent = currentEra.technologiesUnlocked.includes(b.id) ? 0 : 1;
        return aCurrent - bCurrent;
      });
  }, [currentEra, state.eraIndex]);

  const documentaryIsMilestone = MILESTONES.some((candidate) => candidate.documentaryId === state.modalDocumentaryId);
  const documentaryIsEra = ERAS.some((candidate) => candidate.documentaryId === state.modalDocumentaryId);
  const activeDocumentary = state.modalDocumentaryId && (documentaryIsMilestone || documentaryIsEra)
    ? DOCUMENTARIES[state.modalDocumentaryId]
    : null;
  const activeDocumentaryContext = useMemo(() => {
    if (!state.modalDocumentaryId) return null;
    const milestone = MILESTONES.find((candidate) => candidate.documentaryId === state.modalDocumentaryId);
    if (milestone) return { consumptionDelta: milestone.consumptionDelta, unlockedItemNames: [] };
    const era = ERAS.find((candidate) => candidate.documentaryId === state.modalDocumentaryId);
    if (era) {
      return {
        consumptionDelta: era.entryConsumptionDelta,
        unlockedItemNames: era.technologiesUnlocked
          .map((itemId) => itemById.get(itemId)?.name)
          .filter((name): name is string => Boolean(name))
      };
    }
    return { consumptionDelta: {}, unlockedItemNames: [] };
  }, [state.modalDocumentaryId]);

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
        energies[energy] = { ...energies[energy], stock: clamp(energies[energy].stock - (cost[energy] ?? 0), 0, energies[energy].capacity) };
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
      const generations = [...(current.ownedGenerations[technologyId] ?? [])];
      for (let i = generations.length - 1; i >= 0; i -= 1) {
        if (generations[i].quantity <= 0) continue;
        generations[i] = { ...generations[i], quantity: generations[i].quantity - 1 };
        break;
      }
      return deriveState({
        ...current,
        owned: { ...current.owned, [technologyId]: (current.owned[technologyId] ?? 0) - 1 },
        ownedGenerations: { ...current.ownedGenerations, [technologyId]: generations.filter((generation) => generation.quantity > 0) },
        producersDismantled: current.producersDismantled + 1,
        modalDocumentaryId: current.modalDocumentaryId
      });
    });
  }, []);

  const closeDocumentary = useCallback(() => setState((current) => ({
    ...current,
    modalDocumentaryId: null,
    paused: false
  })), []);

  const cycleSpeed = useCallback(() => {
    setState((current) => {
      const currentIndex = SPEEDS.findIndex((speed) => speed === current.speed);
      const nextSpeed = SPEEDS[(currentIndex + 1) % SPEEDS.length];
      return { ...current, speed: nextSpeed };
    });
  }, []);

  const togglePause = useCallback(() => {
    setState((current) => ({ ...current, paused: !current.paused }));
  }, []);

  const reset = useCallback(() => {
    window.localStorage.removeItem(SAVE_KEY);
    setState(deriveState(makeInitialState(initialMode)));
  }, [initialMode]);

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

  const clickYield = useMemo(() => {
    const multiplier = computeClickMultiplier(state);
    const result: Partial<Record<Energy, number>> = {};
    for (const energy of ENERGIES) {
      const gain = currentEra.clickAction.gain[energy] ?? 0;
      if (gain && state.energies[energy].unlocked) result[energy] = gain * multiplier;
    }
    return result;
  }, [currentEra, state]);

  return {
    state,
    currentEra,
    currentMilestone,
    nextEra,
    isMilestoneVisible,
    availableItems,
    activeDocumentary,
    activeDocumentaryContext,
    availableSlots: getAvailableSlots(state),
    clickYield,
    actions: {
      click,
      purchase,
      dismantle,
      closeDocumentary,
      cycleSpeed,
      togglePause,
      reset,
      refuelAndContinue,
      debug,
      getOptionCost,
      canAfford: (cost: Partial<Record<Energy, number>>) => canAfford(state, cost)
    }
  };
}
