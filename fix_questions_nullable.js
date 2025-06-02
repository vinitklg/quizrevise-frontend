// Make questions field nullable temporarily to allow quiz creation
import { Pool } from 'pg';

const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevisereplit@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({ 
  connectionString: SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixQuestionsField() {
  try {
    // Make questions field nullable
    await pool.query(`
      ALTER TABLE quizzes 
      ALTER COLUMN questions DROP NOT NULL;
    `);
    console.log('✓ Made questions field nullable');

    console.log('Database schema updated successfully!');

  } catch (error) {
    console.error('Error updating table:', error.message);
  } finally {
    await pool.end();
  }
}

fixQuestionsField();