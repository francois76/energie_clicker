import { useMemo, useState } from 'react';
import type { Construction, Energy, EnergyState, PurchaseOption, Technology, Upgrade } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatEnergy, formatNumber } from '../utils/format';

type Item = Technology | Upgrade;

type Props = {
  items: Item[];
  owned: Record<string, number>;
  purchasedUpgrades: Record<string, boolean>;
  constructions: Construction[];
  energies: Record<Energy, EnergyState>;
  slotsAvailable: number;
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

function costLabel(cost: Partial<Record<Energy, number>>) {
  const entries = ENERGIES.filter((energy) => cost[energy]);
  if (entries.length === 0) return 'gratuit';
  return entries.map((energy) => `${formatNumber(cost[energy] ?? 0)} ${ENERGY_META[energy].unit}`).join(' · ');
}

export function Shop({ items, owned, purchasedUpgrades, constructions, energies, slotsAvailable, onPurchase, onDismantle, getOptionCost, canAfford }: Props) {
  const [tab, setTab] = useState<Tab>('producer');
  const [selected, setSelected] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const slotsFull = constructions.length >= slotsAvailable;

  const visibleItems = useMemo(() => {
    if (tab === 'dismantle') return items.filter((item) => !isUpgrade(item) && item.removable && (owned[item.id] ?? 0) > 0);
    return items.filter((item) => getKind(item) === tab);
  }, [items, owned, tab]);

  const close = () => {
    setSelected(null);
    setQuantity(1);
  };

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
                  <span className="pill">×{count}</span>
                </div>
                <p>{item.description}</p>
                {'productionPerSecond' in item && item.productionPerSecond && (
                  <p className="small positive">Produit : {Object.entries(item.productionPerSecond).map(([energy, value]) => `${formatNumber(value)} ${ENERGY_META[energy as Energy].rateUnit}`).join(' · ')}</p>
                )}
                {'consumptionPerSecond' in item && item.consumptionPerSecond && (
                  <p className="small muted">Demande : {Object.entries(item.consumptionPerSecond).map(([energy, value]) => `${value! >= 0 ? '+' : ''}${formatNumber(value!)} ${ENERGY_META[energy as Energy].rateUnit}`).join(' · ')}</p>
                )}
                {'pollutionPerSecond' in item && item.pollutionPerSecond ? <p className="small negative">Pollution : +{formatNumber(item.pollutionPerSecond, 3)} %/s</p> : null}
              </div>
              {tab === 'dismantle' && !isUpgrade(item) ? (
                <button className="secondary danger-button" onClick={() => onDismantle(item.id)}>Démanteler</button>
              ) : (
                <button className="primary" onClick={() => setSelected(item)} disabled={slotsFull || isDone}>
                  {isDone ? 'Acheté' : slotsFull ? 'Slots pleins' : 'Construire'}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {selected && (
        <div className="modal-backdrop" onMouseDown={close}>
          <dialog open className="purchase-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <img src={selected.asset} alt="" />
              <div>
                <p className="eyebrow">Choix de construction</p>
                <h2>{selected.name}</h2>
                <p>{selected.description}</p>
              </div>
              <button className="icon-button" onClick={close} aria-label="Fermer">×</button>
            </div>

            <div className="quantity-row">
              <span>Quantité</span>
              <div>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <strong>{quantity}</strong>
                <button onClick={() => setQuantity(Math.min(9, quantity + 1))}>+</button>
              </div>
            </div>

            <div className="options-list">
              {selected.purchaseOptions.map((option) => {
                const cost = getOptionCost(option, quantity);
                const affordable = canAfford(cost);
                const requirementsOk = option.requirements?.every((required) => purchasedUpgrades[required] || (owned[required] ?? 0) > 0) ?? true;
                return (
                  <article className="option-card" key={option.id}>
                    <div>
                      <h3>{option.label}</h3>
                      <p>Coût : {costLabel(cost)}</p>
                      <p>Temps : {formatNumber(option.buildTimeSeconds * Math.sqrt(quantity), 1)} s base</p>
                      {option.pollutionDebt ? <p className="negative">Dette pollution construction : +{formatNumber(option.pollutionDebt)} %</p> : null}
                      {option.note ? <p className="muted">{option.note}</p> : null}
                      {!requirementsOk && <p className="negative">Pré-requis manquant.</p>}
                    </div>
                    <button
                      className="primary"
                      disabled={!affordable || !requirementsOk || slotsFull}
                      onClick={() => {
                        onPurchase(selected.id, option.id, quantity);
                        close();
                      }}
                    >
                      {!affordable ? 'Ressources insuffisantes' : 'Construire'}
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="modal-energy-footer">
              {ENERGIES.filter((energy) => energies[energy].unlocked).map((energy) => (
                <span key={energy}>{ENERGY_META[energy].short}: {formatEnergy(energies[energy].stock, energy)}</span>
              ))}
            </div>
          </dialog>
        </div>
      )}
    </section>
  );
}
