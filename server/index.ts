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

// Development mode: create a simple index.html
if (process.env.NODE_ENV === 'development') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QuickRevise - Spaced Learning Platform</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50">
          <div id="root">
            <div class="min-h-screen flex items-center justify-center">
              <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div class="text-center">
                  <h1 class="text-3xl font-bold text-gray-900 mb-4">QuickRevise</h1>
                  <p class="text-gray-600 mb-6">Your AI-Powered Spaced Learning Platform</p>
                  <div class="space-y-4">
                    <a href="/dashboard" class="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                      Student Dashboard
                    </a>
                    <a href="/admin" class="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
                      Admin Dashboard
                    </a>
                    <div class="mt-6 pt-6 border-t border-gray-200">
                      <h3 class="text-lg font-semibold text-gray-900 mb-3">Features Available:</h3>
                      <ul class="text-sm text-gray-600 space-y-2">
                        <li>✓ AI Quiz Generation (Working with Supabase)</li>
                        <li>✓ Spaced Repetition Learning</li>
                        <li>✓ CBSE/ICSE/ISC Content</li>
                        <li>✓ Performance Analytics</li>
                        <li>✓ Admin Dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `)
    }
  })
} else {
  // Production: serve built files
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    }
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Fresh QuickRevise API running on port ${PORT}`)
  console.log('Visit /api/health to check server status')
  console.log('Visit /api/test-supabase to test database connection')
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Start Vite separately with "npm run dev:client"')
    console.log('Frontend available at: http://localhost:5173')
  } else {
    console.log('Frontend available at: http://localhost:' + PORT)
  }
})