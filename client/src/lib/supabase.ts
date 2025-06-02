import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for clean Supabase integration
export interface Profile {
  id: string
  email: string
  full_name?: string
  grade: number
  board: string
  created_at: string
}

export interface Subject {
  id: number
  name: string
  board: string
  grade: number
  code: string
}

export interface Quiz {
  id: number
  user_id: string
  subject_id: number
  title: string
  topic: string
  questions: QuizQuestion[]
  created_at: string
  status: 'active' | 'completed'
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

export interface QuizSchedule {
  id: number
  user_id: string
  quiz_id: number
  scheduled_date: string
  completed_date?: string
  score?: number
  status: 'pending' | 'completed'
}