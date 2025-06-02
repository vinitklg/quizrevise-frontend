// Script to create missing tables in Supabase
import { Pool } from 'pg';

const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevisereplit@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({ 
  connectionString: SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createMissingTables() {
  try {
    // Create chapters table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT
      );
    `);
    console.log('✓ Created chapters table');

    // Create topics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        chapter_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT
      );
    `);
    console.log('✓ Created topics table');

    // Insert some sample chapters for testing
    await pool.query(`
      INSERT INTO chapters (subject_id, name, description) 
      VALUES (163, 'Algebra', 'Basic algebraic concepts and equations')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Added sample chapter');

    console.log('All missing tables created successfully!');

  } catch (error) {
    console.error('Error creating tables:', error.message);
  } finally {
    await pool.end();
  }
}

createMissingTables();