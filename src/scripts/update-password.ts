import bcrypt from 'bcrypt';
import pool from '../utils/db';

async function updatePassword() {
  try {
    const password = 'demo123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING *',
      [passwordHash, 'demo@example.com']
    );

    console.log('Password updated successfully for user:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

updatePassword();
