import { useState } from 'react';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { PageHeader } from '../components/Ui';
import { useContent } from '../context/ContentContext';
import { api } from '../api';

const EMPTY = { name: '', email: '', phone: '', message: '', website: '' };

export default function Contact() {
  const { text } = useContent();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', msg: '' });
    try {
      const r = await api.post('/contact', form);
      setStatus({ state: 'ok', msg: r.message });
      setForm(EMPTY);
    } catch (err) {
      setStatus({ state: 'error', msg: err.message });
    }
  };

  const socials = [['Facebook', 'social_facebook'], ['Instagram', 'social_instagram'], ['X / Twitter', 'social_twitter'], ['YouTube', 'social_youtube']]
    .map(([l, k]) => [l, text(k)]).filter(([, u]) => u);

  return (
    <>
      <Seo title="Contact" description="Contact Ocean Paradise Resort for enquiries about rooms, packages, events and promotions." />
      <PageHeader title="Contact Us" subtitle="We would love to hear from you" />
      <section className="section">
        <div className="container contact">
          <Reveal as="form" className="form" onSubmit={submit} noValidate>
            <h2>Send us a message</h2>
            <div className="field"><label htmlFor="name">Name *</label><input id="name" value={form.name} onChange={set('name')} required autoComplete="name" /></div>
            <div className="field-row">
              <div className="field"><label htmlFor="email">Email *</label><input id="email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></div>
              <div className="field"><label htmlFor="phone">Phone Number</label><input id="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></div>
            </div>
            <div className="field"><label htmlFor="message">Message *</label><textarea id="message" rows="6" value={form.message} onChange={set('message')} required /></div>
            {/* honeypot field: hidden from people, filled by bots */}
            <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
            <button className="btn btn--gold" disabled={status.state === 'sending'}>{status.state === 'sending' ? 'Sending…' : 'Send Message'}</button>
            {status.state === 'ok' && <p className="alert alert--ok" role="status">{status.msg}</p>}
            {status.state === 'error' && <p className="alert alert--error" role="alert">{status.msg}</p>}
          </Reveal>

          <Reveal className="contact__info" delay={120}>
            <h2>Contact Information</h2>
            <ul className="contact-list">
              <li><span aria-hidden="true">📍</span><div><strong>Address</strong>{text('contact_address')}</div></li>
              <li><span aria-hidden="true">📞</span><div><strong>Phone</strong><a href={`tel:${text('contact_phone').replace(/\s/g, '')}`}>{text('contact_phone')}</a></div></li>
              <li><span aria-hidden="true">✉️</span><div><strong>Email</strong><a href={`mailto:${text('contact_email')}`}>{text('contact_email')}</a></div></li>
              <li><span aria-hidden="true">🕒</span><div><strong>Hours</strong>{text('contact_hours')}</div></li>
            </ul>
            <h3>Follow us</h3>
            <div className="socials">
              {socials.map(([l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer">{l}</a>)}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
