import express from 'express';
import { readStore, writeStore } from './api/_store.js';
import questionsHandler from './api/admin/questions.js';
import assessmentTypesHandler from './api/admin/assessment-types.js';
import authHandler from './api/admin/auth.js';

const app = express();
const PORT = 3001;

app.use(express.json());

// Mock middleware for admin token
app.use('/api/admin/*', (req, res, next) => {
  const token = req.headers['x-admin-token'] || req.headers['X-Admin-Token'];
  if (req.method !== 'GET' || req.path === '/auth') {
    if (!token || token !== 'admin-portal-token') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  next();
});

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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});