// Usage: npm run setup
// Creates the database + tables (database/schema.sql), the first admin account and sample content.
// Safe to re-run: existing rows are never overwritten.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const seed = require('./seedData');

(async () => {
  const dbName = process.env.DB_NAME || 'ocean_paradise';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || '';
  if (password.length < 10) {
    console.error('Set ADMIN_PASSWORD (min 10 characters) in backend/.env before running setup.');
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  const schema = fs
    .readFileSync(path.join(__dirname, '..', '..', 'database', 'schema.sql'), 'utf8')
    .replace(/ocean_paradise/g, dbName);
  await conn.query(schema);
  await conn.query(`USE \`${dbName}\``);
  console.log(`✔ Database "${dbName}" and tables ready`);

  const [admins] = await conn.query('SELECT id FROM admins WHERE username = ?', [username]);
  if (!admins.length) {
    const hash = await bcrypt.hash(password, 12);
    await conn.query('INSERT INTO admins (username, email, password_hash) VALUES (?,?,?)', [username, process.env.ADMIN_EMAIL || null, hash]);
    console.log(`✔ Admin "${username}" created`);
  } else {
    console.log(`• Admin "${username}" already exists (password unchanged)`);
  }

  const seedTable = async (table, rows, mapRow) => {
    const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM ${table}`);
    if (n > 0) return console.log(`• ${table}: already has data, skipped`);
    for (const r of rows) await conn.query(`INSERT INTO ${table} SET ?`, [mapRow ? mapRow(r) : r]);
    console.log(`✔ ${table}: ${rows.length} sample rows`);
  };
  await seedTable('packages', seed.packages, (p) => ({ ...p, features: JSON.stringify(p.features) }));
  await seedTable('promotions', seed.promotions);
  await seedTable('gallery', seed.gallery);

  for (const [k, v] of Object.entries(seed.content)) {
    await conn.query('INSERT IGNORE INTO site_content (content_key, content_value) VALUES (?,?)', [k, v]);
  }
  console.log('✔ site_content ready');

  await conn.end();
  console.log('\nSetup complete. Start the API with: npm run dev');
})().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
