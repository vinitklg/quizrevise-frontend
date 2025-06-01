import { Pool } from 'pg';

const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevisereplit@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

async function seedSubjects() {
  const pool = new Pool({ 
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const subjects = [
      // CBSE Grade 6-10
      { name: 'Mathematics', board: 'CBSE', grade: 6 },
      { name: 'Science', board: 'CBSE', grade: 6 },
      { name: 'Social Science', board: 'CBSE', grade: 6 },
      { name: 'English', board: 'CBSE', grade: 6 },
      { name: 'Hindi', board: 'CBSE', grade: 6 },
      
      { name: 'Mathematics', board: 'CBSE', grade: 7 },
      { name: 'Science', board: 'CBSE', grade: 7 },
      { name: 'Social Science', board: 'CBSE', grade: 7 },
      { name: 'English', board: 'CBSE', grade: 7 },
      { name: 'Hindi', board: 'CBSE', grade: 7 },
      
      { name: 'Mathematics', board: 'CBSE', grade: 8 },
      { name: 'Science', board: 'CBSE', grade: 8 },
      { name: 'Social Science', board: 'CBSE', grade: 8 },
      { name: 'English', board: 'CBSE', grade: 8 },
      { name: 'Hindi', board: 'CBSE', grade: 8 },
      
      { name: 'Mathematics', board: 'CBSE', grade: 9 },
      { name: 'Science', board: 'CBSE', grade: 9 },
      { name: 'Social Science', board: 'CBSE', grade: 9 },
      { name: 'English', board: 'CBSE', grade: 9 },
      { name: 'Hindi', board: 'CBSE', grade: 9 },
      
      { name: 'Mathematics', board: 'CBSE', grade: 10 },
      { name: 'Science', board: 'CBSE', grade: 10 },
      { name: 'Social Science', board: 'CBSE', grade: 10 },
      { name: 'English', board: 'CBSE', grade: 10 },
      { name: 'Hindi', board: 'CBSE', grade: 10 },
      
      // CBSE Grade 11 Science
      { name: 'Physics', board: 'CBSE', grade: 11, stream: 'Science' },
      { name: 'Chemistry', board: 'CBSE', grade: 11, stream: 'Science' },
      { name: 'Mathematics', board: 'CBSE', grade: 11, stream: 'Science' },
      { name: 'Biology', board: 'CBSE', grade: 11, stream: 'Science' },
      { name: 'English', board: 'CBSE', grade: 11, stream: 'Science' },
      
      // CBSE Grade 11 Commerce
      { name: 'Accountancy', board: 'CBSE', grade: 11, stream: 'Commerce' },
      { name: 'Business Studies', board: 'CBSE', grade: 11, stream: 'Commerce' },
      { name: 'Economics', board: 'CBSE', grade: 11, stream: 'Commerce' },
      { name: 'Mathematics', board: 'CBSE', grade: 11, stream: 'Commerce' },
      { name: 'English', board: 'CBSE', grade: 11, stream: 'Commerce' },
      
      // CBSE Grade 12 Science
      { name: 'Physics', board: 'CBSE', grade: 12, stream: 'Science' },
      { name: 'Chemistry', board: 'CBSE', grade: 12, stream: 'Science' },
      { name: 'Mathematics', board: 'CBSE', grade: 12, stream: 'Science' },
      { name: 'Biology', board: 'CBSE', grade: 12, stream: 'Science' },
      { name: 'English', board: 'CBSE', grade: 12, stream: 'Science' },
      
      // CBSE Grade 12 Commerce
      { name: 'Accountancy', board: 'CBSE', grade: 12, stream: 'Commerce' },
      { name: 'Business Studies', board: 'CBSE', grade: 12, stream: 'Commerce' },
      { name: 'Economics', board: 'CBSE', grade: 12, stream: 'Commerce' },
      { name: 'Mathematics', board: 'CBSE', grade: 12, stream: 'Commerce' },
      { name: 'English', board: 'CBSE', grade: 12, stream: 'Commerce' },
      
      // ICSE Grade 9-10
      { name: 'Mathematics', board: 'ICSE', grade: 9 },
      { name: 'Physics', board: 'ICSE', grade: 9 },
      { name: 'Chemistry', board: 'ICSE', grade: 9 },
      { name: 'Biology', board: 'ICSE', grade: 9 },
      { name: 'English', board: 'ICSE', grade: 9 },
      { name: 'History & Civics', board: 'ICSE', grade: 9 },
      { name: 'Geography', board: 'ICSE', grade: 9 },
      
      { name: 'Mathematics', board: 'ICSE', grade: 10 },
      { name: 'Physics', board: 'ICSE', grade: 10 },
      { name: 'Chemistry', board: 'ICSE', grade: 10 },
      { name: 'Biology', board: 'ICSE', grade: 10 },
      { name: 'English', board: 'ICSE', grade: 10 },
      { name: 'History & Civics', board: 'ICSE', grade: 10 },
      { name: 'Geography', board: 'ICSE', grade: 10 },
      
      // ISC Grade 11-12 Science
      { name: 'Physics', board: 'ISC', grade: 11, stream: 'Science' },
      { name: 'Chemistry', board: 'ISC', grade: 11, stream: 'Science' },
      { name: 'Mathematics', board: 'ISC', grade: 11, stream: 'Science' },
      { name: 'Biology', board: 'ISC', grade: 11, stream: 'Science' },
      { name: 'English', board: 'ISC', grade: 11, stream: 'Science' },
      
      { name: 'Physics', board: 'ISC', grade: 12, stream: 'Science' },
      { name: 'Chemistry', board: 'ISC', grade: 12, stream: 'Science' },
      { name: 'Mathematics', board: 'ISC', grade: 12, stream: 'Science' },
      { name: 'Biology', board: 'ISC', grade: 12, stream: 'Science' },
      { name: 'English', board: 'ISC', grade: 12, stream: 'Science' },
      
      // ISC Grade 11-12 Commerce
      { name: 'Accounts', board: 'ISC', grade: 11, stream: 'Commerce' },
      { name: 'Commerce', board: 'ISC', grade: 11, stream: 'Commerce' },
      { name: 'Economics', board: 'ISC', grade: 11, stream: 'Commerce' },
      { name: 'Mathematics', board: 'ISC', grade: 11, stream: 'Commerce' },
      { name: 'English', board: 'ISC', grade: 11, stream: 'Commerce' },
      
      { name: 'Accounts', board: 'ISC', grade: 12, stream: 'Commerce' },
      { name: 'Commerce', board: 'ISC', grade: 12, stream: 'Commerce' },
      { name: 'Economics', board: 'ISC', grade: 12, stream: 'Commerce' },
      { name: 'Mathematics', board: 'ISC', grade: 12, stream: 'Commerce' },
      { name: 'English', board: 'ISC', grade: 12, stream: 'Commerce' }
    ];

    for (const subject of subjects) {
      const query = `
        INSERT INTO subjects (name, board, grade, stream) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT DO NOTHING
      `;
      await pool.query(query, [subject.name, subject.board, subject.grade, subject.stream || null]);
    }

    console.log('Subjects seeded successfully!');
  } catch (error) {
    console.error('Error seeding subjects:', error);
  } finally {
    await pool.end();
  }
}

seedSubjects();