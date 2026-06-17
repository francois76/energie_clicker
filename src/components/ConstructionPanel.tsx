import type { Construction } from '../types';
import { ALL_ITEMS } from '../data/gameData';
import { formatCountdown } from '../utils/format';

const itemById = new Map(ALL_ITEMS.map((item) => [item.id, item]));

export function ConstructionPanel({ constructions }: { constructions: Construction[] }) {
  return (
    <section className="panel construction-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Chantiers</p>
          <h2>En cours</h2>
        </div>
      </div>
      {constructions.length === 0 ? (
        <p className="muted">Aucun chantier. Un jalon peut arriver pendant que tu hésites.</p>
      ) : (
        <div className="construction-list">
          {constructions.map((construction) => {
            const item = itemById.get(construction.technologyId);
            const progress = 1 - construction.remainingSeconds / construction.totalSeconds;
            return (
              <article className="construction-card" key={construction.id}>
                <img src={item?.asset} alt="" />
                <div className="construction-content">
                  <div className="construction-line">
                    <strong>{item?.name ?? construction.technologyId} ×{construction.quantity}</strong>
                    <span>{formatCountdown(construction.remainingSeconds)}</span>
                  </div>
                  <div className="meter"><span style={{ width: `${Math.max(2, progress * 100)}%` }} /></div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
