import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { api, setToken, getToken } from '../api';
import Logo from '../components/Logo';

const NAV = [
  ['/admin', 'Dashboard', true], ['/admin/packages', 'Rooms & Packages'], ['/admin/promotions', 'Promotions'],
  ['/admin/gallery', 'Gallery'], ['/admin/content', 'Site Content & Contact'], ['/admin/messages', 'Messages'], ['/admin/account', 'Account'],
];

export default function AdminLayout() {
  const nav = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.title = 'Admin | Sample Hotel';
    if (!getToken()) return nav('/admin/login', { replace: true });
    api.get('/auth/me').then((r) => setAdmin(r.admin)).catch(() => { setToken(null); nav('/admin/login', { replace: true }); });
  }, [nav]);

  const logout = () => { setToken(null); nav('/admin/login', { replace: true }); };
  if (!admin) return null;

  return (
    <div className="admin">
      <aside className={`admin__side ${menu ? 'is-open' : ''}`}>
        <Logo light />
        <nav onClick={() => setMenu(false)}>
          {NAV.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}
        </nav>
        <div className="admin__foot">
          <Link to="/" target="_blank">View website ↗</Link>
          <button onClick={logout}>Sign out ({admin.username})</button>
        </div>
      </aside>
      <div className="admin__main">
        <button className="admin__menu btn btn--outline btn--sm" onClick={() => setMenu(!menu)}>☰ Menu</button>
        <Outlet />
      </div>
    </div>
  );
}
