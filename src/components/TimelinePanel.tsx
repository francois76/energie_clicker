import type { Energy, EnergyState, Era, GamePhase, Milestone } from '../types';
import { ENERGY_META } from '../data/gameData';
import { formatCountdown, formatRate } from '../utils/format';

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
  return (
    <section className="panel timeline-panel">
      <div className="era-strip">
        <img src={era.asset} alt="" />
        <div>
          <p className="eyebrow">Époque actuelle</p>
          <h2>{era.name}</h2>
          <p>{era.description}</p>
        </div>
      </div>

      {phase === 'transition' && nextEra ? (
        <article className="event-card transition-card">
          <p className="eyebrow">Transition automatique</p>
          <h3>Prochaine époque : {nextEra.name}</h3>
          <p className="countdown">Dans {formatCountdown(remainingSeconds)}</p>
          <div className="impact-grid">
            <div>
              <strong>Déblocages</strong>
              <p>{nextEra.unlockedEnergies.map((e) => ENERGY_META[e].short).join(' · ')}</p>
            </div>
            <div>
              <strong>Slots</strong>
              <p>{nextEra.constructionSlots} chantiers en parallèle</p>
            </div>
          </div>
        </article>
      ) : milestone && isMilestoneVisible ? (
        <article className="event-card warning-card">
          <p className="eyebrow">Jalon historique</p>
          <h3>{milestone.name}</h3>
          <p className="countdown">Impact dans {formatCountdown(remainingSeconds)}</p>
          <div className="impact-grid">
            {Object.entries(milestone.consumptionDelta).map(([energy, delta]) => {
              const e = energy as Energy;
              const current = energies[e];
              if (!current.unlocked && (delta ?? 0) <= 0) return null;
              const afterNet = current.productionPerSecond - (current.consumptionPerSecond + (delta ?? 0));
              return (
                <div key={energy}>
                  <strong>{ENERGY_META[e].label}</strong>
                  <p>{delta! >= 0 ? '+' : ''}{delta} demande/s · futur net {formatRate(afterNet, e)}</p>
                </div>
              );
            })}
          </div>
        </article>
      ) : phase === 'finalHold' ? (
        <article className="event-card success-card">
          <p className="eyebrow">Dernier jalon passé</p>
          <h3>Stabilisation finale</h3>
          <p className="countdown">Tiens encore {formatCountdown(remainingSeconds)}</p>
        </article>
      ) : (
        <article className="event-card quiet-card">
          <p className="eyebrow">Jalon masqué</p>
          <h3>L’Histoire prépare le prochain choc</h3>
          <p>Il sera visible avant application. Profite-en pour équilibrer les soldes.</p>
        </article>
      )}
    </section>
  );
}
