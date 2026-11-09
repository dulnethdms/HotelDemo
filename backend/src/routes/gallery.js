const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { upload, removeUpload } = require('../middleware/upload');

const CATEGORIES = ['rooms', 'beach', 'pool', 'restaurant', 'activities'];

// PUBLIC: list (optional ?category=beach)
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const [rows] = CATEGORIES.includes(category)
      ? await db.query('SELECT * FROM gallery WHERE category = ? ORDER BY id DESC', [category])
      : await db.query('SELECT * FROM gallery ORDER BY id DESC');
    res.json(rows);
  } catch (e) { next(e); }
});

// ADMIN: upload a gallery image (multipart: image, title, category)
router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    const category = req.body.category;
    if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
    if (!title || !CATEGORIES.includes(category)) {
      removeUpload(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'Title and a valid category are required' });
    }
    const url = `/uploads/${req.file.filename}`;
    const [r] = await db.query('INSERT INTO gallery (title, category, image_url) VALUES (?,?,?)', [title, category, url]);
    const [rows] = await db.query('SELECT * FROM gallery WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// ADMIN: edit title/category
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title || !CATEGORIES.includes(req.body.category))
      return res.status(400).json({ error: 'Title and a valid category are required' });
    const [r] = await db.query('UPDATE gallery SET title = ?, category = ? WHERE id = ?', [title, req.body.category, req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    const [rows] = await db.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const [old] = await db.query('SELECT image_url FROM gallery WHERE id = ?', [req.params.id]);
    if (!old[0]) return res.status(404).json({ error: 'Not found' });
    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    removeUpload(old[0].image_url);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
