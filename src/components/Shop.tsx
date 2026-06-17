import { useMemo, useState } from 'react';
import type { Construction, Energy, EnergyState, PurchaseOption, Technology, Upgrade } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatEnergyAmount, formatNumber, formatPower } from '../utils/format';

type Item = Technology | Upgrade;

type Props = {
  items: Item[];
  owned: Record<string, number>;
  purchasedUpgrades: Record<string, boolean>;
  constructions: Construction[];
  energies: Record<Energy, EnergyState>;
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

function EnergyPills({ values, mode, signed = false }: { values: Partial<Record<Energy, number>>; mode: 'energy' | 'power'; signed?: boolean }) {
  const entries = ENERGIES.filter((energy) => values[energy]);
  if (entries.length === 0) return <span className="cost-pill">gratuit</span>;
  return (
    <span className="cost-pills">
      {entries.map((energy) => {
        const meta = ENERGY_META[energy];
        const value = values[energy] ?? 0;
        const sign = signed && value > 0 ? '+' : '';
        const formatted = mode === 'power' ? formatPower(value) : formatEnergyAmount(value);
        return (
          <span className="cost-pill" key={energy} style={{ ['--accent' as string]: `var(${meta.cssVar})` }}>
            <img src={meta.icon} alt="" />
            {sign}{formatted}
          </span>
        );
      })}
    </span>
  );
}

export function Shop({ items, owned, purchasedUpgrades, constructions, energies, slotsAvailable, slotCooldownRatio, onPurchase, onDismantle, getOptionCost, canAfford }: Props) {
  const [tab, setTab] = useState<Tab>('producer');
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
          return (
            <article className={`shop-card ${isDone ? 'owned-upgrade' : ''}`} key={item.id}>
              <img src={item.asset} alt="" />
              <div className="shop-card-body">
                <div className="shop-title-row">
                  <h3>{item.name}</h3>
                  {(isUpgrade(item) || item.kind !== 'producer' || count === 0) && <span className="pill">×{count}</span>}
                </div>
                <p>{item.description}</p>
                {'productionPerSecond' in item && item.productionPerSecond && (
                  <div className="tech-metric positive"><span>Produit kW/h</span><EnergyPills values={item.productionPerSecond} mode="power" /></div>
                )}
                {'consumptionPerSecond' in item && item.consumptionPerSecond && (
                  <div className="tech-metric muted"><span>Demande kW/h</span><EnergyPills values={item.consumptionPerSecond} mode="power" signed /></div>
                )}
                {'storageBonus' in item && item.storageBonus && (
                  <div className="tech-metric muted"><span>Stock kW</span><EnergyPills values={item.storageBonus} mode="energy" signed /></div>
                )}
                {'pollutionPerSecond' in item && item.pollutionPerSecond ? <p className="small negative">Pollution : +{formatNumber(item.pollutionPerSecond, 3)} %/s</p> : null}
              </div>
              {tab === 'dismantle' && !isUpgrade(item) ? (
                <button className="secondary danger-button" onClick={() => onDismantle(item.id)}>Démanteler</button>
              ) : (
                <div className="inline-options">
                  {item.purchaseOptions.map((option, optionIndex) => {
                    const cost = getOptionCost(option, 1);
                    const affordable = canAfford(cost);
                    const requirementsOk = option.requirements?.every((required) => purchasedUpgrades[required] || (owned[required] ?? 0) > 0) ?? true;
                    const disabled = isDone || slotsFull || !affordable || !requirementsOk;
                    const showSlotCooldown = slotsFull && affordable && requirementsOk && !isDone;
                    return (
                      <div className="option-choice" key={option.id}>
                        {optionIndex > 0 && <span className="option-separator">ou</span>}
                        <span className="option-label-row">
                          {optionIndex === 0 ? <span>{isDone ? 'Acheté' : 'Acheter'}</span> : <span />}
                        </span>
                        <button
                          className={`option-button ${showSlotCooldown ? 'has-slot-cooldown' : ''}`}
                          disabled={disabled}
                          onClick={() => onPurchase(item.id, option.id, 1)}
                        >
                          {showSlotCooldown && <span className="slot-cooldown" style={{ transform: `translateX(${-100 + Math.max(0, Math.min(1, slotCooldownRatio)) * 100}%)` }} />}
                          <span className="option-price-row">
                            <EnergyPills values={cost} mode="energy" />
                            <span>{formatNumber(option.buildTimeSeconds, 1)} s</span>
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
