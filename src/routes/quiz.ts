import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';

export const quizRouter = Router();

// Start quiz
quizRouter.get('/start', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    // Get all questions with only necessary fields
    const result = await pool.query(
      `SELECT id, question_text, option_1, option_2, option_3, option_4 
       FROM questions 
       ORDER BY RANDOM()`
    );

    // Create quiz attempt
    const attemptResult = await pool.query(
      'INSERT INTO quiz_attempts (user_id, total_questions) VALUES ($1, $2) RETURNING id',
      [req.user?.id, result.rows.length]
    );

    res.json({
      quiz_attempt_id: attemptResult.rows[0].id,
      questions: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

// Submit quiz
quizRouter.post('/submit', authenticateToken, [
  body('quiz_attempt_id').isInt(),
  body('answers').isArray(),
  body('answers.*.question_id').isInt(),
  body('answers.*.selected_option').isInt({ min: 1, max: 4 }),
], async (req: AuthRequest, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quiz_attempt_id, answers } = req.body;
    const userId = req.user?.id;

    // Verify quiz attempt belongs to user
    const attemptResult = await pool.query(
      'SELECT * FROM quiz_attempts WHERE id = $1 AND user_id = $2',
      [quiz_attempt_id, userId]
    );

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ message: 'Quiz attempt not found or unauthorized' });
    }

    let score = 0;

    // Process each answer
    for (const answer of answers) {
      // Get correct answer
      const questionResult = await pool.query(
        'SELECT correct_option FROM questions WHERE id = $1',
        [answer.question_id]
      );

      const isCorrect = questionResult.rows[0].correct_option === answer.selected_option;
      if (isCorrect) score++;

      // Save answer
      await pool.query(
        `INSERT INTO quiz_answers 
         (quiz_attempt_id, question_id, selected_option, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [quiz_attempt_id, answer.question_id, answer.selected_option, isCorrect]
      );
    }

    // Update quiz attempt with score and end time
    await pool.query(
      'UPDATE quiz_attempts SET score = $1, end_time = CURRENT_TIMESTAMP WHERE id = $2',
      [score, quiz_attempt_id]
    );

    // Get quiz results
    const quizResult = await pool.query(
      `SELECT 
        qa.id,
        qa.score,
        qa.total_questions,
        EXTRACT(EPOCH FROM (qa.end_time - qa.start_time))::INTEGER as time_taken
       FROM quiz_attempts qa
       WHERE qa.id = $1`,
      [quiz_attempt_id]
    );

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        score: quizResult.rows[0].score,
        total_questions: quizResult.rows[0].total_questions,
        time_taken: quizResult.rows[0].time_taken,
      },
    });
  } catch (error) {
    next(error);
  }
});
