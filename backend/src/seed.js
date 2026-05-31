/**
 * ConTrackr Seed Script
 * Sets correct bcrypt passwords for all default users per the User Guide
 * Run: node src/seed.js
 */
const bcrypt = require('bcrypt');
const db = require('./db/connection');

const SALT_ROUNDS = 10;

const users = [
  { email: 'admin@contrackr.com',       password: 'Admin@123' },
  { email: 'manager@contrackr.com',     password: 'Manager@123' },
  { email: 'procurement@contrackr.com', password: 'Procurement@123' },
  { email: 'engineer@contrackr.com',    password: 'Engineer@123' },
  { email: 'warehouse@contrackr.com',   password: 'Warehouse@123' },
];

async function seed() {
  console.log('🌱 Seeding user passwords...');
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, user.email]
    );
    if (result.affectedRows === 0) {
      console.warn(`  ⚠️  User not found: ${user.email}`);
    } else {
      console.log(`  ✅ Password set for ${user.email}`);
    }
  }
  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
