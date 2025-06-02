// Fix quiz table to match application code expectations
import { Pool } from 'pg';

const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevisereplit@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({ 
  connectionString: SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixQuizTable() {
  try {
    // Add missing 'topic' column (the code expects this, not topic_id)
    await pool.query(`
      ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS topic VARCHAR(255);
    `);
    console.log('✓ Added topic column');

    // Convert subject_id and chapter_id to integers 
    await pool.query(`
      ALTER TABLE quizzes 
      ALTER COLUMN subject_id TYPE INTEGER USING subject_id::INTEGER;
    `);
    console.log('✓ Fixed subject_id type');

    await pool.query(`
      ALTER TABLE quizzes 
      ALTER COLUMN chapter_id TYPE INTEGER USING chapter_id::INTEGER;
    `);
    console.log('✓ Fixed chapter_id type');

    console.log('Database schema fixed successfully!');

  } catch (error) {
    console.error('Error fixing table:', error.message);
  } finally {
    await pool.end();
  }
}

fixQuizTable();