import { useEffect, useState } from 'react';
import { api, assetUrl } from '../api';

const CATS = [['rooms', 'Rooms'], ['beach', 'Beach'], ['pool', 'Swimming Pool'], ['restaurant', 'Restaurant'], ['activities', 'Resort Activities']];

export default function GalleryAdmin() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('rooms');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [edit, setEdit] = useState(null);

  const load = () => api.get('/gallery').then(setItems).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return setErr('Please choose an image');
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('image', file); fd.append('title', title); fd.append('category', category);
      await api.post('/gallery', fd);
      setFile(null); setTitle(''); e.target.reset();
      await load();
    } catch (x) { setErr(x.message); }
    setBusy(false);
  };

  const saveEdit = async () => {
    try { await api.put(`/gallery/${edit.id}`, { title: edit.title, category: edit.category }); setEdit(null); await load(); }
    catch (x) { setErr(x.message); }
  };
  const remove = async (g) => {
    if (!window.confirm('Delete this image?')) return;
    try { await api.del(`/gallery/${g.id}`); await load(); } catch (x) { setErr(x.message); }
  };

  return (
    <div>
      <div className="admin-head"><h1>Gallery</h1></div>
      <form className="panel" onSubmit={upload}>
        <h2>Upload image</h2>
        <div className="form-grid">
          <div className="field wide"><label>Image (JPG, PNG or WebP, max 5 MB)</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files[0])} /></div>
          <div className="field"><label>Title / caption</label><input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="field"><label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>{CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </div>
        </div>
        {err && <p className="alert alert--error">{err}</p>}
        <button className="btn btn--gold btn--sm" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
      </form>

      <div className="admin-gallery">
        {items.map((g) => (
          <figure key={g.id} className="admin-gallery__item">
            <img src={assetUrl(g.image_url)} alt={g.title} loading="lazy" />
            {edit?.id === g.id ? (
              <div className="admin-gallery__edit">
                <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
                <select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>{CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                <div className="row-actions"><button className="btn btn--gold btn--sm" onClick={saveEdit}>Save</button><button className="btn btn--outline btn--sm" onClick={() => setEdit(null)}>Cancel</button></div>
              </div>
            ) : (
              <figcaption>
                <strong>{g.title}</strong><span className="pill">{g.category}</span>
                <div className="row-actions"><button className="btn btn--outline btn--sm" onClick={() => setEdit(g)}>Edit</button><button className="btn btn--danger btn--sm" onClick={() => remove(g)}>Delete</button></div>
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
