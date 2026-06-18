import { useState } from 'react';
import type { Energy, GameMode } from '../types';
import { ENERGIES, ENERGY_META } from '../data/gameData';

type DebugActions = {
  addEnergy: (energy: Energy, amount?: number) => void;
  clearPollution: () => void;
  nextMilestone: () => void;
  nextEra: () => void;
  setSpeed: (speed: number) => void;
  toggleGameOver: () => void;
};

type DebugState = {
  mode: GameMode;
  speed: number;
  allowGameOver: boolean;
};

export function DebugPanel({ state, debug }: { state: DebugState; debug: DebugActions }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={`debug-panel ${open ? 'open' : ''}`}>
      <button className="debug-toggle" onClick={() => setOpen(!open)}>{open ? '×' : 'Debug'}</button>
      {open && (
        <div className="debug-content">
          <p className="eyebrow">Mode démo/dev</p>
          <h3>Debug</h3>
          <div className="debug-actions">
            {ENERGIES.map((energy) => (
              <button key={energy} onClick={() => debug.addEnergy(energy)}>
                + {ENERGY_META[energy].short}
              </button>
            ))}
            {state.mode === 'demo' && <button onClick={debug.clearPollution}>Vider pollution</button>}
            <button onClick={debug.nextMilestone}>Sauter jalon</button>
            <button onClick={debug.nextEra}>Sauter époque</button>
            {[1, 3, 10].map((speed) => (
              <button className={state.speed === speed ? 'active' : ''} key={speed} onClick={() => debug.setSpeed(speed)}>
                Temps x{speed}
              </button>
            ))}
            {state.mode !== 'demo' && (
              <button onClick={debug.toggleGameOver}>{state.allowGameOver ? 'Désactiver' : 'Activer'} game over</button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
