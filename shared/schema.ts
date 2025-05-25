import { pgTable, text, serial, timestamp, integer, boolean, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  grade: integer("grade"),
  board: text("board"), // CBSE, ICSE, or ISC
  subscriptionTier: text("subscription_tier").default("free").notNull(), // free, standard, premium
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gradeLevel: integer("grade_level").notNull(),
  board: text("board").notNull(), // CBSE, ICSE, or ISC
});

// Chapters table
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  chapterId: integer("chapter_id").notNull(),
  subjectId: integer("subject_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("active").notNull(), // active, completed, etc.
});

// Quiz sets (8 sets per quiz)
export const quizSets = pgTable("quiz_sets", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  setNumber: integer("set_number").notNull(), // 1-8
  questions: jsonb("questions").notNull(), // Array of questions, options, and answers
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz schedules for spaced repetition
export const quizSchedules = pgTable("quiz_schedules", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  userId: integer("user_id").notNull(),
  quizSetId: integer("quiz_set_id").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  score: integer("score"),
  status: text("status").default("pending").notNull(), // pending, completed, missed
});

// Doubt queries
export const doubtQueries = pgTable("doubt_queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  subjectId: integer("subject_id"),
  status: text("status").default("pending").notNull(), // pending, answered
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true });
export const insertQuizSetSchema = createInsertSchema(quizSets).omit({ id: true, createdAt: true });
export const insertQuizScheduleSchema = createInsertSchema(quizSchedules).omit({ id: true, completedDate: true, score: true });
export const insertDoubtQuerySchema = createInsertSchema(doubtQueries).omit({ id: true, answer: true, createdAt: true, answeredAt: true, status: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizSet = typeof quizSets.$inferSelect;
export type InsertQuizSet = z.infer<typeof insertQuizSetSchema>;

export type QuizSchedule = typeof quizSchedules.$inferSelect;
export type InsertQuizSchedule = z.infer<typeof insertQuizScheduleSchema>;

export type DoubtQuery = typeof doubtQueries.$inferSelect;
export type InsertDoubtQuery = z.infer<typeof insertDoubtQuerySchema>;

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  grade: z.number().min(6).max(12).optional(),
  board: z.enum(["CBSE", "ICSE", "ISC"]).optional(),
});

// Quiz generation schema
export const generateQuizSchema = z.object({
  subjectId: z.number(),
  chapterId: z.number(),
  title: z.string().min(3, "Title must be at least 3 characters"),
});
