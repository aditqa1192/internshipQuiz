import pool from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { assessmentType } = req.query;
  const client = await pool.connect();

  try {
    const result = await client.query(
      'SELECT * FROM questions WHERE enabled = true AND assessment_type = $1 ORDER BY id',
      [assessmentType]
    );

    const questions = result.rows.map(row => ({
      ...row,
      options: JSON.parse(row.options),
      correctAnswers: JSON.parse(row.correct_answers),
    }));

    return res.status(200).json({ questions });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}
