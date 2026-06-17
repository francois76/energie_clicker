import { useMemo } from 'react';
import { ClickerButton } from './components/ClickerButton';
import { ConstructionPanel } from './components/ConstructionPanel';
import { DebugPanel } from './components/DebugPanel';
import { DocumentaryModal } from './components/DocumentaryModal';
import { EndOverlay } from './components/EndOverlay';
import { ResourcePanel } from './components/ResourcePanel';
import { Shop } from './components/Shop';
import { TimelinePanel } from './components/TimelinePanel';
import { useGame } from './hooks/useGame';
import type { GameMode } from './types';

function getInitialMode(): GameMode {
  const params = new URLSearchParams(window.location.search);
  return params.get('demo') === '1' || params.get('mode') === 'demo' ? 'demo' : 'normal';
}

export default function App() {
  const initialMode = useMemo(getInitialMode, []);
  const game = useGame(initialMode);
  const showDebug = game.state.mode === 'demo' || import.meta.env.DEV;

  return (
    <main className="app-shell">
      <header className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">POC · Cookie Clicker énergétique français</p>
          <h1>Énergie Clicker</h1>
          <p>
            L’Histoire avance toute seule. Clique, construis, stocke, convertis — et évite la crise énergétique ou pollution.
          </p>
          <div className="mode-row">
            <span className={`pill ${game.state.mode === 'demo' ? 'pill-demo' : ''}`}>
              Mode {game.state.mode === 'demo' ? 'démo' : 'normal'}
            </span>
            <span className="pill">x{game.state.speed} temps</span>
            <span className="pill">{game.availableSlots - game.state.constructions.length}/{game.availableSlots} slots libres</span>
          </div>
        </div>
        <img src={game.currentEra.asset} alt="" className="hero-illustration" />
      </header>

      <section className="top-grid">
        <TimelinePanel
          era={game.currentEra}
          nextEra={game.nextEra}
          milestone={game.currentMilestone}
          isMilestoneVisible={game.isMilestoneVisible}
          phase={game.state.phase}
          remainingSeconds={game.state.phaseRemainingSeconds}
          energies={game.state.energies}
        />
        <ResourcePanel
          energies={game.state.energies}
          pollution={game.state.pollution}
          pollutionRate={game.state.pollutionRate}
          pollutionVisible={game.state.pollutionVisible}
          pollutionCountdown={game.state.pollutionCountdown}
        />
      </section>

      <section className="play-grid">
        <div className="left-column">
          <ClickerButton era={game.currentEra} onClick={game.actions.click} />
          <ConstructionPanel constructions={game.state.constructions} />
        </div>
        <Shop
          items={game.availableItems}
          owned={game.state.owned}
          purchasedUpgrades={game.state.purchasedUpgrades}
          constructions={game.state.constructions}
          energies={game.state.energies}
          slotsAvailable={game.availableSlots}
          onPurchase={game.actions.purchase}
          onDismantle={game.actions.dismantle}
          getOptionCost={game.actions.getOptionCost}
          canAfford={game.actions.canAfford}
        />
      </section>

      {showDebug && <DebugPanel state={game.state} debug={game.actions.debug} />}

      {game.activeDocumentary && (
        <DocumentaryModal documentary={game.activeDocumentary} onClose={game.actions.closeDocumentary} />
      )}

      <EndOverlay
        state={game.state}
        onRefuel={game.actions.refuelAndContinue}
      />
    </main>
  );
}
