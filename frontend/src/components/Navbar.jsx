import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';

const LINKS = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/accommodation', 'Accommodation'],
  ['/gallery', 'Gallery'],
  ['/promotions', 'Promotions'],
  ['/location', 'Location'],
  ['/contact', 'Contact'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const overHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !overHero || open;

  return (
    <header className={`navbar ${solid ? 'navbar--solid' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" aria-label="Sample Hotel home"><Logo light={!solid} /></Link>
        <button className={`burger ${open ? 'is-open' : ''}`} aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Main">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
          ))}
          <Link to="/contact" className="btn btn--gold btn--sm navbar__cta">Enquire</Link>
        </nav>
      </div>
    </header>
  );
}
