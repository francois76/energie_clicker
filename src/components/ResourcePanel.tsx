import type { Energy, EnergyState } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatCountdown, formatEnergy, formatNumber, formatRate } from '../utils/format';

type Props = {
  energies: Record<Energy, EnergyState>;
  pollution: number;
  pollutionVisible: boolean;
  pollutionCountdown: number | null;
};

export function ResourcePanel({ energies, pollution, pollutionVisible, pollutionCountdown }: Props) {
  return (
    <section className="panel resource-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Jauges</p>
        </div>
      </div>
      <div className="resources-grid">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Stockage</th>
              <th>Production</th>
              <th>Consommation</th>
              <th>Delta</th>
            </tr>
          </thead>
          <tbody>
            {ENERGIES.map((energy) => {
              const meta = ENERGY_META[energy];
              const state = energies[energy];
              if (!state.unlocked) return null;
              const net = state.productionPerSecond - state.consumptionPerSecond;
              const ratio = state.capacity > 0 ? Math.max(0, Math.min(1, state.stock / state.capacity)) : 0;
              const danger = state.crisisCountdown != null;
              return (
                <tr className={danger ? 'danger' : ''} key={energy} style={{ ['--accent' as string]: `var(${meta.cssVar})` }}>
                  <td>
                    <span className="resource-storage">
                      <span className="resource-name">
                        <img src={meta.icon} alt="" />
                        <span>
                          <strong>{meta.label}</strong>
                          <small>{formatEnergy(state.stock, energy)} / {formatEnergy(state.capacity, energy)}</small>
                        </span>
                      </span>
                      <span className="storage-meter"><span style={{ transform: `scaleX(${ratio})` }} /></span>
                    </span>
                    {danger && <small className="danger-line">Crise : {formatCountdown(state.crisisCountdown ?? 0)}</small>}
                  </td>
                  <td>{formatRate(state.productionPerSecond, energy)}</td>
                  <td>{formatRate(state.consumptionPerSecond, energy)}</td>
                  <td><strong className={net >= 0 ? 'positive' : 'negative'}>{net > 0 ? '+' : ''}{formatRate(net, energy)}</strong></td>
                </tr>
              );
            })}
            {pollutionVisible && (
              <tr className={`pollution ${pollution >= 100 ? 'danger' : ''}`} style={{ ['--accent' as string]: 'var(--pollution)' }}>
                <td>
                  <span className="resource-storage">
                    <span className="resource-name">
                      <img src="assets/icons/pollution.svg" alt="" />
                      <span>
                        <strong>Pollution</strong>
                        <small>{formatNumber(pollution, 1)} % / seuil 100 %</small>
                      </span>
                    </span>
                    <span className="storage-meter"><span style={{ transform: `scaleX(${Math.max(0, Math.min(1, pollution / 100))})` }} /></span>
                  </span>
                  {pollutionCountdown != null && <small className="danger-line">Crise pollution : {formatCountdown(pollutionCountdown)}</small>}
                </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
