import express from 'express'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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
  res.json({ status: 'OK', message: 'QuickRevise API is running' })
})

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    res.json({ user, profile })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Create or update profile
app.post('/api/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { full_name, grade, board } = req.body

    const { data, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name,
        grade,
        board,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (upsertError) {
      throw upsertError
    }

    res.json(data)
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Generate quiz questions using OpenAI
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { subject, topic, grade, board, numQuestions = 5 } = req.body

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

    const result = JSON.parse(completion.choices[0].message.content)

    // Save quiz to Supabase
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        user_id: user.id,
        title: `${subject} - ${topic}`,
        subject,
        topic,
        grade,
        board,
        questions: result.questions,
        status: 'active'
      })
      .select()
      .single()

    if (quizError) {
      throw quizError
    }

    res.json({ quiz, questions: result.questions })
  } catch (error) {
    console.error('Quiz generation error:', error)
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
})

// Get user's quizzes
app.get('/api/quizzes', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { data, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (quizzesError) {
      throw quizzesError
    }

    res.json(data)
  } catch (error) {
    console.error('Quizzes error:', error)
    res.status(500).json({ error: 'Failed to get quizzes' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`QuickRevise API running on port ${PORT}`)
})