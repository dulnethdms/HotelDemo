import { useEffect, useState } from 'react';
import { api } from '../api';

// Every editable key: [key, label, type]. 'json' = list editing in JSON (validated before saving).
const SECTIONS = [
  ['Hotel & Home Page', [
    ['tagline', 'Tagline', 'text'], ['hero_subtitle', 'Hero subtitle', 'textarea'],
    ['hero_image', 'Hero image URL', 'text'], ['intro_title', 'Introduction title', 'text'], ['intro_text', 'Introduction text', 'textarea'],
    ['intro_image', 'Introduction image URL', 'text'],
    ['stat_1', 'Stat 1 (value|label)', 'text'], ['stat_2', 'Stat 2 (value|label)', 'text'], ['stat_3', 'Stat 3 (value|label)', 'text'], ['stat_4', 'Stat 4 (value|label)', 'text'],
    ['highlights', 'Highlights (JSON list: icon, title, text)', 'json'], ['reviews', 'Customer reviews (JSON list: name, country, rating, text)', 'json'],
    ['currency_symbol', 'Currency symbol', 'text'], ['footer_text', 'Footer text', 'text'],
  ]],
  ['About Page', [
    ['story_title', 'Story title', 'text'], ['story_text', 'Hotel story', 'textarea'], ['about_image', 'About image URL', 'text'],
    ['mission', 'Mission', 'textarea'], ['vision', 'Vision', 'textarea'],
    ['why_choose', 'Why choose us (JSON list: title, text)', 'json'], ['facilities', 'Facilities & amenities (JSON list: icon, title, text)', 'json'],
  ]],
  ['Contact Information', [
    ['contact_address', 'Address', 'text'], ['contact_phone', 'Phone', 'text'], ['contact_email', 'Email', 'text'], ['contact_hours', 'Reception hours', 'text'],
    ['map_query', 'Map search text (place name or address)', 'text'], ['attractions', 'Nearby attractions (JSON list: name, distance, text)', 'json'],
  ]],
  ['Social Media', [
    ['social_facebook', 'Facebook URL', 'text'], ['social_instagram', 'Instagram URL', 'text'], ['social_twitter', 'X / Twitter URL', 'text'], ['social_youtube', 'YouTube URL', 'text'],
  ]],
];

export default function ContentAdmin() {
  const [values, setValues] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/content').then(setValues).catch((e) => setMsg({ type: 'error', text: e.message })); }, []);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    const payload = {};
    for (const [, fields] of SECTIONS) {
      for (const [key, label, type] of fields) {
        const v = values[key] ?? '';
        if (type === 'json' && v.trim()) {
          try { if (!Array.isArray(JSON.parse(v))) throw new Error(); } catch { return setMsg({ type: 'error', text: `"${label}" is not valid JSON (must be a list)` }); }
        }
        payload[key] = v;
      }
    }
    setSaving(true); setMsg({ type: '', text: '' });
    try { await api.put('/content', payload); setMsg({ type: 'ok', text: 'Website content updated' }); }
    catch (x) { setMsg({ type: 'error', text: x.message }); }
    setSaving(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!values) return <p>Loading…</p>;
  return (
    <form onSubmit={save}>
      <div className="admin-head"><h1>Site Content & Contact Info</h1><button className="btn btn--gold btn--sm" disabled={saving}>{saving ? 'Saving…' : 'Save all changes'}</button></div>
      {msg.text && <p className={`alert alert--${msg.type}`}>{msg.text}</p>}
      {SECTIONS.map(([title, fields]) => (
        <section className="panel" key={title}>
          <h2>{title}</h2>
          {fields.map(([key, label, type]) => (
            <div className="field" key={key}>
              <label htmlFor={key}>{label}</label>
              {type === 'text' ? <input id={key} value={values[key] ?? ''} onChange={(e) => set(key, e.target.value)} />
                : <textarea id={key} rows={type === 'json' ? 9 : 4} className={type === 'json' ? 'mono' : ''} value={values[key] ?? ''} onChange={(e) => set(key, e.target.value)} />}
            </div>
          ))}
        </section>
      ))}
      <button className="btn btn--gold" disabled={saving}>{saving ? 'Saving…' : 'Save all changes'}</button>
    </form>
  );
}
