import type { Era } from '../types';

export function ClickerButton({ era, onClick }: { era: Era; onClick: () => void }) {
  return (
    <section className="panel clicker-panel">
      <p className="eyebrow">Action manuelle</p>
      <button className="big-clicker" onClick={onClick} aria-label={era.clickAction.label}>
        <img src={era.buttonAsset} alt="" />
      </button>
      <h2>{era.clickAction.label}</h2>
      <p className="muted">Le clic reste utile, mais la production automatique doit vite prendre le relais.</p>
    </section>
  );
}
