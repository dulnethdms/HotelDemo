// Usage: npm run setup
// Connects to Supabase, creates the first admin account and sample content.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const db = require('../src/db');
const seed = require('./seedData');

(async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || '';
  if (password.length < 10) {
    console.error('Set ADMIN_PASSWORD (min 10 characters) in backend/.env before running setup.');
    process.exit(1);
  }

  const database = await db.getDb();
  await Promise.all([
    database.collection('admins').createIndex({ username: 1 }, { unique: true }),
    database.collection('site_content').createIndex({ content_key: 1 }, { unique: true }),
    database.collection('packages').createIndex({ is_active: 1, sort_order: 1 }),
    database.collection('promotions').createIndex({ is_active: 1, valid_until: 1 }),
    database.collection('gallery').createIndex({ category: 1 }),
  ]);
  console.log('Supabase database is ready');

  const admins = database.collection('admins');
  if (!(await admins.findOne({ username }))) {
    await admins.insertOne({
      id: await db.nextId('admins'), username, email: process.env.ADMIN_EMAIL || null,
      password_hash: await bcrypt.hash(password, 12), last_login: null, created_at: new Date(),
    });
    console.log(`Admin "${username}" created`);
  } else {
    console.log(`Admin "${username}" already exists (password unchanged)`);
  }

  const seedCollection = async (name, rows, mapRow = (row) => row) => {
    const collection = database.collection(name);
    if (await collection.countDocuments() > 0) {
      console.log(`${name}: already has data, skipped`);
      return;
    }
    const documents = [];
    for (const row of rows) {
      const mapped = { ...mapRow(row) };
      if (name === 'packages') {
        mapped.is_featured = !!mapped.is_featured;
        mapped.is_active = mapped.is_active !== false;
      } else if (name === 'promotions') {
        mapped.is_active = mapped.is_active !== false;
      }
      const timestamps = name === 'gallery'
        ? { created_at: new Date() }
        : { created_at: new Date(), updated_at: new Date() };
      documents.push({
        id: await db.nextId(name),
        ...mapped,
        ...timestamps,
      });
    }
    if (documents.length) await collection.insertMany(documents);
    console.log(`${name}: ${documents.length} sample rows`);
  };

  await seedCollection('packages', seed.packages);
  await seedCollection('promotions', seed.promotions);
  await seedCollection('gallery', seed.gallery);

  const content = database.collection('site_content');
  const entries = Object.entries(seed.content);
  if (await content.countDocuments() === 0 && entries.length) {
    await content.insertMany(entries.map(([content_key, content_value]) => ({
      content_key, content_value, updated_at: new Date(),
    })));
  }
  console.log('site_content ready');
  await db.close();
  console.log('\nSetup complete. Start the API with: npm run dev');
})().catch(async (err) => {
  console.error('Setup failed:', err.message);
  await db.close().catch(() => {});
  process.exit(1);
});
