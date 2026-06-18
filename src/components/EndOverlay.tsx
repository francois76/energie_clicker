import type { Energy, EnergyState, GameMode, GamePhase } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';
import { formatEnergyAmount, formatNumber, formatPower } from '../utils/format';

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

export function EndOverlay({ state, onReset }: { state: EndState; onReset: () => void }) {
  if (state.phase !== 'gameOver' && state.phase !== 'final') return null;

  const isFinal = state.phase === 'final';
  return (
    <div className="modal-backdrop end-backdrop">
      <dialog open className={`end-modal ${isFinal ? 'success' : 'failure'}`}>
        <img src={isFinal ? 'assets/eras/era-06-future.svg' : 'assets/icons/pollution.svg'} alt="" />
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
          <div><strong>Électricité produite</strong><span>{formatEnergyAmount(state.totalElectricityProduced)}</span></div>
          <div><strong>Carburants consommés</strong><span>{formatEnergyAmount(state.totalFuelConsumed)}</span></div>
          <div><strong>Démantèlements</strong><span>{state.producersDismantled}</span></div>
          <div><strong>Améliorations</strong><span>{Object.values(state.purchasedUpgrades).filter(Boolean).length}</span></div>
        </div>
        <div className="mix-list">
          {ENERGIES.filter((energy) => state.energies[energy].unlocked).map((energy) => (
            <span key={energy}>{ENERGY_META[energy].short}: {formatPower(state.energies[energy].productionPerSecond)}</span>
          ))}
        </div>
        <div className="end-actions">
          <button className="primary" onClick={onReset}>Recommencer</button>
        </div>
      </dialog>
    </div>
  );
}
