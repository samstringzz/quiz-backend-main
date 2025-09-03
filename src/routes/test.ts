import { Router } from 'express';
import pool from '../utils/db';
import { DatabaseError } from 'pg';

export const testRouter = Router();

testRouter.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    res.json({
      message: 'Database connection successful',
      userCount: result.rows[0].count
    });
  } catch (err) {
    console.error('Database connection error:', err);
    
    if (err instanceof DatabaseError) {
      res.status(500).json({
        message: 'Database connection failed',
        error: err.message,
        detail: err.detail
      });
    } else {
      res.status(500).json({
        message: 'Database connection failed',
        error: 'An unknown error occurred'
      });
    }
  }
});