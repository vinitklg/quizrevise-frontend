// Check actual table structure in Supabase
import { Pool } from 'pg';

const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevisereplit@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({ 
  connectionString: SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkTableStructure() {
  try {
    // Check quizzes table structure
    const quizzesStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'quizzes' 
      ORDER BY ordinal_position;
    `);
    console.log('Quizzes table structure:');
    console.log(quizzesStructure.rows);

    // Check quiz_sets table structure  
    const setsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'quiz_sets' 
      ORDER BY ordinal_position;
    `);
    console.log('\nQuiz_sets table structure:');
    console.log(setsStructure.rows);

  } catch (error) {
    console.error('Error checking table structure:', error.message);
  } finally {
    await pool.end();
  }
}

checkTableStructure();