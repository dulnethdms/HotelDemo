import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { PageHeader, SectionTitle } from '../components/Ui';
import { useContent } from '../context/ContentContext';

export default function Location() {
  const { text, json } = useContent();
  const query = text('map_query') || text('contact_address') || 'Mirissa Beach, Sri Lanka';
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(text('contact_address') || query)}`;
  const phone = text('contact_phone');

  return (
    <>
      <Seo title="Location" description="Find Sample Hotel: address, interactive map, directions and nearby attractions." />
      <PageHeader title="Location" subtitle="Find your way to the shore" />
      <section className="section">
        <div className="container location">
          <Reveal className="location__map">
            <iframe title="Sample Hotel on Google Maps" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </Reveal>
          <Reveal className="location__info" delay={120}>
            <h2>Visit Us</h2>
            <ul className="contact-list">
              <li><span aria-hidden="true">📍</span><div><strong>Address</strong>{text('contact_address')}</div></li>
              <li><span aria-hidden="true">📞</span><div><strong>Phone</strong><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></div></li>
              <li><span aria-hidden="true">✉️</span><div><strong>Email</strong><a href={`mailto:${text('contact_email')}`}>{text('contact_email')}</a></div></li>
              <li><span aria-hidden="true">🕒</span><div><strong>Reception</strong>{text('contact_hours')}</div></li>
            </ul>
            <a className="btn btn--gold" href={directions} target="_blank" rel="noopener noreferrer">Get Directions</a>
          </Reveal>
        </div>
      </section>

      <section className="section section--foam">
        <div className="container">
          <SectionTitle eyebrow="Nearby Attractions" title="Explore beyond the beach" />
          <div className="grid grid--4">
            {json('attractions').map((a, i) => (
              <Reveal key={a.name} className="attraction" delay={i * 80}>
                <span className="attraction__dist">{a.distance}</span>
                <h3>{a.name}</h3>
                <p>{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
