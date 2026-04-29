import express from 'express';
import questionsHandler from './api/admin/questions.js';
import assessmentTypesHandler from './api/admin/assessment-types.js';
import authHandler from './api/admin/auth.js';
import submissionsHandler from './api/admin/submissions.js';
import settingsHandler from './api/admin/settings.js';
import quizQuestionsHandler from './api/quiz/questions.js';
import quizSubmitHandler from './api/quiz/submit.js';

const app = express();
const PORT = 3001;

app.use(express.json());

// Routes
app.all('/api/admin/questions', async (req, res) => {
  await questionsHandler(req, res);
});

app.all('/api/admin/assessment-types', async (req, res) => {
  await assessmentTypesHandler(req, res);
});

app.all('/api/admin/auth', async (req, res) => {
  await authHandler(req, res);
});

app.all('/api/admin/submissions', async (req, res) => {
  await submissionsHandler(req, res);
});

app.all('/api/admin/settings', async (req, res) => {
  await settingsHandler(req, res);
});

app.all('/api/quiz/questions', async (req, res) => {
  await quizQuestionsHandler(req, res);
});

app.all('/api/quiz/submit', async (req, res) => {
  await quizSubmitHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});