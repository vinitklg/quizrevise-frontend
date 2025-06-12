import { users, subjects, chapters, topics, quizzes, quizSets, quizSchedules, doubtQueries, feedback, quizFeedback, } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, gte, lte, asc, desc, isNull, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
export class DatabaseStorage {
    // User operations
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }
    async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    }
    // Username is no longer used, we're using email as the primary identifier
    async createUser(userData) {
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
    async updateUser(id, data) {
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
    async updateSubscription(id, tier, subjectIds) {
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
    // Subject operations
    async getAllSubjects() {
        return await db.select().from(subjects);
    }
    async getSubjectById(id) {
        const [subject] = await db
            .select()
            .from(subjects)
            .where(eq(subjects.id, id));
        return subject;
    }
    async getSubjectsByBoard(board) {
        return await db.select().from(subjects).where(eq(subjects.board, board));
    }
    async getSubjectsByGrade(grade) {
        return await db
            .select()
            .from(subjects)
            .where(eq(subjects.gradeLevel, grade));
    }
    async getSubjectsByBoardAndGrade(board, grade) {
        return await db
            .select()
            .from(subjects)
            .where(and(eq(subjects.board, board), eq(subjects.gradeLevel, grade)));
    }
    async getSubjectsByBoardGradeStream(board, grade, stream) {
        const conditions = [
            eq(subjects.board, board),
            eq(subjects.gradeLevel, grade)
        ];
        if (grade <= 10 || stream === undefined || stream === null) {
            conditions.push(isNull(subjects.stream));
        }
        else {
            conditions.push(eq(subjects.stream, stream));
        }
        return await db
            .select()
            .from(subjects)
            .where(and(...conditions));
    }
    async getAvailableStreams(board, grade) {
        if (grade <= 10)
            return [];
        const result = await db
            .selectDistinct({ stream: subjects.stream })
            .from(subjects)
            .where(and(eq(subjects.board, board), eq(subjects.gradeLevel, grade), isNull(subjects.stream)));
        return result.map(r => r.stream).filter(Boolean);
    }
    async createSubject(subject) {
        const [createdSubject] = await db
            .insert(subjects)
            .values(subject)
            .returning();
        return createdSubject;
    }
    // Chapter operations
    async getChaptersBySubject(subjectId) {
        return await db
            .select()
            .from(chapters)
            .where(eq(chapters.subjectId, subjectId));
    }
    async createChapter(chapter) {
        const [createdChapter] = await db
            .insert(chapters)
            .values(chapter)
            .returning();
        return createdChapter;
    }
    // Topic operations
    async getTopicsByChapter(chapterId) {
        return await db
            .select()
            .from(topics)
            .where(eq(topics.chapterId, chapterId));
    }
    async getTopicsBySubject(subjectId) {
        return await db
            .select()
            .from(topics)
            .where(eq(topics.subjectId, subjectId));
    }
    async createTopic(topic) {
        const [createdTopic] = await db.insert(topics).values(topic).returning();
        return createdTopic;
    }
    async getTopicById(id) {
        const [topic] = await db.select().from(topics).where(eq(topics.id, id));
        return topic;
    }
    // Quiz operations
    async createQuiz(quiz) {
        const [createdQuiz] = await db.insert(quizzes).values(quiz).returning();
        return createdQuiz;
    }
    async getQuizById(id) {
        const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
        return quiz;
    }
    async getQuizzesByUser(userId) {
        // Ensure we only return quizzes for the specific user
        return await db
            .select()
            .from(quizzes)
            .where(eq(quizzes.userId, userId))
            .orderBy(quizzes.createdAt);
    }
    async getActiveQuizzesByUser(userId) {
        return await db
            .select()
            .from(quizzes)
            .where(and(eq(quizzes.userId, userId), eq(quizzes.status, "active")));
    }
    async findSimilarQuiz(criteria) {
        try {
            // Find a quiz with similar parameters
            const [similarQuiz] = await db
                .select()
                .from(quizzes)
                .where(and(eq(quizzes.subjectId, criteria.subjectId), eq(quizzes.topicId, criteria.topicId), eq(quizzes.numberOfQuestions, criteria.numberOfQuestions), eq(quizzes.status, "active")))
                .limit(1);
            if (!similarQuiz) {
                return undefined;
            }
            // Get all quiz sets for this quiz
            const quizSetsData = await db
                .select()
                .from(quizSets)
                .where(eq(quizSets.quizId, similarQuiz.id))
                .orderBy(quizSets.setNumber);
            if (quizSetsData.length === 8) {
                return { quizSets: quizSetsData };
            }
            return undefined;
        }
        catch (error) {
            console.error("Error finding similar quiz:", error);
            return undefined;
        }
    }
    // QuizSet operations
    async createQuizSet(quizSet) {
        const [createdQuizSet] = await db
            .insert(quizSets)
            .values(quizSet)
            .returning();
        return createdQuizSet;
    }
    async getQuizSetsByQuiz(quizId) {
        // Ensure quiz sets are returned in correct order for spaced repetition
        return await db
            .select()
            .from(quizSets)
            .where(eq(quizSets.quizId, quizId))
            .orderBy(quizSets.setNumber);
    }
    // QuizSchedule operations
    async createQuizSchedule(schedule) {
        const [createdSchedule] = await db
            .insert(quizSchedules)
            .values(schedule)
            .returning();
        return createdSchedule;
    }
    async getQuizSchedulesByUser(userId) {
        return await db
            .select()
            .from(quizSchedules)
            .where(eq(quizSchedules.userId, userId));
    }
    async getTodayQuizSchedules(userId) {
        const now = new Date();
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);
        return await db
            .select()
            .from(quizSchedules)
            .where(and(eq(quizSchedules.userId, userId), lte(quizSchedules.scheduledDate, endOfToday), // Show all quizzes scheduled for today or earlier
        eq(quizSchedules.status, "pending")))
            .orderBy(quizSchedules.scheduledDate);
    }
    async getUpcomingQuizSchedules(userId) {
        const tomorrow = new Date();
        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return await db
            .select()
            .from(quizSchedules)
            .where(and(eq(quizSchedules.userId, userId), gte(quizSchedules.scheduledDate, tomorrow), eq(quizSchedules.status, "pending")));
    }
    async updateQuizSchedule(id, data) {
        const [schedule] = await db
            .update(quizSchedules)
            .set(data)
            .where(eq(quizSchedules.id, id))
            .returning();
        return schedule;
    }
    async getQuizPerformance(userId, subjectId, startDate, endDate) {
        // Build the condition for filtering
        const whereConditions = [
            eq(quizSchedules.userId, userId),
            eq(quizSchedules.status, "completed"),
            sql `${quizSchedules.completedDate} IS NOT NULL`,
            sql `${quizSchedules.score} IS NOT NULL`,
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
        }
        else {
            queryBuilder = queryBuilder.where(and(...whereConditions));
        }
        const results = await queryBuilder.orderBy(asc(quizSchedules.completedDate));
        return results.map((result) => {
            const dateStr = result.date ? result.date.toISOString().split("T")[0] : "Unknown";
            return {
                date: `${dateStr} (Set ${result.quizSet})`,
                score: result.score || 0,
                quizSet: result.quizSet,
            };
        });
    }
    async getSubjectsWithPerformanceData(userId) {
        const results = await db
            .select({
            id: subjects.id,
            name: subjects.name,
        })
            .from(subjects)
            .innerJoin(quizzes, eq(quizzes.subjectId, subjects.id))
            .innerJoin(quizSchedules, eq(quizSchedules.quizId, quizzes.id))
            .where(and(eq(quizSchedules.userId, userId), eq(quizSchedules.status, "completed"), sql `${quizSchedules.score} IS NOT NULL`))
            .groupBy(subjects.id, subjects.name)
            .orderBy(subjects.name);
        return results;
    }
    // Doubt Query operations
    async createDoubtQuery(doubt) {
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
    async getDoubtQueriesByUser(userId) {
        return await db
            .select()
            .from(doubtQueries)
            .where(eq(doubtQueries.userId, userId));
    }
    async answerDoubtQuery(id, answer) {
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
    async getTotalUsers() {
        const result = await db.select({ count: sql `count(*)` }).from(users);
        return result[0]?.count || 0;
    }
    async getActiveUsers() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const result = await db
            .select({ count: sql `count(*)` })
            .from(users)
            .where(gte(users.createdAt, thirtyDaysAgo));
        return result[0]?.count || 0;
    }
    async getTotalQuizzes() {
        const result = await db.select({ count: sql `count(*)` }).from(quizzes);
        return result[0]?.count || 0;
    }
    async getCompletedQuizzes() {
        const result = await db
            .select({ count: sql `count(*)` })
            .from(quizSchedules)
            .where(eq(quizSchedules.status, "completed"));
        return result[0]?.count || 0;
    }
    async getTotalSubjects() {
        const result = await db.select({ count: sql `count(*)` }).from(subjects);
        return result[0]?.count || 0;
    }
    async getUsersByTier() {
        const results = await db
            .select({
            tier: users.subscriptionTier,
            count: sql `count(*)`
        })
            .from(users)
            .groupBy(users.subscriptionTier);
        const tiers = { free: 0, standard: 0, premium: 0 };
        results.forEach(result => {
            if (result.tier === 'free')
                tiers.free = result.count;
            else if (result.tier === 'standard')
                tiers.standard = result.count;
            else if (result.tier === 'premium')
                tiers.premium = result.count;
        });
        return tiers;
    }
    async getQuizzesThisWeek() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const result = await db
            .select({ count: sql `count(*)` })
            .from(quizzes)
            .where(gte(quizzes.createdAt, weekAgo));
        return result[0]?.count || 0;
    }
    async getAverageScore() {
        const result = await db
            .select({ avg: sql `avg(${quizSchedules.score})` })
            .from(quizSchedules)
            .where(eq(quizSchedules.status, "completed"));
        return Math.round(result[0]?.avg || 0);
    }
    async getRecentActivity() {
        const recentQuizzes = await db
            .select({
            id: quizzes.id,
            type: sql `'quiz_created'`,
            message: sql `'Quiz "' || ${quizzes.title} || '" was created'`,
            timestamp: quizzes.createdAt,
            userId: quizzes.userId
        })
            .from(quizzes)
            .orderBy(desc(quizzes.createdAt))
            .limit(20);
        const recentCompletions = await db
            .select({
            id: quizSchedules.id,
            type: sql `'quiz_completed'`,
            message: sql `'Quiz completed with score ' || ${quizSchedules.score} || '%'`,
            timestamp: quizSchedules.completedDate,
            userId: quizSchedules.userId
        })
            .from(quizSchedules)
            .where(eq(quizSchedules.status, "completed"))
            .orderBy(desc(quizSchedules.completedDate))
            .limit(10);
        const allActivity = [...recentQuizzes, ...recentCompletions]
            .sort((a, b) => new Date(b.timestamp ?? 0).getTime() - new Date(a.timestamp ?? 0).getTime())
            .slice(0, 15);
        return allActivity;
    }
    async getAllUsers() {
        return await db.select().from(users).orderBy(desc(users.createdAt));
    }
    async deleteUser(userId) {
        // First delete related data
        await db.delete(quizSchedules).where(eq(quizSchedules.userId, userId));
        await db.delete(doubtQueries).where(eq(doubtQueries.userId, userId));
        await db.delete(quizzes).where(eq(quizzes.userId, userId));
        // Then delete the user
        await db.delete(users).where(eq(users.id, userId));
    }
    async getAllQuizzes() {
        const allQuizzes = await db
            .select({
            id: quizzes.id,
            title: quizzes.title,
            subjectId: quizzes.subjectId,
            chapterId: quizzes.chapterId,
            topicId: quizzes.topicId,
            questionTypes: quizzes.questionTypes,
            difficultyLevels: quizzes.difficultyLevels,
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
    async createFeedback(feedbackData) {
        const [newFeedback] = await db
            .insert(feedback)
            .values(feedbackData)
            .returning();
        return newFeedback;
    }
    async getFeedbackByUser(userId) {
        return await db
            .select()
            .from(feedback)
            .where(eq(feedback.userId, userId))
            .orderBy(desc(feedback.createdAt));
    }
    async getAllFeedback() {
        return await db
            .select()
            .from(feedback)
            .orderBy(desc(feedback.createdAt));
    }
    async updateFeedback(id, data) {
        const [updated] = await db
            .update(feedback)
            .set(data)
            .where(eq(feedback.id, id))
            .returning();
        return updated;
    }
    // Admin-specific methods
    async updateUserPassword(userId, hashedPassword) {
        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, userId));
    }
    // Quiz feedback operations
    async createQuizFeedback(feedback) {
        const [newFeedback] = await db
            .insert(quizFeedback)
            .values(feedback)
            .returning();
        return newFeedback;
    }
    async getQuizFeedback(quizId, userId) {
        const [feedback] = await db
            .select()
            .from(quizFeedback)
            .where(and(eq(quizFeedback.quizId, quizId), eq(quizFeedback.userId, userId)));
        return feedback;
    }
    async getQuizSetById(id) {
        const [quizSet] = await db
            .select()
            .from(quizSets)
            .where(eq(quizSets.id, id));
        return quizSet;
    }
    async getQuizSchedulesByQuizAndSet(quizId, quizSetId, userId) {
        return await db
            .select()
            .from(quizSchedules)
            .where(and(eq(quizSchedules.quizId, quizId), eq(quizSchedules.quizSetId, quizSetId), eq(quizSchedules.userId, userId)));
    }
    async updateQuizStatus(quizId, status) {
        await db
            .update(quizSchedules)
            .set({ status })
            .where(eq(quizSchedules.quizId, quizId));
    }
    async getQuizSet(id) {
        const [quizSet] = await db
            .select()
            .from(quizSets)
            .where(eq(quizSets.id, id));
        return quizSet;
    }
}
export const storage = new DatabaseStorage(); // ✅ This must come after the class ends
