import { useMemo, useState } from 'react';
import { ClickerButton } from './components/ClickerButton';
import { ConstructionPanel } from './components/ConstructionPanel';
import { DebugPanel } from './components/DebugPanel';
import { DocumentaryModal, RulesPanel } from './components/DocumentaryModal';
import { EndOverlay } from './components/EndOverlay';
import { ProductionFleetPanel } from './components/ProductionFleetPanel';
import { ResourcePanel } from './components/ResourcePanel';
import { Shop } from './components/Shop';
import { EraPanel, TimelinePanel } from './components/TimelinePanel';
import { useGame } from './hooks/useGame';
import type { GameMode } from './types';

function getInitialMode(): GameMode {
  const params = new URLSearchParams(window.location.search);
  return params.get('demo') === '1' || params.get('mode') === 'demo' ? 'demo' : 'normal';
}

function getDebugFreeze(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has('debug') || params.get('debugFreeze') === '1';
}

export default function App() {
  const initialMode = useMemo(getInitialMode, []);
  const debugFreeze = useMemo(getDebugFreeze, []);
  const game = useGame(initialMode);
  const showDebug = game.state.mode === 'demo' || import.meta.env.DEV;
  const [confirmReset, setConfirmReset] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => !window.localStorage.getItem('energie-clicker-save-v1'));
  const slotCooldownRatio = game.state.constructions.length > 0
    ? Math.min(...game.state.constructions.map((construction) => construction.remainingSeconds / construction.totalSeconds))
    : 0;

  return (
    <main className="app-shell">
      <aside className="info-column">
        <header className="hero-card">
          <div className="time-controls">
            <button onClick={game.actions.cycleSpeed} aria-label="Vitesse">×{game.state.speed}</button>
            <button onClick={() => setConfirmReset(true)} aria-label="Difficulté">{game.state.mode === 'demo' ? 'Démo' : 'Normal'}</button>
            <button onClick={game.actions.togglePause} aria-label={game.state.paused ? 'Reprendre' : 'Pause'}>
              {game.state.paused ? '▶' : '⏸'}
            </button>
            <button
              onClick={() => {
                game.actions.reset();
                setShowWelcome(true);
              }}
              aria-label="Réinitialiser"
            >
              ↻
            </button>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Énergie Clicker</p>
            <h1>Énergie Clicker</h1>
          </div>
        </header>
        <EraPanel era={game.currentEra} />
        <TimelinePanel
          era={game.currentEra}
          nextEra={game.nextEra}
          milestone={game.currentMilestone}
          isMilestoneVisible={game.isMilestoneVisible}
          phase={game.state.phase}
          remainingSeconds={game.state.phaseRemainingSeconds}
          energies={game.state.energies}
        />
        <RulesPanel />
      </aside>

      <section className="production-column">
        <ResourcePanel
          energies={game.state.energies}
          pollution={game.state.pollution}
          pollutionRate={game.state.pollutionRate}
          pollutionVisible={game.state.pollutionVisible}
          pollutionCountdown={game.state.pollutionCountdown}
        />
        <ClickerButton era={game.currentEra} clickYield={game.clickYield} onClick={game.actions.click} />
        <ProductionFleetPanel
          ownedGenerations={game.state.ownedGenerations}
          mode={game.state.mode}
          energies={game.state.energies}
          demoGeneratorPower={game.state.demoGeneratorPower}
          onDemoGeneratorPowerChange={game.actions.setDemoGeneratorPower}
        />
      </section>

      <section className="shop-column">
        <Shop
          items={game.availableItems}
          owned={game.state.owned}
          purchasedUpgrades={game.state.purchasedUpgrades}
          constructions={game.state.constructions}
          energies={game.state.energies}
          mode={game.state.mode}
          pollutionVisible={game.state.pollutionVisible}
          slotsAvailable={game.availableSlots}
          slotCooldownRatio={slotCooldownRatio}
          onPurchase={game.actions.purchase}
          onDismantle={game.actions.dismantle}
          getOptionCost={game.actions.getOptionCost}
          canAfford={game.actions.canAfford}
        />
        <ConstructionPanel constructions={game.state.constructions} />
      </section>

      {showDebug && <DebugPanel state={game.state} debug={game.actions.debug} />}

      {!showWelcome && !debugFreeze && (
        <EndOverlay
          state={game.state}
          onReset={game.actions.reset}
        />
      )}

      {!showWelcome && !debugFreeze && <DocumentaryModal documentary={game.activeDocumentary} context={game.activeDocumentaryContext} onClose={game.actions.closeDocumentary} />}

      {confirmReset && (
        <div className="modal-backdrop" onMouseDown={() => setConfirmReset(false)}>
          <div role="dialog" aria-modal="true" className="reset-modal" onMouseDown={(event) => event.stopPropagation()}>
            <h2>Changer la difficulté ?</h2>
            <p className="muted">Changer de mode redémarre une nouvelle partie.</p>
            <div className="mode-choice-actions">
              <button className="secondary" onClick={() => setConfirmReset(false)}>Annuler</button>
              <button
                className="primary"
                onClick={() => {
                  game.actions.resetMode(game.state.mode === 'demo' ? 'normal' : 'demo');
                  setConfirmReset(false);
                }}
              >
                Passer en {game.state.mode === 'demo' ? 'normal' : 'démo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showWelcome && (
        <div className="modal-backdrop welcome-backdrop">
          <div role="dialog" aria-modal="true" className="welcome-modal">
            <p className="eyebrow">Bienvenue</p>
            <h2>Choisissez votre partie</h2>
            <div className="welcome-options">
              <button
                className="welcome-option"
                onClick={() => {
                  game.actions.resetMode('demo');
                  setShowWelcome(false);
                }}
              >
                <strong>Mode démo</strong>
                <span>Parcourir tout le jeu en 5 minutes, sans risque de perdre.</span>
              </button>
              <button
                className="welcome-option"
                onClick={() => {
                  game.actions.resetMode('normal');
                  setShowWelcome(false);
                }}
              >
                <strong>Mode normal</strong>
                <span>Jouer avec le rythme et les risques complets.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {game.state.paused && !debugFreeze && !game.activeDocumentary && game.state.phase !== 'gameOver' && game.state.phase !== 'final' && !confirmReset && !showWelcome && (
        <div className="modal-backdrop pause-backdrop">
          <div role="dialog" aria-modal="true" className="pause-modal">
            <div className="pause-symbol">⏸</div>
            <button className="primary pause-resume" onClick={game.actions.togglePause}>Reprendre</button>
          </div>
        </div>
      )}
    </main>
  );
}
