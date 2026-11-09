import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { text } = useContent();
  const socials = [
    ['Facebook', text('social_facebook')], ['Instagram', text('social_instagram')],
    ['X / Twitter', text('social_twitter')], ['YouTube', text('social_youtube')],
  ].filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo light />
          <p className="footer__blurb">{text('footer_text', 'A luxury beachfront retreat where every wave brings calm.')}</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            {[['/about', 'About Us'], ['/accommodation', 'Accommodation & Packages'], ['/gallery', 'Gallery'], ['/promotions', 'Promotions']].map(([to, l]) => (
              <li key={to}><Link to={to}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Visit</h4>
          <ul>
            <li>{text('contact_address')}</li>
            <li><a href={`tel:${text('contact_phone').replace(/\s/g, '')}`}>{text('contact_phone')}</a></li>
            <li><a href={`mailto:${text('contact_email')}`}>{text('contact_email')}</a></li>
            <li><Link to="/location">Directions →</Link></li>
          </ul>
        </div>
        <div>
          <h4>Follow us</h4>
          <ul>
            {socials.map(([label, url]) => (
              <li key={label}><a href={url} target="_blank" rel="noopener noreferrer">{label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">© {new Date().getFullYear()} {text('hotel_name', 'Ocean Paradise Resort')}. All rights reserved.</div>
      </div>
    </footer>
  );
}
