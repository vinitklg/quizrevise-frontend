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
  phoneNumber: text("phone_number"),
  grade: integer("grade"),
  board: text("board"), // CBSE, ICSE, or ISC
  stream: text("stream"), // Science, Commerce, Humanities (for classes 11-12)
  subscribedSubjects: text("subscribed_subjects").array(), // Array of standardized subject codes
  subscriptionTier: text("subscription_tier").default("free").notNull(), // free, standard, premium
  createdAt: timestamp("created_at").defaultNow(),
});

// Standardized subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Standardized code like "CBSE_10_MATH", "CBSE_11_SCIENCE_PHYSICS"
  name: text("name").notNull(), // Display name like "Mathematics", "Physics"
  board: text("board").notNull(), // CBSE, ICSE, ISC
  gradeLevel: integer("grade_level").notNull(), // 6-12
  stream: text("stream"), // Science, Commerce, Humanities (null for grades 6-10)
  isCore: boolean("is_core").default(false), // Core subjects vs electives
  description: text("description"),
});

// Chapters table
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

// Topics table for more granular quiz targeting
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull(),
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
  topicId: integer("topic_id"), // Using topic ID for better targeting (optional for backward compatibility)
  title: text("title").notNull(),
  topic: text("topic").notNull(), // Keep topic name for display
  questionTypes: text("question_types").array().notNull(), // mcq, assertion-reasoning, fill-in-blanks, true-false
  bloomTaxonomy: text("bloom_taxonomy").array().notNull(), // knowledge, comprehension, application, analysis, synthesis, evaluation
  difficultyLevels: text("difficulty_levels").array().notNull(), // basic, standard, challenging, most-challenging
  numberOfQuestions: integer("number_of_questions").notNull(),
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
  userAnswers: jsonb("user_answers"), // Store the user's answers as JSON
  status: text("status").default("pending").notNull(), // pending, completed, missed
});

// Doubt queries
export const doubtQueries = pgTable("doubt_queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  subjectId: integer("subject_id").notNull().default(1), // Default to first subject
  board: text("board"), // New: Student's board (CBSE, ICSE, etc.)
  class: text("class"), // New: Student's class/grade
  subjectName: text("subject_name"), // New: Subject name as text
  status: text("status").default("pending").notNull(), // pending, answered
  fileUrl: text("file_url"), // URL to the uploaded file (if any)
  fileType: text("file_type"), // Type of file uploaded (PDF, Word, etc.)
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true });
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true });
export const insertQuizSetSchema = createInsertSchema(quizSets).omit({ id: true, createdAt: true });
export const insertQuizScheduleSchema = createInsertSchema(quizSchedules).omit({ id: true, completedDate: true, score: true });
// Custom doubt query schema matching exactly what we send from the client
export const insertDoubtQuerySchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  board: z.string().min(2, "Board must be at least 2 characters"),
  class: z.string().min(1, "Class must not be empty"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  fileUrl: z.string().optional().default(""),
  fileType: z.string().optional().default("")
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizSet = typeof quizSets.$inferSelect;
export type InsertQuizSet = z.infer<typeof insertQuizSetSchema>;

export type QuizSchedule = typeof quizSchedules.$inferSelect;
export type InsertQuizSchedule = z.infer<typeof insertQuizScheduleSchema>;

export type DoubtQuery = typeof doubtQueries.$inferSelect;
// Updated InsertDoubtQuery type that includes all fields needed for database insertion
export type InsertDoubtQuery = {
  userId: number;
  question: string;
  subjectId: number;
  board?: string;
  class?: string;
  subjectName?: string;
  fileUrl?: string;
  fileType?: string;
};

// Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  username: text("username"),
  userEmail: text("useremail"),
  userPhone: text("userphone"),
  board: text("board"),
  class: integer("class"),
  subject: text("subject"),
  type: text("type").notNull(), // "general", "technical", "suggestion"
  feedbackText: text("feedback_text"),
  rating: integer("rating"), // 1-5 star rating
  file: text("file"), // File URL or path
  status: text("status").default("pending").notNull(), // pending, reviewed, resolved
  adminResponse: text("admin_response"),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

export type UpsertFeedback = typeof feedback.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;

// Quiz feedback table for post-quiz ratings
export const quizFeedback = pgTable("quiz_feedback", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  userId: integer("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 rating
  comments: text("comments"), // Optional feedback comments
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertQuizFeedback = typeof quizFeedback.$inferInsert;
export type QuizFeedback = typeof quizFeedback.$inferSelect;

// Question type definitions for JSON fields
export interface Question {
  id: number;
  questionType: string;
  question: string;
  options?: { [key: string]: string } | string[];
  correctAnswer: string;
  explanation?: string;
  bloomTaxonomy?: string;
  difficultyLevel?: string;
  diagram_instruction?: string;
  diagramUrl?: string;
}

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
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits").optional(),
  preferredSubject: z.string().optional(),
  grade: z.number().min(6).max(12).optional(),
  board: z.enum(["CBSE", "ICSE", "ISC"]).optional(),
});

// Quiz generation schema
export const generateQuizSchema = z.object({
  subjectId: z.number(),
  chapterId: z.number(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  questionTypes: z.array(z.enum(["mcq", "assertion-reasoning", "fill-in-blanks", "true-false"])).min(1, "Select at least one question type"),
  bloomTaxonomy: z.array(z.enum(["knowledge", "comprehension", "application", "analysis", "synthesis", "evaluation"])).min(1, "Select at least one Bloom's taxonomy level"),
  difficultyLevels: z.array(z.enum(["basic", "standard", "challenging", "most-challenging"])).min(1, "Select at least one difficulty level"),
  numberOfQuestions: z.number().min(5).max(50),
});

// Feedback schema
export const insertFeedbackSchema = createInsertSchema(feedback, {
  type: z.enum(["general", "technical", "suggestion"]),
  feedbackText: z.string().min(5, "Feedback must be at least 5 characters").optional(),
}).omit({ id: true, createdAt: true, reviewedAt: true, reviewedBy: true });
