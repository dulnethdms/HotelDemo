import { useEffect } from 'react';
import { assetUrl } from '../api';

export default function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [index, items.length, onClose, onChange]);

  if (!item) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length); }} aria-label="Previous">‹</button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={assetUrl(item.image_url)} alt={item.title} />
        <figcaption>{item.title} <span>{index + 1} / {items.length}</span></figcaption>
      </figure>
      <button className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length); }} aria-label="Next">›</button>
    </div>
  );
}
