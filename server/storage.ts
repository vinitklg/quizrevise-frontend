import {
  users,
  subjects,
  chapters,
  quizzes,
  quizSets,
  quizSchedules,
  doubtQueries,
  type User,
  type InsertUser,
  type Subject,
  type InsertSubject,
  type Chapter,
  type InsertChapter,
  type Quiz,
  type InsertQuiz,
  type QuizSet,
  type InsertQuizSet,
  type QuizSchedule,
  type InsertQuizSchedule,
  type DoubtQuery,
  type InsertDoubtQuery
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lt } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  updateSubscription(id: number, tier: string): Promise<User | undefined>;

  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubjectsByBoard(board: string): Promise<Subject[]>;
  getSubjectsByGrade(grade: number): Promise<Subject[]>;
  getSubjectsByBoardAndGrade(board: string, grade: number): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Chapter operations
  getChaptersBySubject(subjectId: number): Promise<Chapter[]>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;

  // Quiz operations
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  getQuizzesByUser(userId: number): Promise<Quiz[]>;
  getActiveQuizzesByUser(userId: number): Promise<Quiz[]>;

  // QuizSet operations
  createQuizSet(quizSet: InsertQuizSet): Promise<QuizSet>;
  getQuizSetsByQuiz(quizId: number): Promise<QuizSet[]>;
  getQuizSetById(id: number): Promise<QuizSet | undefined>;

  // QuizSchedule operations
  createQuizSchedule(schedule: InsertQuizSchedule): Promise<QuizSchedule>;
  getQuizSchedulesByUser(userId: number): Promise<QuizSchedule[]>;
  getTodayQuizSchedules(userId: number): Promise<QuizSchedule[]>;
  updateQuizSchedule(id: number, data: Partial<QuizSchedule>): Promise<QuizSchedule | undefined>;

  // Doubt Query operations
  createDoubtQuery(doubt: InsertDoubtQuery): Promise<DoubtQuery>;
  getDoubtQueriesByUser(userId: number): Promise<DoubtQuery[]>;
  answerDoubtQuery(id: number, answer: string): Promise<DoubtQuery | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword
      })
      .returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateSubscription(id: number, tier: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ subscriptionTier: tier })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubjectsByBoard(board: string): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.board, board));
  }

  async getSubjectsByGrade(grade: number): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.gradeLevel, grade));
  }

  async getSubjectsByBoardAndGrade(board: string, grade: number): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.board, board), eq(subjects.gradeLevel, grade)));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [createdSubject] = await db.insert(subjects).values(subject).returning();
    return createdSubject;
  }

  // Chapter operations
  async getChaptersBySubject(subjectId: number): Promise<Chapter[]> {
    return await db.select().from(chapters).where(eq(chapters.subjectId, subjectId));
  }

  async createChapter(chapter: InsertChapter): Promise<Chapter> {
    const [createdChapter] = await db.insert(chapters).values(chapter).returning();
    return createdChapter;
  }

  // Quiz operations
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [createdQuiz] = await db.insert(quizzes).values(quiz).returning();
    return createdQuiz;
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizzesByUser(userId: number): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.userId, userId));
  }

  async getActiveQuizzesByUser(userId: number): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.userId, userId), eq(quizzes.status, "active")));
  }

  // QuizSet operations
  async createQuizSet(quizSet: InsertQuizSet): Promise<QuizSet> {
    const [createdQuizSet] = await db.insert(quizSets).values(quizSet).returning();
    return createdQuizSet;
  }

  async getQuizSetsByQuiz(quizId: number): Promise<QuizSet[]> {
    return await db.select().from(quizSets).where(eq(quizSets.quizId, quizId));
  }

  async getQuizSetById(id: number): Promise<QuizSet | undefined> {
    const [quizSet] = await db.select().from(quizSets).where(eq(quizSets.id, id));
    return quizSet;
  }

  // QuizSchedule operations
  async createQuizSchedule(schedule: InsertQuizSchedule): Promise<QuizSchedule> {
    const [createdSchedule] = await db.insert(quizSchedules).values(schedule).returning();
    return createdSchedule;
  }

  async getQuizSchedulesByUser(userId: number): Promise<QuizSchedule[]> {
    return await db.select().from(quizSchedules).where(eq(quizSchedules.userId, userId));
  }

  async getTodayQuizSchedules(userId: number): Promise<QuizSchedule[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await db
      .select()
      .from(quizSchedules)
      .where(
        and(
          eq(quizSchedules.userId, userId),
          gte(quizSchedules.scheduledDate, today),
          lt(quizSchedules.scheduledDate, tomorrow),
          eq(quizSchedules.status, "pending")
        )
      );
  }

  async updateQuizSchedule(id: number, data: Partial<QuizSchedule>): Promise<QuizSchedule | undefined> {
    const [schedule] = await db
      .update(quizSchedules)
      .set(data)
      .where(eq(quizSchedules.id, id))
      .returning();
    return schedule;
  }

  // Doubt Query operations
  async createDoubtQuery(doubt: InsertDoubtQuery): Promise<DoubtQuery> {
    const [createdDoubt] = await db
      .insert(doubtQueries)
      .values({
        ...doubt,
        status: "pending",
        createdAt: new Date()
      })
      .returning();
    return createdDoubt;
  }

  async getDoubtQueriesByUser(userId: number): Promise<DoubtQuery[]> {
    return await db.select().from(doubtQueries).where(eq(doubtQueries.userId, userId));
  }

  async answerDoubtQuery(id: number, answer: string): Promise<DoubtQuery | undefined> {
    const [doubt] = await db
      .update(doubtQueries)
      .set({
        answer,
        status: "answered",
        answeredAt: new Date()
      })
      .where(eq(doubtQueries.id, id))
      .returning();
    return doubt;
  }
}

export const storage = new DatabaseStorage();
