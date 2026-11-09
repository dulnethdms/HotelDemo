const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// ADMIN: generic image upload for package/promotion/content images -> { url }
router.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please choose an image' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
