import type { Energy, EnergyState, Era, GamePhase, Milestone } from '../types';
import { ALL_ITEMS, ENERGY_META } from '../data/gameData';
import { formatCountdown, formatPower } from '../utils/format';

const itemById = new Map(ALL_ITEMS.map((item) => [item.id, item]));

type Props = {
  era: Era;
  nextEra: Era | null;
  milestone: Milestone | null;
  isMilestoneVisible: boolean;
  phase: GamePhase;
  remainingSeconds: number;
  energies: Record<Energy, EnergyState>;
};

export function TimelinePanel({ era, nextEra, milestone, isMilestoneVisible, phase, remainingSeconds, energies }: Props) {
  const panelClass = phase === 'transition'
    ? 'timeline-panel transition-card'
    : milestone && isMilestoneVisible
      ? 'timeline-panel warning-card'
      : phase === 'finalHold'
        ? 'timeline-panel success-card'
        : 'timeline-panel quiet-card';
  return (
    <section className={`panel ${panelClass}`}>
      {phase === 'transition' && nextEra ? (
        <div>
          <p className="eyebrow">Transition automatique</p>
          <h3>Prochaine époque : {nextEra.name}</h3>
          <p className="countdown">Dans {formatCountdown(remainingSeconds)}</p>
          <div className="impact-grid">
            <div>
              <strong>Déblocages</strong>
              <div className="unlock-icons">
                {nextEra.technologiesUnlocked.map((itemId) => {
                  const item = itemById.get(itemId);
                  return item ? <img key={itemId} src={item.asset} alt={item.name} title={item.name} /> : null;
                })}
              </div>
            </div>
            <div>
              <strong>Slots</strong>
              <p>{nextEra.constructionSlots} chantiers en parallèle</p>
            </div>
          </div>
        </div>
      ) : milestone && isMilestoneVisible ? (
        <div>
          <p className="eyebrow">Jalon historique</p>
          <div className="announcement-title">
            <h3>{milestone.name}</h3>
            <span className="countdown">{formatCountdown(remainingSeconds)}</span>
          </div>
          <div className="impact-pills">
            {Object.entries(milestone.consumptionDelta).map(([energy, delta]) => {
              const e = energy as Energy;
              const current = energies[e];
              if (!current.unlocked && (delta ?? 0) <= 0) return null;
              return (
                <span className={`impact-pill ${(delta ?? 0) > 0 ? 'danger-pill' : 'benefit-pill'}`} key={energy} style={{ ['--accent' as string]: `var(${ENERGY_META[e].cssVar})` }}>
                  <img src={ENERGY_META[e].icon} alt="" />
                  {delta! >= 0 ? '+' : ''}{formatPower(delta ?? 0)}
                </span>
              );
            })}
          </div>
        </div>
      ) : phase === 'finalHold' ? (
        <div>
          <p className="eyebrow">Dernier jalon passé</p>
          <h3>Stabilisation finale</h3>
          <p className="countdown">Tiens encore {formatCountdown(remainingSeconds)}</p>
        </div>
      ) : (
        <p className="muted small">Aucune annonce immédiate.</p>
      )}
    </section>
  );
}

export function EraPanel({ era }: { era: Era }) {
  return (
    <section className="panel era-panel">
      <img src={era.asset} alt="" />
      <div>
        <p className="eyebrow">Phase courante</p>
        <h2>{era.name}</h2>
      </div>
    </section>
  );
}
