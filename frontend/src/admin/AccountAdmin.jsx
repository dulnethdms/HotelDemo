import { useState } from 'react';
import { api } from '../api';

export default function AccountAdmin() {
  const [f, setF] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.newPassword !== f.confirm) return setMsg({ type: 'error', text: 'New passwords do not match' });
    try {
      await api.put('/auth/password', { currentPassword: f.currentPassword, newPassword: f.newPassword });
      setMsg({ type: 'ok', text: 'Password updated' });
      setF({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (x) { setMsg({ type: 'error', text: x.message }); }
  };

  return (
    <div>
      <div className="admin-head"><h1>Account</h1></div>
      <form className="panel" onSubmit={submit} style={{ maxWidth: 520 }}>
        <h2>Change password</h2>
        <div className="field"><label>Current password</label><input type="password" value={f.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" required /></div>
        <div className="field"><label>New password (min 10 characters)</label><input type="password" value={f.newPassword} onChange={set('newPassword')} autoComplete="new-password" minLength={10} required /></div>
        <div className="field"><label>Confirm new password</label><input type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" required /></div>
        {msg.text && <p className={`alert alert--${msg.type}`}>{msg.text}</p>}
        <button className="btn btn--gold btn--sm">Update password</button>
      </form>
    </div>
  );
}
