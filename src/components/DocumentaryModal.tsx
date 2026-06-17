import type { Documentary, Energy } from '../types';
import { ENERGY_META } from '../data/gameData';
import { formatPower } from '../utils/format';

export type DocumentaryContext = {
  consumptionDelta?: Partial<Record<Energy, number>>;
  unlockedItemNames?: string[];
};

export function RulesPanel() {
  return (
    <section className="panel documentary-panel">
      <p className="eyebrow">Règles</p>
      <h2>Survivre au mix</h2>
      <ul className="rules-list">
        <li>Clique pour produire immédiatement l’énergie de l’époque.</li>
        <li>Construis des technologies avant les jalons historiques.</li>
        <li>Garde les stocks au-dessus de zéro pendant les crises.</li>
        <li>Les moyens de production vieillissent et finissent par sortir du parc.</li>
        <li>Les changements d’époque débloquent des usages, mais ajoutent aussi de la demande.</li>
      </ul>
    </section>
  );
}

export function DocumentaryModal({ documentary, context, onClose }: { documentary: Documentary | null; context: DocumentaryContext | null; onClose: () => void }) {
  if (!documentary) return null;
  const unlockedItemNames = context?.unlockedItemNames ?? [];
  return (
    <div className="modal-backdrop documentary-backdrop" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" className="documentary-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button floating-close" onClick={onClose} aria-label="Fermer">×</button>
        <p className="eyebrow">Événement historique</p>
        <h2>{documentary.title}</h2>
        <div className="event-modal-grid">
          {context?.consumptionDelta && Object.keys(context.consumptionDelta).length > 0 && (
            <section>
              <h3>Consommations</h3>
              <ul>
                {Object.entries(context.consumptionDelta).map(([energy, value]) => (
                  <li key={energy}>{ENERGY_META[energy as Energy].label}: {value! >= 0 ? '+' : ''}{formatPower(value ?? 0)}</li>
                ))}
              </ul>
            </section>
          )}
          {unlockedItemNames.length > 0 && (
            <section>
              <h3>Déblocages</h3>
              <p>{unlockedItemNames.join(' · ')}</p>
            </section>
          )}
          <section>
            <h3>Fait culturel</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. {documentary.body}</p>
          </section>
        </div>
        <button className="primary modal-continue" onClick={onClose}>Continuer</button>
      </div>
    </div>
  );
}
