const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { upload, removeUpload } = require('../middleware/upload');

const CATEGORIES = ['rooms', 'beach', 'pool', 'restaurant', 'activities'];

router.get('/', async (req, res, next) => {
  try {
    const filter = CATEGORIES.includes(req.query.category) ? { category: req.query.category } : {};
    const rows = await (await db.collection('gallery')).find(filter).sort({ id: -1 }).toArray();
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    const category = req.body.category;
    if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
    if (!title || !CATEGORIES.includes(category)) {
      removeUpload(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'Title and a valid category are required' });
    }
    const record = {
      id: await db.nextId('gallery'), title, category,
      image_url: `/uploads/${req.file.filename}`, created_at: new Date(),
    };
    await (await db.collection('gallery')).insertOne(record);
    res.status(201).json(record);
  } catch (e) { next(e); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title || !CATEGORIES.includes(req.body.category))
      return res.status(400).json({ error: 'Title and a valid category are required' });
    const gallery = await db.collection('gallery');
    const id = Number(req.params.id);
    const record = await gallery.findOne({ id });
    if (!record) return res.status(404).json({ error: 'Not found' });
    record.title = title;
    record.category = req.body.category;
    await gallery.replaceOne({ id }, record);
    res.json(record);
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const gallery = await db.collection('gallery');
    const record = await gallery.findOne({ id: Number(req.params.id) });
    if (!record) return res.status(404).json({ error: 'Not found' });
    await gallery.deleteOne({ id: record.id });
    removeUpload(record.image_url);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
