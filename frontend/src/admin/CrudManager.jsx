import { useEffect, useState } from 'react';
import { api, assetUrl } from '../api';

function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true); setErr('');
    try { onChange(await api.upload(file)); } catch (x) { setErr(x.message); }
    setBusy(false);
    e.target.value = '';
  };
  return (
    <div className="imgfield">
      {value && <img src={assetUrl(value)} alt="Preview" />}
      <div className="imgfield__controls">
        <input type="text" placeholder="Paste an image URL or upload a file" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        <label className="btn btn--outline btn--sm">
          {busy ? 'Uploading…' : 'Upload'}
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={pick} disabled={busy} />
        </label>
      </div>
      {err && <p className="alert alert--error">{err}</p>}
    </div>
  );
}

const toForm = (item, fields) => {
  const f = { ...item };
  fields.forEach((fd) => { if (fd.type === 'lines') f[fd.name] = (item[fd.name] || []).join('\n'); });
  return f;
};
const toPayload = (form, fields) => {
  const p = { ...form };
  fields.forEach((fd) => { if (fd.type === 'lines') p[fd.name] = String(form[fd.name] || '').split('\n'); });
  return p;
};

// Generic list + add/edit/delete screen driven by a field config
export default function CrudManager({ title, noun, listPath, basePath, fields, columns, empty }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = closed
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState('');
  const [flash, setFlash] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get(listPath).then(setItems).catch((e) => setErr(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const openNew = () => { setEditingId(null); setForm({ ...empty }); setErr(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const openEdit = (item) => { setEditingId(item.id); setForm(toForm(item, fields)); setErr(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const payload = toPayload(form, fields);
      if (editingId) await api.put(`${basePath}/${editingId}`, payload);
      else await api.post(basePath, payload);
      setForm(null);
      setFlash(`${noun} saved`);
      setTimeout(() => setFlash(''), 3000);
      await load();
    } catch (x) { setErr(x.message); }
    setSaving(false);
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${noun.toLowerCase()}? This cannot be undone.`)) return;
    try { await api.del(`${basePath}/${item.id}`); setFlash(`${noun} deleted`); setTimeout(() => setFlash(''), 3000); await load(); }
    catch (x) { setErr(x.message); }
  };

  return (
    <div>
      <div className="admin-head">
        <h1>{title}</h1>
        {!form && <button className="btn btn--gold btn--sm" onClick={openNew}>+ Add {noun}</button>}
      </div>
      {flash && <p className="alert alert--ok">{flash}</p>}
      {!form && err && <p className="alert alert--error">{err}</p>}

      {form && (
        <form className="panel" onSubmit={save}>
          <h2>{editingId ? `Edit ${noun}` : `New ${noun}`}</h2>
          <div className="form-grid">
            {fields.map((f) => (
              <div key={f.name} className={`field ${f.wide ? 'wide' : ''} ${f.type === 'checkbox' ? 'field--check' : ''}`}>
                {f.type === 'checkbox' ? (
                  <label><input type="checkbox" checked={!!form[f.name]} onChange={(e) => set(f.name, e.target.checked)} /> {f.label}</label>
                ) : (
                  <>
                    <label>{f.label}{f.hint && <small> – {f.hint}</small>}</label>
                    {f.type === 'textarea' || f.type === 'lines' ? (
                      <textarea rows={f.type === 'lines' ? 6 : 4} value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
                    ) : f.type === 'select' ? (
                      <select value={form[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                        {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    ) : f.type === 'image' ? (
                      <ImageField value={form[f.name]} onChange={(v) => set(f.name, v)} />
                    ) : (
                      <input type={f.type || 'text'} step={f.type === 'number' ? 'any' : undefined} value={form[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          {err && <p className="alert alert--error">{err}</p>}
          <div className="row-actions">
            <button className="btn btn--gold btn--sm" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="panel table-wrap">
        {loading ? <p>Loading…</p> : items.length === 0 ? <p className="muted">Nothing here yet.</p> : (
          <table className="table">
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.type === 'image' ? <img className="thumb" src={assetUrl(it[c.key])} alt="" /> : c.render ? c.render(it) : String(it[c.key] ?? '')}
                    </td>
                  ))}
                  <td className="actions">
                    <button className="btn btn--outline btn--sm" onClick={() => openEdit(it)}>Edit</button>
                    <button className="btn btn--danger btn--sm" onClick={() => remove(it)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
