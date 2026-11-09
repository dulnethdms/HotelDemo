import { useEffect, useState } from 'react';
import { api } from '../api';

export default function MessagesAdmin() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const load = () => api.get('/contact').then(setItems).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const toggle = async (m) => { await api.patch(`/contact/${m.id}/read`, { is_read: !m.is_read }); load(); };
  const remove = async (m) => { if (window.confirm('Delete this message?')) { await api.del(`/contact/${m.id}`); load(); } };

  return (
    <div>
      <div className="admin-head"><h1>Contact Messages</h1></div>
      {err && <p className="alert alert--error">{err}</p>}
      {items.length === 0 && <div className="panel muted">No messages yet.</div>}
      {items.map((m) => (
        <article key={m.id} className={`panel message ${m.is_read ? '' : 'message--new'}`}>
          <header>
            <div><strong>{m.name}</strong> {!m.is_read && <span className="pill pill--on">New</span>}<br />
              <a className="link" href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <> · <a className="link" href={`tel:${m.phone}`}>{m.phone}</a></>}</div>
            <small className="muted">{new Date(m.created_at).toLocaleString()}</small>
          </header>
          <p>{m.message}</p>
          <div className="row-actions">
            <button className="btn btn--outline btn--sm" onClick={() => toggle(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
            <button className="btn btn--danger btn--sm" onClick={() => remove(m)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
