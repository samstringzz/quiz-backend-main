import pool from '../utils/db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Read seed file
    const seedPath = path.join(__dirname, '../db/seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Execute schema
    console.log('Creating database schema...');
    await pool.query(schemaSQL);
    console.log('Schema created successfully');
    
    // Execute seed data
    console.log('Seeding database...');
    await pool.query(seedSQL);
    console.log('Database seeded successfully');
    
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
