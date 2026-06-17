import type { OwnedGeneration } from '../types';
import { TECHNOLOGIES } from '../data/gameData';
import { formatCountdown } from '../utils/format';

const techById = new Map(TECHNOLOGIES.map((tech) => [tech.id, tech]));

function getLevelLabel(label: string) {
  if (label === 'Avant amélioration' || label === 'Génération initiale') return 'niv.1';
  return `niv.${label.split(' + ').length + 1}`;
}

export function ProductionFleetPanel({ ownedGenerations }: { ownedGenerations: Record<string, OwnedGeneration[]> }) {
  const grouped = new Map<string, { tech: NonNullable<ReturnType<typeof techById.get>>; label: string; quantity: number; remainingLifetimeSeconds: number; totalLifetimeSeconds: number }>();

  for (const [technologyId, generations] of Object.entries(ownedGenerations)) {
      const tech = techById.get(technologyId);
      if (!tech) continue;
      for (const generation of generations) {
        if (generation.quantity <= 0) continue;
        const key = `${technologyId}:${generation.label}`;
        const current = grouped.get(key);
        if (!current) {
          grouped.set(key, {
            tech,
            label: generation.label,
            quantity: generation.quantity,
            remainingLifetimeSeconds: generation.remainingLifetimeSeconds,
            totalLifetimeSeconds: generation.totalLifetimeSeconds
          });
        } else {
          current.quantity += generation.quantity;
          if (generation.remainingLifetimeSeconds < current.remainingLifetimeSeconds) {
            current.remainingLifetimeSeconds = generation.remainingLifetimeSeconds;
            current.totalLifetimeSeconds = generation.totalLifetimeSeconds;
          }
        }
      }
  }

  const rows = [...grouped.values()].sort((a, b) => a.remainingLifetimeSeconds - b.remainingLifetimeSeconds);

  return (
    <section className="panel fleet-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Parc réel</p>
          <h2>Moyens de production</h2>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="muted empty-shop">Aucun moyen construit.</p>
      ) : (
        <div className="fleet-list">
          {rows.map((row) => {
            const ratio = row.totalLifetimeSeconds > 0 ? row.remainingLifetimeSeconds / row.totalLifetimeSeconds : 0;
            return (
              <article className="fleet-row" key={`${row.tech.id}:${row.label}`}>
                <img src={row.tech.asset} alt="" />
                <div>
                  <div className="fleet-head">
                    <strong>{row.tech.name} ×{row.quantity}</strong>
                    <span>{formatCountdown(row.remainingLifetimeSeconds)}</span>
                  </div>
                  <p>{getLevelLabel(row.label)}</p>
                  <div className="fleet-meter"><span style={{ width: `${Math.max(2, Math.min(100, ratio * 100))}%` }} /></div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
