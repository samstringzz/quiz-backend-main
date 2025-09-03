import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import pool from '../utils/db';

export const questionsRouter = Router();

// Validation middleware
const questionValidation = [
  body('question_text').notEmpty(),
  body('option_1').notEmpty(),
  body('option_2').notEmpty(),
  body('option_3').notEmpty(),
  body('option_4').notEmpty(),
  body('correct_option').isInt({ min: 1, max: 4 }),
];

// Get all questions
questionsRouter.get('/', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT * FROM questions ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create question
questionsRouter.post('/', authenticateToken, questionValidation, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question_text, option_1, option_2, option_3, option_4, correct_option } = req.body;
    const userId = req.user?.id;

    const result = await pool.query(
      `INSERT INTO questions 
       (question_text, option_1, option_2, option_3, option_4, correct_option, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [question_text, option_1, option_2, option_3, option_4, correct_option, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update question
questionsRouter.put('/:id', authenticateToken, questionValidation, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question_text, option_1, option_2, option_3, option_4, correct_option } = req.body;
    const userId = req.user?.id;

    // Check if user owns the question
    const question = await pool.query(
      'SELECT * FROM questions WHERE id = $1 AND created_by = $2',
      [id, userId]
    );

    if (question.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found or unauthorized' });
    }

    const result = await pool.query(
      `UPDATE questions 
       SET question_text = $1, option_1 = $2, option_2 = $3, option_3 = $4, 
           option_4 = $5, correct_option = $6
       WHERE id = $7 AND created_by = $8
       RETURNING *`,
      [question_text, option_1, option_2, option_3, option_4, correct_option, id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete question
questionsRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if user owns the question
    const question = await pool.query(
      'SELECT * FROM questions WHERE id = $1 AND created_by = $2',
      [id, userId]
    );

    if (question.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found or unauthorized' });
    }

    await pool.query('DELETE FROM questions WHERE id = $1 AND created_by = $2', [id, userId]);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
});