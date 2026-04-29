import pool from './db.js';

async function createTables() {
  const client = await pool.connect();

  try {
    // Assessment Types table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessment_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);

    // Questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answers JSONB DEFAULT '[]'::jsonb,
        type TEXT DEFAULT 'single',
        assessment_type TEXT NOT NULL,
        enabled BOOLEAN DEFAULT true
      );
    `);

    // Submissions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        student_info JSONB NOT NULL,
        assessment_type TEXT NOT NULL,
        results JSONB NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        percentage DECIMAL(5,2),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        pdf_url TEXT
      );
    `);

    // Settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
}

createTables();