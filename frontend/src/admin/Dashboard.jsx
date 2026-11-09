import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard() {
  const [d, setD] = useState({ packages: [], promos: [], gallery: [], messages: [] });
  useEffect(() => {
    Promise.all([api.get('/packages/admin/all'), api.get('/promotions/admin/all'), api.get('/gallery'), api.get('/contact')])
      .then(([packages, promos, gallery, messages]) => setD({ packages, promos, gallery, messages })).catch(() => {});
  }, []);
  const unread = d.messages.filter((m) => !m.is_read).length;
  const cards = [
    ['Rooms & packages', d.packages.length, '/admin/packages'], ['Promotions', d.promos.length, '/admin/promotions'],
    ['Gallery images', d.gallery.length, '/admin/gallery'], ['Unread messages', unread, '/admin/messages'],
  ];
  return (
    <div>
      <div className="admin-head"><h1>Dashboard</h1></div>
      <div className="stat-cards">
        {cards.map(([l, n, to]) => <Link key={l} to={to} className="stat-card"><strong>{n}</strong><span>{l}</span></Link>)}
      </div>
      <div className="panel">
        <h2>Latest messages</h2>
        {d.messages.length === 0 ? <p className="muted">No messages yet.</p> : d.messages.slice(0, 5).map((m) => (
          <p key={m.id} className="latest"><strong>{m.name}</strong> <span className="muted">– {m.message.slice(0, 90)}{m.message.length > 90 ? '…' : ''}</span></p>
        ))}
        <Link to="/admin/messages" className="link">View all messages →</Link>
      </div>
      <div className="panel">
        <h2>Quick guide</h2>
        <p className="muted">Use <strong>Rooms & Packages</strong>, <strong>Promotions</strong> and <strong>Gallery</strong> to manage showcase content. Use <strong>Site Content & Contact</strong> to edit hotel descriptions, address, phone, email and social links. This panel does not handle bookings or payments.</p>
      </div>
    </div>
  );
}
