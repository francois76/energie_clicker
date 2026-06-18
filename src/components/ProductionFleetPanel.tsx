import type { Energy, EnergyState, GameMode, OwnedGeneration } from '../types';
import { ENERGIES, ENERGY_META, TECHNOLOGIES } from '../data/gameData';
import { formatCountdown, formatPower } from '../utils/format';

const techById = new Map(TECHNOLOGIES.map((tech) => [tech.id, tech]));

function getLevelLabel(label: string) {
  if (label === 'Avant amélioration' || label === 'Génération initiale') return 'niv.1';
  return `niv.${label.split(' + ').length + 1}`;
}

export function ProductionFleetPanel({
  ownedGenerations,
  mode,
  energies,
  demoGeneratorPower,
  onDemoGeneratorPowerChange
}: {
  ownedGenerations: Record<string, OwnedGeneration[]>;
  mode: GameMode;
  energies: Record<Energy, EnergyState>;
  demoGeneratorPower: number;
  onDemoGeneratorPowerChange: (power: number) => void;
}) {
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
      {mode === 'demo' && (
        <article className="fleet-generator">
          <div className="fleet-head">
            <strong>Générateur universel infini programmable</strong>
            <span>{formatPower(demoGeneratorPower)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="5"
            value={demoGeneratorPower}
            onChange={(event) => onDemoGeneratorPowerChange(Number(event.target.value))}
            aria-label="Puissance du générateur universel"
          />
          <div className="generator-energy-list">
            {ENERGIES.filter((energy) => energies[energy].unlocked).map((energy) => (
              <span key={energy} style={{ ['--accent' as string]: `var(${ENERGY_META[energy].cssVar})` }}>
                <img src={ENERGY_META[energy].icon} alt="" />
                {ENERGY_META[energy].short}
              </span>
            ))}
          </div>
        </article>
      )}
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
