import {
  users,
  subjects,
  chapters,
  topics,
  quizzes,
  quizSets,
  quizSchedules,
  doubtQueries,
  feedback,
  quizFeedback,
  type User,
  type InsertUser,
  type Subject,
  type InsertSubject,
  type Chapter,
  type InsertChapter,
  type Topic,
  type InsertTopic,
  type Quiz,
  type InsertQuiz,
  type QuizSet,
  type InsertQuizSet,
  type QuizSchedule,
  type InsertQuizSchedule,
  type DoubtQuery,
  type InsertDoubtQuery,
  type Feedback,
  type UpsertFeedback,
  type QuizFeedback,
  type UpsertQuizFeedback,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lt, gt, lte, ne, asc, desc, isNull, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  updateSubscription(
    id: number,
    tier: string,
    subjectIds: string[],
  ): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Subject operations
  getAllSubjects(): Promise<Subject[]>;
  getSubjectById(id: number): Promise<Subject | undefined>;
  getSubjectsByBoard(board: string): Promise<Subject[]>;
  getSubjectsByGrade(grade: number): Promise<Subject[]>;
  getSubjectsByBoardAndGrade(board: string, grade: number): Promise<Subject[]>;
  getSubjectsByBoardGradeStream(board: string, grade: number, stream?: string): Promise<Subject[]>;
  getAvailableStreams(board: string, grade: number): Promise<string[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Chapter operations
  getChaptersBySubject(subjectId: number): Promise<Chapter[]>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;

  // Topic operations
  getTopicsByChapter(chapterId: number): Promise<Topic[]>;
  getTopicsBySubject(subjectId: number): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  getTopicById(id: number): Promise<Topic | undefined>;

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
  getUpcomingQuizSchedules(userId: number): Promise<QuizSchedule[]>;
  getQuizSchedulesByQuizAndSet(
    quizId: number,
    quizSetId: number,
    userId: number,
  ): Promise<QuizSchedule[]>;
  updateQuizSchedule(
    id: number,
    data: Partial<QuizSchedule>,
  ): Promise<QuizSchedule | undefined>;
  getQuizPerformance(
    userId: number,
    subjectId?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ date: string; score: number; quizSet: number }[]>;
  getSubjectsWithPerformanceData(userId: number): Promise<{ id: number; name: string }[]>;

  // Doubt Query operations
  createDoubtQuery(doubt: InsertDoubtQuery): Promise<DoubtQuery>;
  getDoubtQueriesByUser(userId: number): Promise<DoubtQuery[]>;
  answerDoubtQuery(id: number, answer: string): Promise<DoubtQuery | undefined>;

  // Feedback operations
  createFeedback(feedback: UpsertFeedback): Promise<Feedback>;
  getFeedbackByUser(userId: number): Promise<Feedback[]>;
  getAllFeedback(): Promise<Feedback[]>;
  updateFeedback(id: number, data: Partial<Feedback>): Promise<Feedback | undefined>;

  // Quiz feedback operations
  createQuizFeedback(feedback: UpsertQuizFeedback): Promise<QuizFeedback>;
  getQuizFeedback(quizId: number, userId: number): Promise<QuizFeedback | undefined>;

  // Admin operations
  getTotalUsers(): Promise<number>;
  getActiveUsers(): Promise<number>;
  getTotalQuizzes(): Promise<number>;
  getCompletedQuizzes(): Promise<number>;
  getTotalSubjects(): Promise<number>;
  getUsersByTier(): Promise<{ free: number; standard: number; premium: number }>;
  getQuizzesThisWeek(): Promise<number>;
  getAverageScore(): Promise<number>;
  getRecentActivity(): Promise<any[]>;
  getAllUsers(): Promise<any[]>;
  getAllSubjects(): Promise<any[]>;
  getAllQuizzes(): Promise<any[]>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;
  getQuizzesByUser(userId: number): Promise<any[]>;
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

  // Username is no longer used, we're using email as the primary identifier

  async createUser(userData: InsertUser): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Ensure subscribedSubjects is an array if not provided
    const subscribedSubjects = userData.subscribedSubjects || [];

    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
        subscribedSubjects,
      })
      .returning();
    return user;
  }

  async updateUser(
    id: number,
    data: Partial<InsertUser>,
  ): Promise<User | undefined> {
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

  async updateSubscription(
    id: number,
    tier: string,
    subjectIds: string[],
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionTier: tier,
        subscribedSubjects: subjectIds,
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Subject operations
  async getAllSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubjectById(id: number): Promise<Subject | undefined> {
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id));
    return subject;
  }

  async getSubjectsByBoard(board: string): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.board, board));
  }

  async getSubjectsByGrade(grade: number): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(eq(subjects.gradeLevel, grade));
  }

  async getSubjectsByBoardAndGrade(
    board: string,
    grade: number,
  ): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.board, board), eq(subjects.gradeLevel, grade)));
  }

  async getSubjectsByBoardGradeStream(
    board: string, 
    grade: number, 
    stream?: string
  ): Promise<Subject[]> {
    const conditions = [
      eq(subjects.board, board),
      eq(subjects.gradeLevel, grade)
    ];

    // For grades 6-10, stream should be null
    // For grades 11-12, filter by stream
    if (grade <= 10) {
      conditions.push(eq(subjects.stream, null));
    } else if (stream) {
      conditions.push(eq(subjects.stream, stream));
    }

    return await db
      .select()
      .from(subjects)
      .where(and(...conditions));
  }

  async getAvailableStreams(board: string, grade: number): Promise<string[]> {
    if (grade <= 10) return [];

    const result = await db
      .selectDistinct({ stream: subjects.stream })
      .from(subjects)
      .where(
        and(
          eq(subjects.board, board),
          eq(subjects.gradeLevel, grade),
          ne(subjects.stream, null)
        )
      );

    return result.map(r => r.stream).filter(Boolean) as string[];
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [createdSubject] = await db
      .insert(subjects)
      .values(subject)
      .returning();
    return createdSubject;
  }

  // Chapter operations
  async getChaptersBySubject(subjectId: number): Promise<Chapter[]> {
    return await db
      .select()
      .from(chapters)
      .where(eq(chapters.subjectId, subjectId));
  }

  async createChapter(chapter: InsertChapter): Promise<Chapter> {
    const [createdChapter] = await db
      .insert(chapters)
      .values(chapter)
      .returning();
    return createdChapter;
  }

  // Topic operations
  async getTopicsByChapter(chapterId: number): Promise<Topic[]> {
    return await db
      .select()
      .from(topics)
      .where(eq(topics.chapterId, chapterId));
  }

  async getTopicsBySubject(subjectId: number): Promise<Topic[]> {
    return await db
      .select()
      .from(topics)
      .where(eq(topics.subjectId, subjectId));
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [createdTopic] = await db.insert(topics).values(topic).returning();
    return createdTopic;
  }

  async getTopicById(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
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
    // Ensure we only return quizzes for the specific user
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(quizzes.createdAt);
  }

  async getActiveQuizzesByUser(userId: number): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.userId, userId), eq(quizzes.status, "active")));
  }

  // QuizSet operations
  async createQuizSet(quizSet: InsertQuizSet): Promise<QuizSet> {
    const [createdQuizSet] = await db
      .insert(quizSets)
      .values(quizSet)
      .returning();
    return createdQuizSet;
  }

  async getQuizSetsByQuiz(quizId: number): Promise<QuizSet[]> {
    // Ensure quiz sets are returned in correct order for spaced repetition
    return await db
      .select()
      .from(quizSets)
      .where(eq(quizSets.quizId, quizId))
      .orderBy(quizSets.setNumber);
  }

  async getQuizSetById(id: number): Promise<QuizSet | undefined> {
    const [quizSet] = await db
      .select()
      .from(quizSets)
      .where(eq(quizSets.id, id));
    return quizSet;
  }

  // QuizSchedule operations
  async createQuizSchedule(
    schedule: InsertQuizSchedule,
  ): Promise<QuizSchedule> {
    const [createdSchedule] = await db
      .insert(quizSchedules)
      .values(schedule)
      .returning();
    return createdSchedule;
  }

  async getQuizSchedulesByUser(userId: number): Promise<QuizSchedule[]> {
    return await db
      .select()
      .from(quizSchedules)
      .where(eq(quizSchedules.userId, userId));
  }

  async getTodayQuizSchedules(userId: number): Promise<QuizSchedule[]> {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(quizSchedules)
      .where(
        and(
          eq(quizSchedules.userId, userId),
          lte(quizSchedules.scheduledDate, endOfToday), // Show all quizzes scheduled for today or earlier
          eq(quizSchedules.status, "pending"),
        ),
      )
      .orderBy(quizSchedules.scheduledDate);
  }

  async getUpcomingQuizSchedules(userId: number): Promise<QuizSchedule[]> {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db
      .select()
      .from(quizSchedules)
      .where(
        and(
          eq(quizSchedules.userId, userId),
          gte(quizSchedules.scheduledDate, tomorrow),
          eq(quizSchedules.status, "pending"),
        ),
      );
  }

  async updateQuizSchedule(
    id: number,
    data: Partial<QuizSchedule>,
  ): Promise<QuizSchedule | undefined> {
    const [schedule] = await db
      .update(quizSchedules)
      .set(data)
      .where(eq(quizSchedules.id, id))
      .returning();
    return schedule;
  }

  async getQuizSchedulesByQuizAndSet(
    quizId: number,
    quizSetId: number,
    userId: number,
  ): Promise<QuizSchedule[]> {
    return await db
      .select()
      .from(quizSchedules)
      .where(
        and(
          eq(quizSchedules.quizId, quizId),
          eq(quizSchedules.quizSetId, quizSetId),
          eq(quizSchedules.userId, userId),
        ),
      );
  }

  async getQuizPerformance(
    userId: number,
    subjectId?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ date: string; score: number; quizSet: number }[]> {
    // Build the condition for filtering
    const whereConditions = [
      eq(quizSchedules.userId, userId),
      eq(quizSchedules.status, "completed"),
      sql`${quizSchedules.completedDate} IS NOT NULL`,
      sql`${quizSchedules.score} IS NOT NULL`,
    ];

    // Add date range filters if provided
    if (startDate) {
      whereConditions.push(gte(quizSchedules.completedDate, startDate));
    }

    if (endDate) {
      whereConditions.push(lte(quizSchedules.completedDate, endDate));
    }

    // Add subject filter if provided
    let queryBuilder = db
      .select({
        date: quizSchedules.completedDate,
        score: quizSchedules.score,
        quizSet: quizSchedules.quizSetId,
        quizId: quizSchedules.quizId,
        scheduleId: quizSchedules.id,
      })
      .from(quizSchedules);

    if (subjectId) {
      queryBuilder = queryBuilder
        .innerJoin(quizzes, eq(quizzes.id, quizSchedules.quizId))
        .where(and(...whereConditions, eq(quizzes.subjectId, subjectId)));
    } else {
      queryBuilder = queryBuilder.where(and(...whereConditions));
    }

    const results = await queryBuilder.orderBy(
      asc(quizSchedules.completedDate),
    );

    return results.map((result) => ({
      date: `${result.date?.toISOString().split("T")[0]} (Set ${result.quizSet})`,
      score: result.score || 0,
      quizSet: result.quizSet,
    }));
  }

  async getSubjectsWithPerformanceData(userId: number): Promise<{ id: number; name: string }[]> {
    const results = await db
      .select({
        id: subjects.id,
        name: subjects.name,
      })
      .from(subjects)
      .innerJoin(quizzes, eq(quizzes.subjectId, subjects.id))
      .innerJoin(quizSchedules, eq(quizSchedules.quizId, quizzes.id))
      .where(
        and(
          eq(quizSchedules.userId, userId),
          eq(quizSchedules.status, "completed"),
          sql`${quizSchedules.score} IS NOT NULL`
        )
      )
      .groupBy(subjects.id, subjects.name)
      .orderBy(subjects.name);

    return results;
  }

  // Doubt Query operations
  async createDoubtQuery(doubt: InsertDoubtQuery): Promise<DoubtQuery> {
    // Map subject name to the database column
    const [createdDoubt] = await db
      .insert(doubtQueries)
      .values({
        userId: doubt.userId,
        subjectId: doubt.subjectId,
        question: doubt.question,
        board: doubt.board,
        class: doubt.class,
        subjectName: doubt.subjectName,
        fileUrl: doubt.fileUrl,
        fileType: doubt.fileType,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();
    return createdDoubt;
  }

  async getDoubtQueriesByUser(userId: number): Promise<DoubtQuery[]> {
    return await db
      .select()
      .from(doubtQueries)
      .where(eq(doubtQueries.userId, userId));
  }

  async answerDoubtQuery(
    id: number,
    answer: string,
  ): Promise<DoubtQuery | undefined> {
    const [doubt] = await db
      .update(doubtQueries)
      .set({
        answer,
        status: "answered",
        answeredAt: new Date(),
      })
      .where(eq(doubtQueries.id, id))
      .returning();
    return doubt;
  }

  // Admin operations
  async getTotalUsers(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result[0]?.count || 0;
  }

  async getActiveUsers(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    return result[0]?.count || 0;
  }

  async getTotalQuizzes(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(quizzes);
    return result[0]?.count || 0;
  }

  async getCompletedQuizzes(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizSchedules)
      .where(eq(quizSchedules.status, "completed"));
    return result[0]?.count || 0;
  }

  async getTotalSubjects(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(subjects);
    return result[0]?.count || 0;
  }

  async getUsersByTier(): Promise<{ free: number; standard: number; premium: number }> {
    const results = await db
      .select({
        tier: users.subscriptionTier,
        count: sql<number>`count(*)`
      })
      .from(users)
      .groupBy(users.subscriptionTier);

    const tiers = { free: 0, standard: 0, premium: 0 };
    results.forEach(result => {
      if (result.tier === 'free') tiers.free = result.count;
      else if (result.tier === 'standard') tiers.standard = result.count;
      else if (result.tier === 'premium') tiers.premium = result.count;
    });

    return tiers;
  }

  async getQuizzesThisWeek(): Promise<number> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizzes)
      .where(gte(quizzes.createdAt, weekAgo));
    return result[0]?.count || 0;
  }

  async getAverageScore(): Promise<number> {
    const result = await db
      .select({ avg: sql<number>`avg(${quizSchedules.score})` })
      .from(quizSchedules)
      .where(eq(quizSchedules.status, "completed"));
    return Math.round(result[0]?.avg || 0);
  }

  async getRecentActivity(): Promise<any[]> {
    const recentQuizzes = await db
      .select({
        id: quizzes.id,
        type: sql<string>`'quiz_created'`,
        message: sql<string>`'Quiz "' || ${quizzes.title} || '" was created'`,
        timestamp: quizzes.createdAt,
        userId: quizzes.userId
      })
      .from(quizzes)
      .orderBy(desc(quizzes.createdAt))
      .limit(20);

    const recentCompletions = await db
      .select({
        id: quizSchedules.id,
        type: sql<string>`'quiz_completed'`,
        message: sql<string>`'Quiz completed with score ' || ${quizSchedules.score} || '%'`,
        timestamp: quizSchedules.completedDate,
        userId: quizSchedules.userId
      })
      .from(quizSchedules)
      .where(eq(quizSchedules.status, "completed"))
      .orderBy(desc(quizSchedules.completedDate))
      .limit(10);

    const allActivity = [...recentQuizzes, ...recentCompletions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    return allActivity;
  }

  async getAllUsers(): Promise<any[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(userId: number): Promise<void> {
    // First delete related data
    await db.delete(quizSchedules).where(eq(quizSchedules.userId, userId));
    await db.delete(doubtQueries).where(eq(doubtQueries.userId, userId));
    await db.delete(quizzes).where(eq(quizzes.userId, userId));
    
    // Then delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async getAllSubjects(): Promise<any[]> {
    return await db.select().from(subjects).orderBy(subjects.name);
  }

  async getAllQuizzes(): Promise<any[]> {
    const allQuizzes = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        subjectId: quizzes.subjectId,
        chapterId: quizzes.chapterId,
        topicId: quizzes.topicId,
        questionTypes: quizzes.questionTypes,
        difficultyLevel: quizzes.difficultyLevel,
        createdAt: quizzes.createdAt,
        userId: quizzes.userId,
        username: users.username,
        userEmail: users.email
      })
      .from(quizzes)
      .innerJoin(users, eq(quizzes.userId, users.id))
      .orderBy(desc(quizzes.createdAt));

    return allQuizzes;
  }

  // Feedback operations
  async createFeedback(feedbackData: UpsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(feedbackData)
      .returning();
    return newFeedback;
  }

  async getFeedbackByUser(userId: number): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.userId, userId))
      .orderBy(desc(feedback.createdAt));
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .orderBy(desc(feedback.createdAt));
  }

  async updateFeedback(id: number, data: Partial<Feedback>): Promise<Feedback | undefined> {
    const [updated] = await db
      .update(feedback)
      .set(data)
      .where(eq(feedback.id, id))
      .returning();
    return updated;
  }

  // Admin-specific methods
  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async getQuizzesByUser(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(desc(quizzes.createdAt));
  }

  // Quiz feedback operations
  async createQuizFeedback(feedback: UpsertQuizFeedback): Promise<QuizFeedback> {
    const [newFeedback] = await db
      .insert(quizFeedback)
      .values(feedback)
      .returning();
    return newFeedback;
  }

  async getQuizFeedback(quizId: number, userId: number): Promise<QuizFeedback | undefined> {
    const [feedback] = await db
      .select()
      .from(quizFeedback)
      .where(and(eq(quizFeedback.quizId, quizId), eq(quizFeedback.userId, userId)));
    return feedback;
  }
}

export const storage = new DatabaseStorage();
