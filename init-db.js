import 'dotenv/config';
import pool from './api/db.js';

// Run migration and seed
async function initDatabase() {
  console.log('Initializing database...');

  // Run migration
  const { createTables } = await import('./migrate.js');
  await createTables();

  // Run seed
  const { seedDatabase } = await import('./seed.js');
  await seedDatabase();

  console.log('Database initialized successfully');
  process.exit(0);
}

initDatabase().catch(console.error);