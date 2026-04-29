import pool from '../db.js';
import { requireAdminToken } from './helpers.js';

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  const client = await pool.connect();

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
        const result = await client.query('SELECT * FROM submissions WHERE id = $1', [Number(id)]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Submission not found' });
        }
        const submission = result.rows[0];
        const formattedSubmission = {
          ...submission,
          studentInfo: JSON.parse(submission.student_info),
          results: JSON.parse(submission.results),
        };
        return res.status(200).json({ submission: formattedSubmission });
      }

      const result = await client.query('SELECT * FROM submissions ORDER BY submitted_at DESC');
      const submissions = result.rows.map(row => ({
        ...row,
        studentInfo: JSON.parse(row.student_info),
        results: JSON.parse(row.results),
      }));
      return res.status(200).json({ submissions });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const submissionId = Number(id);
      if (!submissionId) {
        return res.status(400).json({ message: 'Invalid submission id' });
      }

      const result = await client.query('DELETE FROM submissions WHERE id = $1', [submissionId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      return res.status(200).json({ message: 'Submission deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}
