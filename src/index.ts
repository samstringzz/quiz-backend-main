import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { questionsRouter } from './routes/questions';
import { quizRouter } from './routes/quiz';
import { testRouter } from './routes/test';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use((req, res, next) => {
  const corsOrigin = process.env.CORS_ORIGIN || 'https://quiz-frontend-t6vn.vercel.app';
  res.header('Access-Control-Allow-Origin', corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// Test routes to verify API is working
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.post('/test', (req, res) => {
  res.json({ message: 'POST request working', body: req.body });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api', testRouter);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});