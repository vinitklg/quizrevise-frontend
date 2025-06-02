import 'dotenv/config'
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')))

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Initializing with Supabase URL:', supabaseUrl)
console.log('Service key available:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickRevise Fresh Supabase API is running' })
})

// Test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      throw error
    }
    res.json({ status: 'Supabase connected successfully', data })
  } catch (error: any) {
    res.status(500).json({ error: 'Supabase connection failed', details: error.message })
  }
})

// Generate quiz questions using OpenAI
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { subject, topic, grade, board, numQuestions = 5 } = req.body

    console.log('Generating quiz for:', { subject, topic, grade, board, numQuestions })

    // Generate quiz using OpenAI
    const prompt = `Create ${numQuestions} multiple choice questions for ${grade} grade ${board} board students on the topic "${topic}" in ${subject}. 

Format as JSON with this structure:
{
  "questions": [{
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }]
}

Make questions educational and appropriate for the grade level.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    
    console.log('Generated questions:', result.questions?.length || 0)

    res.json({ questions: result.questions || [] })
  } catch (error: any) {
    console.error('Quiz generation error:', error)
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message })
  }
})

// Initialize database tables
app.post('/api/init-database', async (req, res) => {
  try {
    // Create simple quizzes table for testing
    const { error } = await supabase.from('quizzes').select('*').limit(1)
    
    if (error && error.code === 'PGRST204') {
      // Table doesn't exist, create a simple test entry to verify connection
      console.log('Database tables need to be created in Supabase dashboard')
      return res.json({ 
        message: 'Please create tables in your Supabase dashboard first',
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to Table Editor',
          '3. Create tables: profiles, quizzes, subjects'
        ]
      })
    }

    res.json({ message: 'Database connection verified' })
  } catch (error: any) {
    console.error('Database init error:', error)
    res.status(500).json({ error: 'Database initialization failed', details: error.message })
  }
})

// Temporarily serve simple frontend until React build is fixed
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'simple-frontend.html'))
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Fresh QuickRevise API running on port ${PORT}`)
  console.log('Visit /api/health to check server status')
  console.log('Visit /api/test-supabase to test database connection')
  console.log('Frontend will be served at http://localhost:' + PORT)
})