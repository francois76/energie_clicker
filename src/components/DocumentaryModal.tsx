import type { Documentary } from '../types';

export function DocumentaryModal({ documentary, onClose }: { documentary: Documentary; onClose: () => void }) {
  return (
    <div className="modal-backdrop documentary-backdrop" onMouseDown={onClose}>
      <dialog open className="documentary-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button floating-close" onClick={onClose} aria-label="Fermer">×</button>
        <p className="eyebrow">Encart documentaire</p>
        <h2>{documentary.title}</h2>
        <p>{documentary.body}</p>
        <div className="gameplay-note">
          <strong>Effet gameplay</strong>
          <p>{documentary.gameplay}</p>
        </div>
        {documentary.sourceUrl && (
          <a className="source-link" href={documentary.sourceUrl} target="_blank" rel="noreferrer">
            Source : {documentary.sourceLabel ?? documentary.sourceUrl}
          </a>
        )}
      </dialog>
    </div>
  );
}
