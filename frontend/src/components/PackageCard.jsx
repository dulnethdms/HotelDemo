import SmartImg from './SmartImg';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

export default function PackageCard({ pkg, delay = 0 }) {
  const { text } = useContent();
  const sym = text('currency_symbol', '$');
  return (
    <Reveal as="article" className="card pkg-card" delay={delay}>
      <div className="card__media">
        <SmartImg src={pkg.image_url} alt={pkg.name} />
        <span className="tag">{pkg.category === 'room' ? 'Room' : 'Package'}</span>
        {pkg.special_offer && <span className="ribbon">{pkg.special_offer}</span>}
      </div>
      <div className="card__body">
        <h3>{pkg.name}</h3>
        <p>{pkg.description}</p>
        {pkg.features?.length > 0 && (
          <ul className="checklist">
            {pkg.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        )}
        <div className="pkg-card__price">
          <span>From</span>
          <strong>{sym}{Number(pkg.price).toLocaleString()}</strong>
          {pkg.price_note && <small>{pkg.price_note}</small>}
        </div>
      </div>
    </Reveal>
  );
}
