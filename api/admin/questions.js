import pool from '../db.js';
import { requireAdminToken } from './helpers.js';

export default async function handler(req, res) {
  if (!requireAdminToken(req, res)) return;

  const client = await pool.connect();

  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM questions ORDER BY id');
      const questions = result.rows.map(row => ({
        ...row,
        options: JSON.parse(row.options),
        correctAnswers: JSON.parse(row.correct_answers),
      }));
      return res.status(200).json({ questions });
    }

    if (req.method === 'POST') {
      const newQuestion = req.body;
      if (!newQuestion || !newQuestion.question || !Array.isArray(newQuestion.options)) {
        return res.status(400).json({ message: 'Invalid question payload' });
      }

      const result = await client.query(
        `INSERT INTO questions (question, options, correct_answers, type, assessment_type, enabled)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          newQuestion.question,
          JSON.stringify(newQuestion.options),
          JSON.stringify(Array.isArray(newQuestion.correctAnswers) ? newQuestion.correctAnswers : []),
          newQuestion.type || 'single',
          newQuestion.assessmentType || 'cybersecurity',
          newQuestion.enabled !== false,
        ]
      );

      const question = result.rows[0];
      const formattedQuestion = {
        ...question,
        options: JSON.parse(question.options),
        correctAnswers: JSON.parse(question.correct_answers),
      };

      return res.status(201).json({ question: formattedQuestion });
    }

    if (req.method === 'PUT') {
      const updatedQuestion = req.body;
      if (!updatedQuestion || typeof updatedQuestion.id !== 'number') {
        return res.status(400).json({ message: 'Invalid question payload' });
      }

      const result = await client.query(
        `UPDATE questions SET
         question = COALESCE($1, question),
         options = COALESCE($2, options),
         correct_answers = COALESCE($3, correct_answers),
         type = COALESCE($4, type),
         assessment_type = COALESCE($5, assessment_type),
         enabled = COALESCE($6, enabled)
         WHERE id = $7 RETURNING *`,
        [
          updatedQuestion.question,
          updatedQuestion.options ? JSON.stringify(updatedQuestion.options) : null,
          updatedQuestion.correctAnswers ? JSON.stringify(updatedQuestion.correctAnswers) : null,
          updatedQuestion.type,
          updatedQuestion.assessmentType,
          updatedQuestion.enabled,
          updatedQuestion.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }

      const question = result.rows[0];
      const formattedQuestion = {
        ...question,
        options: JSON.parse(question.options),
        correctAnswers: JSON.parse(question.correct_answers),
      };

      return res.status(200).json({ question: formattedQuestion });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const questionId = Number(id);
      if (!questionId) {
        return res.status(400).json({ message: 'Invalid question id' });
      }

      const result = await client.query('DELETE FROM questions WHERE id = $1', [questionId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }

      return res.status(200).json({ message: 'Question deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
}
