// Quick script to check Supabase database content
import { Pool } from 'pg';

const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevisereplit@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({ 
  connectionString: SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    // Check if quiz was created
    const quizResult = await pool.query('SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 5');
    console.log('Quizzes in Supabase:', quizResult.rows);

    // Check quiz schedules
    const scheduleResult = await pool.query('SELECT * FROM quiz_schedules ORDER BY scheduled_date DESC LIMIT 5');
    console.log('Quiz schedules in Supabase:', scheduleResult.rows);

    // Check quiz sets
    const setResult = await pool.query('SELECT * FROM quiz_sets ORDER BY created_at DESC LIMIT 5');
    console.log('Quiz sets in Supabase:', setResult.rows);

  } catch (error) {
    console.error('Error checking database:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();