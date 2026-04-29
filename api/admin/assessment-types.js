import pool from '../db.js';
import { requireAdminToken } from './helpers.js';

export default async function handler(req, res) {
  const client = await pool.connect();

  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM assessment_types ORDER BY id');
      return res.status(200).json({ assessmentTypes: result.rows });
    }

    // Require admin token for write operations
    if (!requireAdminToken(req, res)) return;

    if (req.method === 'POST') {
      const newType = req.body;
      if (!newType || !newType.id || !newType.name) {
        return res.status(400).json({ message: 'Invalid assessment type payload' });
      }

      // Check if id already exists
      const existing = await client.query('SELECT id FROM assessment_types WHERE id = $1', [newType.id]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: 'Assessment type ID already exists' });
      }

      const result = await client.query(
        'INSERT INTO assessment_types (id, name) VALUES ($1, $2) RETURNING *',
        [newType.id, newType.name]
      );

      return res.status(201).json({ assessmentType: result.rows[0] });
    }

    if (req.method === 'PUT') {
      const updatedType = req.body;
      if (!updatedType || !updatedType.id) {
        return res.status(400).json({ message: 'Invalid assessment type payload' });
      }

      const result = await client.query(
        'UPDATE assessment_types SET name = $1 WHERE id = $2 RETURNING *',
        [updatedType.name, updatedType.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Assessment type not found' });
      }

      return res.status(200).json({ assessmentType: result.rows[0] });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}