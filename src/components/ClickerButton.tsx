import type { Energy, Era } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatEnergy } from '../utils/format';

export function ClickerButton({ era, clickYield, onClick }: { era: Era; clickYield: Partial<Record<Energy, number>>; onClick: () => void }) {
  return (
    <section className="panel clicker-panel">
      <div className="clicker-main">
        <button className="big-clicker" onClick={onClick} aria-label={era.clickAction.label}>
          <img src={era.buttonAsset} alt="" />
        </button>
        <div className="click-yield">
          <p className="eyebrow">Produit par clic kW</p>
          {ENERGIES.filter((energy) => clickYield[energy]).map((energy) => {
            const meta = ENERGY_META[energy];
            return (
              <span key={energy} style={{ ['--accent' as string]: `var(${meta.cssVar})` }}>
                <img src={meta.icon} alt="" />
                +{formatEnergy(clickYield[energy] ?? 0, energy)}
              </span>
            );
          })}
        </div>
      </div>
      <h2>{era.clickAction.label}</h2>
    </section>
  );
}
