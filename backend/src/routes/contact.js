const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again later.' },
});
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (b.website) return res.status(201).json({ message: 'Thank you!' });
    const name = String(b.name || '').trim();
    const email = String(b.email || '').trim();
    const phone = String(b.phone || '').trim();
    const message = String(b.message || '').trim();
    const errors = [];
    if (name.length < 2 || name.length > 120) errors.push('Please enter your name');
    if (!EMAIL_RE.test(email) || email.length > 150) errors.push('Please enter a valid email');
    if (phone && !/^[+\d\s().-]{6,40}$/.test(phone)) errors.push('Please enter a valid phone number');
    if (message.length < 10 || message.length > 3000) errors.push('Message must be 10-3000 characters');
    if (errors.length) return res.status(400).json({ error: errors.join('. ') });
    await (await db.collection('contact_messages')).insertOne({
      id: await db.nextId('contact_messages'), name, email, phone: phone || null,
      message, is_read: false, created_at: new Date(),
    });
    res.status(201).json({ message: 'Thank you! We will get back to you shortly.' });
  } catch (e) { next(e); }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const rows = await (await db.collection('contact_messages')).find().sort({ id: -1 }).limit(500).toArray();
    res.json(rows.map((r) => ({ ...r, is_read: !!r.is_read })));
  } catch (e) { next(e); }
});

router.patch('/:id/read', requireAuth, async (req, res, next) => {
  try {
    await (await db.collection('contact_messages')).updateOne(
      { id: Number(req.params.id) }, { $set: { is_read: req.body.is_read !== false } }
    );
    res.json({ message: 'Updated' });
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await (await db.collection('contact_messages')).deleteOne({ id: Number(req.params.id) });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
