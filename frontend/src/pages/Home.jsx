import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Logo from '../components/Logo';
import Reveal from '../components/Reveal';
import SmartImg from '../components/SmartImg';
import PackageCard from '../components/PackageCard';
import PromoCard from '../components/PromoCard';
import { SectionTitle, Loader } from '../components/Ui';
import { useContent } from '../context/ContentContext';
import useApi from '../hooks/useApi';
import { assetUrl } from '../api';

export default function Home() {
  const { text, json } = useContent();
  const { data: packages, loading: pl } = useApi('/packages');
  const { data: promos, loading: prl } = useApi('/promotions');
  const featured = packages.filter((p) => p.is_featured).slice(0, 3);
  const shownPackages = featured.length ? featured : packages.slice(0, 3);
  const stats = ['stat_1', 'stat_2', 'stat_3', 'stat_4'].map((k) => text(k).split('|')).filter((s) => s[0]);
  const hero = assetUrl(text('hero_image', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80'));
  const [hotelName, location] = text('hotel_name', 'Mora Mila - Arugam Bay').split(' - ');

  return (
    <>
      <Seo description="Luxury beachfront resort with ocean-view rooms, private villas, seaside dining and spa. Explore our packages, promotions and gallery." />

      <section className="hero" style={{ '--hero': `url(${hero})` }}>
        <div className="hero__content container">
          <div className="hero__logo"><Logo light size={64} /></div>
          <h1>
            <span className="hero__title-main">{hotelName}</span>
            {location && <span className="hero__location">- {location}</span>}
          </h1>
          <p className="hero__tagline">{text('tagline', 'Where the horizon becomes your home')}</p>
          <p className="hero__sub">{text('hero_subtitle')}</p>
          <div className="hero__cta">
            <Link to="/accommodation" className="btn btn--gold">Explore Rooms & Packages</Link>
            <Link to="/promotions" className="btn btn--ghost">View Promotions</Link>
            <Link to="/contact" className="btn btn--ghost">Contact Us</Link>
          </div>
        </div>
        <a href="#welcome" className="hero__scroll" aria-label="Scroll down"><span /></a>
      </section>

      
      <section className="section section--foam">
        <div className="container">
          <SectionTitle eyebrow="Highlights" title="Why guests fall in love with us" />
          <div className="grid grid--3">
            {json('highlights').map((h, i) => (
              <Reveal key={h.title} className="feature" delay={i * 70}>
                <span className="feature__icon" aria-hidden="true">{h.icon}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Stay With Us" title="Featured Rooms & Packages" text="Handpicked stays for every kind of getaway." />
          {pl ? <Loader /> : <div className="grid grid--3">{shownPackages.map((p, i) => <PackageCard key={p.id} pkg={p} delay={i * 100} />)}</div>}
          <div className="center mt"><Link to="/accommodation" className="btn btn--outline">See all accommodation</Link></div>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container">
          <SectionTitle eyebrow="Current Promotions" title="Special offers, limited time" light />
          {prl ? <Loader /> : promos.length === 0 ? <p className="center muted">New offers coming soon.</p> : (
            <div className="grid grid--2">{promos.slice(0, 2).map((p, i) => <PromoCard key={p.id} promo={p} delay={i * 100} />)}</div>
          )}
          <div className="center mt"><Link to="/promotions" className="btn btn--gold">All promotions</Link></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Guest Reviews" title="Loved by travellers from around the world" />
          <div className="grid grid--3">
            {json('reviews').map((r, i) => (
              <Reveal as="figure" key={r.name} className="review" delay={i * 100}>
                <div className="stars" aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <blockquote>“{r.text}”</blockquote>
                <figcaption><strong>{r.name}</strong><span>{r.country}</span></figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <Reveal className="container center">
          <h2>Your seaside escape awaits</h2>
          <p>Get in touch and our team will help you plan the perfect stay.</p>
          <Link to="/contact" className="btn btn--gold">Contact Us</Link>
        </Reveal>
      </section>
    </>
  );
}
