import type { Energy, EnergyState, GameMode, GamePhase } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatEnergy, formatNumber } from '../utils/format';

type EndState = {
  mode: GameMode;
  phase: GamePhase;
  elapsedSeconds: number;
  pollution: number;
  energies: Record<Energy, EnergyState>;
  totalElectricityProduced: number;
  totalFuelConsumed: number;
  producersDismantled: number;
  purchasedUpgrades: Record<string, boolean>;
};

function formatTime(seconds: number) {
  const rounded = Math.round(seconds);
  const min = Math.floor(rounded / 60);
  const sec = rounded % 60;
  return `${min} min ${String(sec).padStart(2, '0')} s`;
}

export function EndOverlay({ state, onRefuel }: { state: EndState; onRefuel: () => void }) {
  if (state.phase !== 'gameOver' && state.phase !== 'final') return null;

  const isFinal = state.phase === 'final';
  return (
    <div className="modal-backdrop end-backdrop">
      <dialog open className={`end-modal ${isFinal ? 'success' : 'failure'}`}>
        <img src={isFinal ? '/assets/eras/era-06-future.svg' : '/assets/icons/pollution.svg'} alt="" />
        <p className="eyebrow">{isFinal ? 'Écran final' : 'Crise'}</p>
        <h2>{isFinal ? 'Vous avez traversé l’histoire énergétique française.' : 'Effondrement énergétique'}</h2>
        <p>
          {isFinal
            ? 'Le jeu ne prétend pas que la crise est résolue. Il montre surtout les arbitrages, inerties et tensions du mix.'
            : 'Une jauge critique est restée trop longtemps dans le rouge.'}
        </p>
        <div className="stats-grid">
          <div><strong>Temps</strong><span>{formatTime(state.elapsedSeconds)}</span></div>
          <div><strong>Pollution</strong><span>{formatNumber(state.pollution, 1)} %</span></div>
          <div><strong>Électricité produite</strong><span>{formatEnergy(state.totalElectricityProduced, 'electricity')}</span></div>
          <div><strong>Carburants consommés</strong><span>{formatEnergy(state.totalFuelConsumed, 'fuel')}</span></div>
          <div><strong>Démantèlements</strong><span>{state.producersDismantled}</span></div>
          <div><strong>Améliorations</strong><span>{Object.values(state.purchasedUpgrades).filter(Boolean).length}</span></div>
        </div>
        <div className="mix-list">
          {ENERGIES.filter((energy) => state.energies[energy].unlocked).map((energy) => (
            <span key={energy}>{ENERGY_META[energy].short}: {formatNumber(state.energies[energy].productionPerSecond, 1)} prod/s</span>
          ))}
        </div>
        {!isFinal && state.mode === 'demo' && (
          <button className="primary" onClick={onRefuel}>Refuel et continuer</button>
        )}
      </dialog>
    </div>
  );
}
