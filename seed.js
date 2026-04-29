import pool from './api/db.js';
import { readStore } from './api/_store.js';

async function seedDatabase() {
  const client = await pool.connect();

  try {
    const store = await readStore();

    // Seed assessment types
    if (store.assessmentTypes) {
      for (const type of store.assessmentTypes) {
        await client.query(
          'INSERT INTO assessment_types (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
          [type.id, type.name]
        );
      }
    }

    // Seed questions
    if (store.questions) {
      for (const question of store.questions) {
        await client.query(
          `INSERT INTO questions (id, question, options, correct_answers, type, assessment_type, enabled)
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
          [
            question.id,
            question.question,
            JSON.stringify(question.options),
            JSON.stringify(question.correctAnswers || []),
            question.type || 'single',
            question.assessmentType,
            question.enabled !== false
          ]
        );
      }
    }

    // Seed submissions
    if (store.submissions) {
      for (const submission of store.submissions) {
        await client.query(
          `INSERT INTO submissions (id, student_info, assessment_type, results, score, total_questions, percentage, submitted_at, pdf_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
          [
            submission.id,
            JSON.stringify(submission.studentInfo),
            submission.assessmentType,
            JSON.stringify(submission.results),
            submission.score,
            submission.totalQuestions,
            submission.percentage,
            submission.submittedAt ? new Date(submission.submittedAt) : new Date(),
            submission.pdfUrl
          ]
        );
      }
    }

    // Seed settings
    if (store.settings) {
      for (const [key, value] of Object.entries(store.settings)) {
        await client.query(
          'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, JSON.stringify(value)]
        );
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
  }
}

seedDatabase();