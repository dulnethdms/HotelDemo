import SmartImg from './SmartImg';
import Reveal from './Reveal';

const fmt = (d) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null);

export function validity(p) {
  if (p.valid_from && p.valid_until) return `${fmt(p.valid_from)} – ${fmt(p.valid_until)}`;
  if (p.valid_until) return `Until ${fmt(p.valid_until)}`;
  if (p.valid_from) return `From ${fmt(p.valid_from)}`;
  return 'Available year-round';
}

export default function PromoCard({ promo, delay = 0, banner = false }) {
  return (
    <Reveal as="article" className={`promo ${banner ? 'promo--banner' : ''}`} delay={delay}>
      <SmartImg src={promo.image_url} alt={promo.title} className="promo__img" />
      <div className="promo__overlay" />
      <div className="promo__content">
        {promo.discount_label && <span className="promo__badge">{promo.discount_label}</span>}
        <span className="eyebrow eyebrow--light">{promo.category}</span>
        <h3>{promo.title}</h3>
        <p>{promo.description}</p>
        <small>{validity(promo)}</small>
      </div>
    </Reveal>
  );
}
