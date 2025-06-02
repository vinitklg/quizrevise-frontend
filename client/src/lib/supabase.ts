import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jedhpenyyjqjvjkkadba.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGhwZW55eWpxanZqa2thZGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODk2NTAsImV4cCI6MjA2NDM2NTY1MH0.tQJlYilJ0Wdx7RGzHurJHRsGJstoV2BoNmTsi8WGqv4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export types that might be needed
export type { User } from '@supabase/supabase-js'