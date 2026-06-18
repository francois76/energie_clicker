import { useMemo, useState } from 'react';
import type { Construction, Energy, EnergyState, PurchaseOption, Technology, Upgrade } from '../types';
import { ENERGIES, ENERGY_META, MODE_CONFIG, UPGRADES } from '../data/gameData';
import { formatEnergyAmount, formatNumber, formatPower } from '../utils/format';

type Item = Technology | Upgrade;

type Props = {
  items: Item[];
  owned: Record<string, number>;
  purchasedUpgrades: Record<string, boolean>;
  constructions: Construction[];
  energies: Record<Energy, EnergyState>;
  mode: keyof typeof MODE_CONFIG;
  pollutionVisible: boolean;
  slotsAvailable: number;
  slotCooldownRatio: number;
  onPurchase: (itemId: string, optionId: string, quantity: number) => void;
  onDismantle: (technologyId: string) => void;
  getOptionCost: (option: PurchaseOption, quantity: number) => Partial<Record<Energy, number>>;
  canAfford: (cost: Partial<Record<Energy, number>>) => boolean;
};

type Tab = 'producer' | 'storage' | 'upgrade' | 'conversion' | 'dismantle';

const tabLabels: Record<Tab, string> = {
  producer: 'Production',
  storage: 'Stockage',
  upgrade: 'Améliorations',
  conversion: 'Conversions',
  dismantle: 'Démantèlement'
};

function isUpgrade(item: Item): item is Upgrade {
  return 'effect' in item;
}

function getKind(item: Item): Tab {
  if (isUpgrade(item)) return 'upgrade';
  return item.kind === 'retrofit' ? 'conversion' : item.kind;
}

function EnergyPills({ values, mode, signed = false, dangerPositive = false, negativeIsBenefit = false }: { values: Partial<Record<Energy, number>>; mode: 'energy' | 'power'; signed?: boolean; dangerPositive?: boolean; negativeIsBenefit?: boolean }) {
  const entries = ENERGIES
    .filter((energy) => values[energy])
    .sort((a, b) => Math.abs(values[a] ?? 0) - Math.abs(values[b] ?? 0));
  if (entries.length === 0) return <span className="cost-pill">gratuit</span>;
  return (
    <span className="cost-pills">
      {entries.map((energy) => {
        const meta = ENERGY_META[energy];
        const value = values[energy] ?? 0;
        const sign = signed && value > 0 ? '+' : '';
        const formatted = mode === 'power' ? formatPower(value) : formatEnergyAmount(value);
        const isBenefit = negativeIsBenefit && value < 0;
        const isDanger = dangerPositive ? value > 0 : value < 0 && !isBenefit;
        return (
          <span className="cost-price" key={energy}>
            <span className={`cost-pill ${isDanger ? 'danger-pill' : ''} ${isBenefit ? 'benefit-pill' : ''}`} style={{ ['--accent' as string]: `var(${meta.cssVar})` }}>
              <img src={meta.icon} alt="" />
              {sign}{formatted}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function itemMatchesUpgrade(item: Technology, upgrade: Upgrade): boolean {
  return Boolean(upgrade.affectsTechnologyIds?.includes(item.id) || upgrade.affectsTags?.some((tag) => item.tags?.includes(tag)));
}

function multiplyValues(values: Partial<Record<Energy, number>> | undefined, multiplier: number) {
  const result: Partial<Record<Energy, number>> = {};
  for (const energy of ENERGIES) {
    const value = values?.[energy];
    if (value) result[energy] = value * multiplier;
  }
  return result;
}

function getNetProductionValues(item: Item, mode: keyof typeof MODE_CONFIG, purchasedUpgrades: Record<string, boolean>) {
  const result: Partial<Record<Energy, number>> = {};
  const productionMultiplier = !isUpgrade(item)
    ? MODE_CONFIG[mode].passiveGainMultiplier * getActiveMultiplier(item, purchasedUpgrades, 'productionMultiplier')
    : 1;

  for (const energy of ENERGIES) {
    const production = 'productionPerSecond' in item ? (item.productionPerSecond?.[energy] ?? 0) * productionMultiplier : 0;
    const consumption = 'consumptionPerSecond' in item ? item.consumptionPerSecond?.[energy] ?? 0 : 0;
    const net = !isUpgrade(item) && item.kind === 'conversion' ? consumption : production - consumption;
    if (net) result[energy] = net;
  }
  return result;
}

function getActiveMultiplier(item: Technology, purchasedUpgrades: Record<string, boolean>, key: 'productionMultiplier' | 'storageMultiplier') {
  return UPGRADES.reduce((multiplier, upgrade) => {
    if (!purchasedUpgrades[upgrade.id] || upgrade.appliesTo === 'existing' || !itemMatchesUpgrade(item, upgrade)) return multiplier;
    return multiplier * (upgrade.effect[key] ?? 1);
  }, 1);
}

export function Shop({ items, owned, purchasedUpgrades, constructions, energies, mode, pollutionVisible, slotsAvailable, slotCooldownRatio, onPurchase, onDismantle, getOptionCost, canAfford }: Props) {
  const [tab, setTab] = useState<Tab>('producer');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const slotsFull = constructions.length >= slotsAvailable;

  const visibleItems = useMemo(() => {
    if (tab === 'dismantle') return items.filter((item) => !isUpgrade(item) && item.removable && (owned[item.id] ?? 0) > 0);
    return items.filter((item) => getKind(item) === tab);
  }, [items, owned, tab]);

  return (
    <section className="panel shop-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Boutique</p>
          <h2>Technologies</h2>
        </div>
        <p className="small muted">{constructions.length}/{slotsAvailable} slots occupés</p>
      </div>

      <div className="tabs" role="tablist">
        {(Object.keys(tabLabels) as Tab[]).map((candidate) => (
          <button key={candidate} className={tab === candidate ? 'active' : ''} onClick={() => setTab(candidate)}>
            {tabLabels[candidate]}
          </button>
        ))}
      </div>

      <div className="shop-grid">
        {visibleItems.length === 0 ? (
          <p className="muted empty-shop">Rien ici pour le moment.</p>
        ) : visibleItems.map((item) => {
          const count = isUpgrade(item) ? (purchasedUpgrades[item.id] ? 1 : 0) : (owned[item.id] ?? 0);
          const isDone = isUpgrade(item) && purchasedUpgrades[item.id];
          const pendingPurchases = constructions
            .filter((construction) => construction.technologyId === item.id && construction.optionId !== 'dismantle')
            .reduce((total, construction) => total + construction.quantity, 0);
          const quantityLimitReached = !isUpgrade(item) && Boolean(item.maxQuantity && count + pendingPurchases >= item.maxQuantity);
          const productionValues = getNetProductionValues(item, mode, purchasedUpgrades);
          const negativeProductionIsBenefit = !isUpgrade(item) && item.kind === 'conversion';
          const storageValues = 'storageBonus' in item && item.storageBonus
            ? multiplyValues(item.storageBonus, !isUpgrade(item) ? getActiveMultiplier(item, purchasedUpgrades, 'storageMultiplier') : 1)
            : {};
          const selected = selectedItemId === item.id;
          return (
            <article className={`shop-card ${isDone ? 'owned-upgrade' : ''} ${selected ? 'selected-shop-card' : 'compact-shop-card'}`} key={item.id} onClick={() => setSelectedItemId(selected ? null : item.id)}>
              <img src={item.asset} alt="" />
              <div className="shop-card-body">
                {selected && (
                  <div className="shop-title-row">
                    <h3>{item.name}</h3>
                    <span className="pill">×{count}</span>
                  </div>
                )}
                {Object.keys(productionValues).length > 0 && (
                  <div className="tech-metric" title="Production nette"><span>Production</span><EnergyPills values={productionValues} mode="power" signed dangerPositive={negativeProductionIsBenefit} negativeIsBenefit={negativeProductionIsBenefit} /></div>
                )}
                {Object.keys(storageValues).length > 0 && (
                  <div className="tech-metric" title="Stockage"><span>Stockage</span><EnergyPills values={storageValues} mode="energy" signed /></div>
                )}
                {pollutionVisible && 'pollutionPerSecond' in item && item.pollutionPerSecond ? (
                  <div className="tech-metric negative" title="Pollution"><span aria-hidden="true">☁</span><span className="cost-pill danger-pill">+{formatNumber(item.pollutionPerSecond, 3)} %/s</span></div>
                ) : null}
                {pollutionVisible && 'pollutionDeltaPerSecond' in item && item.pollutionDeltaPerSecond && item.pollutionDeltaPerSecond < 0 ? (
                  <div className="tech-metric" title="Pollution"><span>Pollution</span><span className="cost-pill benefit-pill">{formatNumber(item.pollutionDeltaPerSecond, 3)} %/s</span></div>
                ) : null}
              </div>
              {tab === 'dismantle' && !isUpgrade(item) ? (
                <>
                  {selected && pollutionVisible && (item.pollutionPerSecond || item.hiddenPollutionDebtPerSecond) ? (
                    <div className="tech-metric dismantle-benefit" title="Réduction de pollution"><span>Pollution</span><span className="cost-pill benefit-pill">-{formatNumber(item.pollutionPerSecond ?? item.hiddenPollutionDebtPerSecond ?? 0, 3)} %/s</span></div>
                  ) : null}
                  {selected && <button className="secondary danger-button" disabled={slotsFull} onClick={(event) => { event.stopPropagation(); onDismantle(item.id); }}>Démanteler</button>}
                </>
              ) : (
                selected && <div className={`inline-options ${item.purchaseOptions.length === 2 ? 'two-options' : ''}`}>
                  {[...item.purchaseOptions].sort((a, b) => {
                    const totalA = ENERGIES.reduce((total, energy) => total + (getOptionCost(a, 1)[energy] ?? 0), 0);
                    const totalB = ENERGIES.reduce((total, energy) => total + (getOptionCost(b, 1)[energy] ?? 0), 0);
                    return totalA - totalB;
                  }).map((option, optionIndex) => {
                    const cost = getOptionCost(option, 1);
                    const affordable = canAfford(cost);
                    const requirementsOk = option.requirements?.every((required) => purchasedUpgrades[required] || (owned[required] ?? 0) > 0) ?? true;
                    const disabled = isDone || quantityLimitReached || slotsFull || !affordable || !requirementsOk;
                    const showSlotCooldown = slotsFull && affordable && requirementsOk && !isDone && !quantityLimitReached;
                    return (
                      <div className="option-choice" key={option.id}>
                        {optionIndex > 0 && item.purchaseOptions.length === 2 && <span className="option-separator">/</span>}
                        <button
                          className={`option-button ${showSlotCooldown ? 'has-slot-cooldown' : ''}`}
                          disabled={disabled}
                          onClick={(event) => { event.stopPropagation(); onPurchase(item.id, option.id, 1); }}
                        >
                          {showSlotCooldown && <span className="slot-cooldown" style={{ transform: `translateX(${-100 + Math.max(0, Math.min(1, slotCooldownRatio)) * 100}%)` }} />}
                          <span className="option-price-row">
                            <EnergyPills values={cost} mode="energy" />
                            <span className="option-time">{formatNumber(option.buildTimeSeconds, 1)} s</span>
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
