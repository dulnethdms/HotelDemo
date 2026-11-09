import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken, getToken } from '../api';
import Logo from '../components/Logo';

export default function AdminLogin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login';
    if (getToken()) api.get('/auth/me').then(() => nav('/admin', { replace: true })).catch(() => setToken(null));
  }, [nav]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const { token } = await api.post('/auth/login', form);
      setToken(token);
      nav('/admin', { replace: true });
    } catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <Logo light={false} />
        <h1>Staff Login</h1>
        <div className="field"><label htmlFor="u">Username</label><input id="u" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" required autoFocus /></div>
        <div className="field"><label htmlFor="p">Password</label><input id="p" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" required /></div>
        {err && <p className="alert alert--error" role="alert">{err}</p>}
        <button className="btn btn--gold" style={{ width: '100%' }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
