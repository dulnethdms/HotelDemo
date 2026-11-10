const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const admin = await (await db.collection('admins')).findOne({ username: String(username) });
    // Always run a compare to keep response timing similar for unknown users
    const hash = admin ? admin.password_hash : '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu';
    const ok = await bcrypt.compare(String(password), hash);
    if (!admin || !ok) return res.status(401).json({ error: 'Invalid username or password' });

    await (await db.collection('admins')).updateOne({ id: admin.id }, { $set: { last_login: new Date() } });
    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => res.json({ admin: req.admin }));

// PUT /api/auth/password
router.put('/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords are required' });
    if (String(newPassword).length < 10) return res.status(400).json({ error: 'New password must be at least 10 characters' });

    const admin = await (await db.collection('admins')).findOne({ id: req.admin.id });
    if (!admin || !(await bcrypt.compare(String(currentPassword), admin.password_hash)))
      return res.status(401).json({ error: 'Current password is incorrect' });

    const hash = await bcrypt.hash(String(newPassword), 12);
    await (await db.collection('admins')).updateOne({ id: req.admin.id }, { $set: { password_hash: hash } });
    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
