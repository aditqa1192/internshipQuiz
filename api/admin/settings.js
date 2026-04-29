import pool from '../db.js';
import { requireAdminToken } from './helpers.js';

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  const client = await pool.connect();

  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM settings');
      const settings = {};
      result.rows.forEach(row => {
        settings[row.key] = JSON.parse(row.value);
      });
      return res.status(200).json({ settings });
    }

    if (req.method === 'PATCH') {
      const updates = req.body;
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ message: 'Invalid settings payload' });
      }

      for (const [key, value] of Object.entries(updates)) {
        await client.query(
          'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, JSON.stringify(value)]
        );
      }

      // Return updated settings
      const result = await client.query('SELECT * FROM settings');
      const settings = {};
      result.rows.forEach(row => {
        settings[row.key] = JSON.parse(row.value);
      });

      return res.status(200).json({ settings });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}
