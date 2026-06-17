import type { Energy, EnergyState } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatCountdown, formatEnergy, formatNumber, formatRate } from '../utils/format';

type Props = {
  energies: Record<Energy, EnergyState>;
  pollution: number;
  pollutionRate: number;
  pollutionVisible: boolean;
  pollutionCountdown: number | null;
};

export function ResourcePanel({ energies, pollution, pollutionRate, pollutionVisible, pollutionCountdown }: Props) {
  return (
    <section className="panel resource-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Jauges</p>
          <h2>Ressources</h2>
        </div>
      </div>
      <div className="resources-grid">
        {ENERGIES.map((energy) => {
          const meta = ENERGY_META[energy];
          const state = energies[energy];
          if (!state.unlocked) {
            return (
              <article className="resource-card locked" key={energy}>
                <img src={meta.icon} alt="" />
                <div>
                  <h3>{meta.label}</h3>
                  <p>Pas encore introduite</p>
                </div>
              </article>
            );
          }
          const net = state.productionPerSecond - state.consumptionPerSecond;
          const ratio = state.capacity > 0 ? state.stock / state.capacity : 0;
          const danger = state.crisisCountdown != null;
          return (
            <article className={`resource-card ${danger ? 'danger' : ''}`} key={energy} style={{ ['--accent' as string]: `var(${meta.cssVar})` }}>
              <div className="resource-head">
                <img src={meta.icon} alt="" />
                <div>
                  <h3>{meta.label}</h3>
                  <p>{formatEnergy(state.stock, energy)} / {formatEnergy(state.capacity, energy)}</p>
                </div>
              </div>
              <div className="meter"><span style={{ width: `${Math.max(2, Math.min(100, ratio * 100))}%` }} /></div>
              <div className="resource-rates">
                <span>{formatRate(state.productionPerSecond, energy)}</span>
                <span className="negative">-{formatNumber(state.consumptionPerSecond)} {meta.rateUnit}</span>
                <strong className={net >= 0 ? 'positive' : 'negative'}>{formatRate(net, energy)} net</strong>
              </div>
              {danger && <p className="danger-line">Crise : {formatCountdown(state.crisisCountdown ?? 0)} ⚠️</p>}
            </article>
          );
        })}
        <article className={`resource-card pollution ${pollutionVisible && pollution >= 100 ? 'danger' : ''}`} style={{ ['--accent' as string]: 'var(--pollution)' }}>
          <div className="resource-head">
            <img src="/assets/icons/pollution.svg" alt="" />
            <div>
              <h3>Pollution</h3>
              <p>{pollutionVisible ? `${formatNumber(pollution, 1)} %` : 'Dette cachée'}</p>
            </div>
          </div>
          {pollutionVisible ? (
            <>
              <div className="meter"><span style={{ width: `${Math.max(2, Math.min(100, pollution))}%` }} /></div>
              <div className="resource-rates">
                <span>Seuil critique : 100 %</span>
                <strong className={pollutionRate <= 0 ? 'positive' : 'negative'}>{formatNumber(pollutionRate, 3)} %/s</strong>
              </div>
              {pollutionCountdown != null && <p className="danger-line">Crise pollution : {formatCountdown(pollutionCountdown)} ⚠️</p>}
            </>
          ) : (
            <p className="muted small">Inactive pour l’instant, mais les technologies sales la chargent déjà.</p>
          )}
        </article>
      </div>
    </section>
  );
}
