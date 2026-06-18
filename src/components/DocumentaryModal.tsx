import type { Documentary, Energy } from '../types';
import { ENERGY_META } from '../data/gameData';
import { DOCUMENTARY_DRAFTS } from '../data/documentaryContent';
import { formatPower } from '../utils/format';

export type DocumentaryContext = {
  consumptionDelta?: Partial<Record<Energy, number>>;
  unlockedItems?: Array<{ name: string; description: string; asset: string }>;
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
  const enrichedDocumentary = DOCUMENTARY_DRAFTS[documentary.id] ?? documentary;
  const unlockedItems = context?.unlockedItems ?? [];
  return (
    <div className="modal-backdrop documentary-backdrop" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" className="documentary-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button floating-close" onClick={onClose} aria-label="Fermer">×</button>
        <p className="eyebrow">Événement historique</p>
        <h2>{enrichedDocumentary.title}</h2>
        <div className="event-modal-grid">
          {context?.consumptionDelta && Object.keys(context.consumptionDelta).length > 0 && (
            <section>
              <h3>Consommations</h3>
              <div className="impact-pills">
                {Object.entries(context.consumptionDelta).map(([energy, value]) => (
                  <span className={`impact-pill ${(value ?? 0) > 0 ? 'danger-pill' : 'benefit-pill'}`} key={energy} style={{ ['--accent' as string]: `var(${ENERGY_META[energy as Energy].cssVar})` }}>
                    <img src={ENERGY_META[energy as Energy].icon} alt="" />
                    {value! >= 0 ? '+' : ''}{formatPower(value ?? 0)}
                  </span>
                ))}
              </div>
            </section>
          )}
          {unlockedItems.length > 0 && (
            <section>
              <h3>Déblocages</h3>
              <ul className="unlock-detail-list">
                {unlockedItems.map((item) => (
                  <li key={item.name}>
                    <img src={item.asset} alt="" />
                    <span><strong>{item.name}</strong> : {item.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h3>Contexte historique</h3>
            <p>{enrichedDocumentary.body}</p>
          </section>
          <section className="gameplay-note">
            <h3>Lecture gameplay</h3>
            <p>{enrichedDocumentary.gameplay}</p>
          </section>
          {enrichedDocumentary.sourceUrl && (
            <section>
              <h3>Source</h3>
              <p>
                <a className="source-link" href={enrichedDocumentary.sourceUrl} target="_blank" rel="noreferrer">
                  {enrichedDocumentary.sourceLabel ?? enrichedDocumentary.sourceUrl}
                </a>
              </p>
            </section>
          )}
        </div>
        <button className="primary modal-continue" onClick={onClose}>Continuer</button>
      </div>
    </div>
  );
}
