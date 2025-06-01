import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Force Supabase connection with URL-encoded password
const SUPABASE_URL = "postgresql://postgres.jedhpenyyjqjvjkkadba:quickrevise%402025@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

export const pool = new Pool({ 
  connectionString: SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
export const db = drizzle({ client: pool, schema });