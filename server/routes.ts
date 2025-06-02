import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool, db } from "./db";
import { quizzes, quizSchedules, quizSets } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateQuizQuestions, generateBatchQuizQuestions, answerDoubtQuery } from "./openai";
import { renderDiagram } from "./diagramRenderer";
import bcrypt from "bcryptjs";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { 
  loginSchema, 
  signupSchema, 
  generateQuizSchema, 
  insertDoubtQuerySchema
} from "@shared/schema";
import { ZodError } from "zod";

// Add missing type declarations
import { SessionData } from 'express-session';

// Extend SessionData interface to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  console.log("Session check:", {
    sessionId: req.sessionID,
    userId: req.session.userId,
    session: req.session
  });
  
  if (req.session.userId) {
    next();
  } else {
    console.log("Authentication failed - no userId in session");
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Middleware to check if user is admin
const isAdminAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.session.userId && (req.session as any).isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Admin access required" });
  }
};

// Helper to calculate spaced repetition dates
const calculateSpacedRepetitionDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  const intervals = [0, 1, 5, 15, 30, 60, 120, 180]; // Days
  
  for (let i = 0; i < intervals.length; i++) {
    const date = new Date(startDate);
    if (i === 0) {
      // Make first quiz available immediately
      date.setTime(startDate.getTime() - 1000); // 1 second ago to ensure it's available
    } else {
      date.setDate(date.getDate() + intervals[i]);
    }
    dates.push(date);
  }
  
  return dates;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up simple session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'quiz-revise-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  }));

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Set initial empty subscribed subjects array and ensure required fields
      const userData = {
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName || null,
        lastName: validatedData.lastName || null,
        phoneNumber: validatedData.phoneNumber || null,
        grade: validatedData.grade || 10,
        board: validatedData.board || "CBSE",
        selectedSubjects: validatedData.selectedSubjects || []
      };
      
      const user = await storage.createUser(userData);
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Check for admin credentials
      if (validatedData.email === "admin@quickrevise.com" && validatedData.password === "admin123") {
        req.session.userId = 6; // Admin user ID
        req.session.isAdmin = true;
        return res.json({
          id: 6,
          username: "admin",
          email: "admin@quickrevise.com",
          isAdmin: true,
          message: "Admin login successful"
        });
      }
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.redirect("/");
    });
  });

  app.get("/api/auth/me", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Temporary setup route to populate subjects
  app.post("/api/setup/subjects", async (req, res) => {
    try {
      const subjects = [
        // CBSE Grade 6-10
        { name: 'Mathematics', board: 'CBSE', grade: 6 },
        { name: 'Science', board: 'CBSE', grade: 6 },
        { name: 'Social Science', board: 'CBSE', grade: 6 },
        { name: 'English', board: 'CBSE', grade: 6 },
        { name: 'Hindi', board: 'CBSE', grade: 6 },
        
        { name: 'Mathematics', board: 'CBSE', grade: 11, stream: 'Science' },
        { name: 'Physics', board: 'CBSE', grade: 11, stream: 'Science' },
        { name: 'Chemistry', board: 'CBSE', grade: 11, stream: 'Science' },
        { name: 'Biology', board: 'CBSE', grade: 11, stream: 'Science' },
        { name: 'English', board: 'CBSE', grade: 11, stream: 'Science' },
        
        { name: 'Accountancy', board: 'CBSE', grade: 11, stream: 'Commerce' },
        { name: 'Business Studies', board: 'CBSE', grade: 11, stream: 'Commerce' },
        { name: 'Economics', board: 'CBSE', grade: 11, stream: 'Commerce' },
        { name: 'Mathematics', board: 'CBSE', grade: 11, stream: 'Commerce' },
        { name: 'English', board: 'CBSE', grade: 11, stream: 'Commerce' },
        
        { name: 'Mathematics', board: 'ICSE', grade: 9 },
        { name: 'Physics', board: 'ICSE', grade: 9 },
        { name: 'Chemistry', board: 'ICSE', grade: 9 },
        { name: 'Biology', board: 'ICSE', grade: 9 },
        { name: 'English', board: 'ICSE', grade: 9 },
        
        { name: 'Physics', board: 'ISC', grade: 11, stream: 'Science' },
        { name: 'Chemistry', board: 'ISC', grade: 11, stream: 'Science' },
        { name: 'Mathematics', board: 'ISC', grade: 11, stream: 'Science' },
        { name: 'Biology', board: 'ISC', grade: 11, stream: 'Science' },
        { name: 'English', board: 'ISC', grade: 11, stream: 'Science' }
      ];

      for (const subject of subjects) {
        await storage.createSubject({
          name: subject.name,
          board: subject.board,
          grade: subject.grade,
          stream: subject.stream || null,
          code: `${subject.board}_${subject.grade}_${subject.name.replace(/\s+/g, '_')}`
        });
      }

      res.json({ message: "Subjects populated successfully", count: subjects.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to populate subjects" });
    }
  });

  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    try {
      const { board, grade } = req.query;
      
      let subjects;
      if (board && grade) {
        subjects = await storage.getSubjectsByBoardAndGrade(board as string, parseInt(grade as string));
      } else if (board) {
        subjects = await storage.getSubjectsByBoard(board as string);
      } else if (grade) {
        subjects = await storage.getSubjectsByGrade(parseInt(grade as string));
      } else {
        subjects = await storage.getAllSubjects();
      }
      
      res.json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get subjects" });
    }
  });
  
  // Get subjects that the user has subscribed to
  app.get("/api/subjects/subscribed", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get subjects from user's preferred subjects in profile
      const preferredSubjects = user.preferredSubject || "";
      
      if (!preferredSubjects.trim()) {
        return res.json([]);
      }
      
      // Split preferred subjects by comma and clean them up
      const subjectNames = preferredSubjects
        .split(',')
        .map(subject => subject.trim())
        .filter(subject => subject.length > 0);
      
      // For each subject name, find or create the subject
      const subjects = [];
      for (const subjectName of subjectNames) {
        // First try to find existing subject
        const existingSubjects = await storage.getAllSubjects();
        let subject = existingSubjects.find(s => 
          s.name.toLowerCase() === subjectName.toLowerCase()
        );
        
        // If subject doesn't exist, create it
        if (!subject) {
          subject = await storage.createSubject({
            name: subjectName,
            gradeLevel: user.grade || 10,
            board: user.board || "CBSE"
          });
        }
        
        if (subject) {
          subjects.push(subject);
        }
      }
      
      res.json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get subscribed subjects" });
    }
  });

  // Chapter routes
  app.get("/api/subjects/:subjectId/chapters", async (req, res) => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const chapters = await storage.getChaptersBySubject(subjectId);
      res.json(chapters);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get chapters" });
    }
  });

  // Quiz routes
  app.post("/api/quizzes", isAuthenticated, async (req, res) => {
    try {
      // Get the request data and ensure required fields
      const reqData = req.body;
      
      // Basic validation
      if (!reqData.subject || !reqData.chapter || !reqData.title || !reqData.topic || !reqData.class) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Get the user to check subscription tier and validate subject access
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify subject is in the user's subscribed subjects if they're on a paid plan
      if (user.subscriptionTier !== "free" && user.subscribedSubjects && user.subscribedSubjects.length > 0) {
        // Check if any subscribed subject matches the requested subject name
        const hasAccess = user.subscribedSubjects.some(subscribedSubject => {
          // Extract subject name from subscribed subject code (e.g., ICSE_10_MATHEMATICS -> Mathematics)
          const subjectName = subscribedSubject.split('_').pop()?.toLowerCase();
          return subjectName === reqData.subject.toLowerCase() || 
                 subscribedSubject.toLowerCase().includes(reqData.subject.toLowerCase());
        });
        
        if (!hasAccess) {
          return res.status(403).json({ 
            message: "You don't have access to this subject. Please subscribe to it first."
          });
        }
      }
      
      // Find or create the subject dynamically based on user input
      const subjects = await storage.getSubjectsByBoardAndGrade(user.board || "CBSE", user.grade || 10);
      let selectedSubject = subjects.find(s => s.name.toLowerCase() === reqData.subject.toLowerCase());
      
      // If subject doesn't exist, create it dynamically
      if (!selectedSubject) {
        selectedSubject = await storage.createSubject({
          name: reqData.subject,
          gradeLevel: user.grade || 10,
          board: user.board || "CBSE"
        });
        console.log(`Created new subject: ${reqData.subject} for ${user.board || "CBSE"} Grade ${user.grade || 10}`);
      }
      
      const chapters = await storage.getChaptersBySubject(selectedSubject.id);
      let selectedChapter = chapters.find(c => c.name.toLowerCase() === reqData.chapter.toLowerCase());
      
      // If chapter doesn't exist, create it
      if (!selectedChapter) {
        selectedChapter = await storage.createChapter({
          subjectId: selectedSubject.id,
          name: reqData.chapter
        });
      }

      // Find or create the specific topic for better targeting
      const topics = await storage.getTopicsByChapter(selectedChapter.id);
      let selectedTopic = topics.find(t => t.name.toLowerCase() === reqData.topic.toLowerCase());
      
      // If topic doesn't exist, create it
      if (!selectedTopic) {
        selectedTopic = await storage.createTopic({
          chapterId: selectedChapter.id,
          subjectId: selectedSubject.id,
          name: reqData.topic,
          description: `Topic: ${reqData.topic} in ${selectedChapter.name}`
        });
      }
      
      // Process the data with correct IDs including topic ID for better targeting
      const validatedData = {
        subjectId: selectedSubject.id,
        chapterId: selectedChapter.id,
        topicId: selectedTopic.id, // Using topic ID for precise targeting
        title: reqData.title,
        topic: reqData.topic,
        questionTypes: reqData.questionTypes || ["mcq"],
        bloomTaxonomy: reqData.bloomTaxonomy || ["knowledge", "comprehension"],
        difficultyLevels: reqData.difficultyLevels || ["standard"],
        numberOfQuestions: reqData.numberOfQuestions || 10,
        diagramSupport: reqData.diagramSupport || false
      };
      
      // Check if user has reached their quiz limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const activeQuizzes = await storage.getActiveQuizzesByUser(user.id);
      
      // Apply limits based on subscription tier - more generous limits for testing
      let quizLimit = 10; // Default high limit for testing
      if (user.subscriptionTier === "free") {
        // 5 quizzes per subject for free tier (for testing)
        quizLimit = 5;
      } else if (user.subscriptionTier === "standard") {
        // 10 quizzes per subject for standard tier (for testing)
        quizLimit = 10;
      } else if (user.subscriptionTier === "premium") {
        // 20 quizzes per subject for premium tier (for testing)
        quizLimit = 20;
      }
      
      // Filter quizzes by the actual subject ID to ensure proper isolation
      const userSubjectQuizzes = activeQuizzes.filter(quiz => 
        quiz.subjectId === validatedData.subjectId && quiz.userId === user.id
      );
      
      if (userSubjectQuizzes.length >= quizLimit) {
        return res.status(403).json({ 
          message: "Quiz limit reached for your subscription tier",
          currentTier: user.subscriptionTier,
          limit: quizLimit
        });
      }
      
      // Create a new quiz with topic ID for precise targeting
      const quiz = await storage.createQuiz({
        userId: user.id,
        chapterId: validatedData.chapterId,
        subjectId: validatedData.subjectId,
        topicId: validatedData.topicId, // Using topic ID for better targeting
        title: validatedData.title,
        topic: validatedData.topic,
        questionTypes: validatedData.questionTypes,
        bloomTaxonomy: validatedData.bloomTaxonomy,
        difficultyLevels: validatedData.difficultyLevels,
        numberOfQuestions: validatedData.numberOfQuestions,
        status: "active"
      });
      
      // Check if similar quiz questions already exist for this topic
      console.log(`Checking for existing quiz questions for topic: ${selectedTopic.name}`);
      
      const existingQuiz = await storage.findSimilarQuiz({
        subjectId: validatedData.subjectId,
        topicId: validatedData.topicId,
        grade: user.grade || 10,
        board: user.board || "CBSE",
        questionTypes: validatedData.questionTypes,
        difficultyLevels: validatedData.difficultyLevels,
        numberOfQuestions: validatedData.numberOfQuestions
      });

      let batchQuestions;
      
      if (existingQuiz && existingQuiz.quizSets.length === 8) {
        console.log(`Found existing quiz questions for topic: ${selectedTopic.name}, reusing questions`);
        
        // Reuse existing questions but create new quiz instance for this user
        batchQuestions = {
          questions: existingQuiz.quizSets.flatMap((set: any) => 
            set.questions.map((q: any) => ({
              ...q,
              setNumber: set.setNumber
            }))
          )
        };
      } else {
        console.log(`Generating new quiz questions for user ${user.id}, subject: ${selectedSubject.name}, topic: ${selectedTopic.name}`);
        
        batchQuestions = await generateBatchQuizQuestions(
          selectedSubject.name,
          selectedChapter.name,
          selectedTopic.name,
          user.grade || 10,
          user.board || "CBSE",
          validatedData.questionTypes,
          validatedData.bloomTaxonomy,
          validatedData.difficultyLevels,
          validatedData.numberOfQuestions,
          validatedData.diagramSupport
        );
      }

      // Group questions by set number and create quiz sets
      const quizSets = [];
      const questionsBySet: Record<number, any[]> = {};
      
      // Initialize sets 1-8
      for (let i = 1; i <= 8; i++) {
        questionsBySet[i] = [];
      }
      
      // Distribute questions across sets
      batchQuestions.questions.forEach((question: any) => {
        const setNum = question.setNumber || 1;
        if (questionsBySet[setNum]) {
          questionsBySet[setNum].push(question);
        }
      });
      
      // Create quiz sets and process diagrams
      for (let setNumber = 1; setNumber <= 8; setNumber++) {
        const setQuestions = questionsBySet[setNumber] || [];
        
        // Process questions and render diagrams if they exist
        const processedQuestions = await Promise.all(
          setQuestions.map(async (question: any, index: number) => {
            // Check if question has diagram instruction
            if (question.diagram_instruction) {
              try {
                const diagramUrl = await renderDiagram({
                  instruction: question.diagram_instruction,
                  subject: selectedSubject.name,
                  questionId: `${quiz.id}_${setNumber}_${index}`
                });
                
                return {
                  ...question,
                  diagramUrl: diagramUrl
                };
              } catch (error) {
                console.error('Error rendering diagram:', error);
                return question;
              }
            }
            return question;
          })
        );
        
        const quizSet = await storage.createQuizSet({
          quizId: quiz.id,
          setNumber: setNumber,
          questions: processedQuestions
        });
        
        quizSets.push(quizSet);
      }
      
      // Create spaced repetition schedule for all 8 sets
      const schedules = [];
      const spacedDates = calculateSpacedRepetitionDates(new Date());
      
      for (let i = 0; i < quizSets.length; i++) {
        console.log(`Scheduling quiz set ${i + 1}/8 for user ${user.id} on ${spacedDates[i].toDateString()}`);
        
        const schedule = await storage.createQuizSchedule({
          quizId: quiz.id,
          userId: user.id,
          quizSetId: quizSets[i].id,
          scheduledDate: spacedDates[i],
          status: "pending"
        });
        
        schedules.push(schedule);
      }
      
      console.log(`Successfully created quiz for user ${user.id} with ${quizSets.length} sets and ${schedules.length} schedules`);
      
      res.status(201).json({
        quiz,
        quizSets,
        schedules,
        message: `Created quiz with ${quizSets.length} sets for spaced repetition`
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create quiz" });
      }
    }
  });

  app.get("/api/quizzes", isAuthenticated, async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByUser(req.session.userId!);
      const schedules = await storage.getQuizSchedulesByUser(req.session.userId!);
      
      // Create a map of quizIds that have at least one completed schedule
      const completedQuizIds = new Set();
      schedules.forEach(schedule => {
        if (schedule.status === "completed") {
          completedQuizIds.add(schedule.quizId);
        }
      });
      
      // Update the quiz status based on the completed schedules
      const enrichedQuizzes = quizzes.map(quiz => {
        if (completedQuizIds.has(quiz.id)) {
          return { ...quiz, status: "completed" };
        }
        return quiz;
      });
      
      res.json(enrichedQuizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get quizzes" });
    }
  });

  app.get("/api/quizzes/performance", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { subjectId, startDate, endDate } = req.query;
      
      let subjectIdNumber: number | undefined;
      let startDateObj: Date | undefined;
      let endDateObj: Date | undefined;
      
      if (subjectId && typeof subjectId === 'string' && subjectId !== 'all') {
        const parsed = parseInt(subjectId);
        if (!isNaN(parsed)) {
          subjectIdNumber = parsed;
        }
      }
      
      if (startDate && typeof startDate === 'string') {
        startDateObj = new Date(startDate);
      }
      
      if (endDate && typeof endDate === 'string') {
        endDateObj = new Date(endDate);
      }
      
      const performanceData = await storage.getQuizPerformance(
        userId, 
        subjectIdNumber, 
        startDateObj, 
        endDateObj
      );
      
      res.json(performanceData);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      res.status(500).json({ message: "Failed to get performance data" });
    }
  });

  // Get subjects that user has taken tests for
  app.get("/api/quizzes/performance/subjects", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const subjectsWithTests = await storage.getSubjectsWithPerformanceData(userId);
      res.json(subjectsWithTests);
    } catch (error) {
      console.error("Error fetching subjects with performance data:", error);
      res.status(500).json({ message: "Failed to get subjects with test data" });
    }
  });

  app.post("/api/quizzes/complete/:quizId/:quizSetId", isAuthenticated, async (req, res) => {
    try {
      const { quizId, quizSetId } = req.params;
      const { score, answers } = req.body;
      const userId = req.session.userId!;
      
      // Find the quiz schedule
      const schedules = await storage.getQuizSchedulesByQuizAndSet(
        parseInt(quizId), 
        parseInt(quizSetId), 
        userId
      );
      
      if (!schedules || schedules.length === 0) {
        return res.status(404).json({ message: "Quiz schedule not found" });
      }
      
      // Update the quiz schedule as completed
      const updatedSchedule = await storage.updateQuizSchedule(schedules[0].id, {
        status: "completed",
        completedDate: new Date(),
        score: score,
        userAnswers: answers
      });

      // ✅ NEW: If all sets of this quiz are completed, mark quiz as completed
      const allSchedules = await storage.getQuizSchedulesByQuiz(userId, parseInt(quizId));
      const allCompleted = allSchedules.every(s => s.status === "completed");

      if (allCompleted) {
        await storage.updateQuizStatus(parseInt(quizId), "completed");
      }

      res.json({
        success: true,
        schedule: updatedSchedule
      });
    } catch (error) {
      console.error("Error completing quiz:", error);
      res.status(500).json({ message: "Failed to complete quiz" });
    }
  });
  
  // Get adaptive questions for spaced repetition based on performance
  app.get("/api/quiz-schedule/:scheduleId/adaptive-questions", isAuthenticated, async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      const userId = req.session.userId!;
      
      // Get the schedule and quiz information
      const schedules = await storage.getQuizSchedulesByUser(userId);
      const schedule = schedules.find(s => s.id === scheduleId);
      
      if (!schedule) {
        return res.status(404).json({ message: "Quiz schedule not found" });
      }
      
      // Get quiz set with all questions
      const quizSet = await storage.getQuizSet(schedule.quizSetId);
      if (!quizSet) {
        return res.status(404).json({ message: "Quiz set not found" });
      }
      
      // Get user's performance history for this quiz
      const userSchedules = await storage.getQuizSchedulesByUser(userId);
      const quizHistory = userSchedules.filter(s => 
        s.quizId === schedule.quizId && 
        s.status === "completed" && 
        s.score !== null
      );
      
      let selectedQuestions = [];
      const allQuestions = quizSet.questions || [];
      
      if (quizHistory.length === 0) {
        // First attempt - use foundational questions
        selectedQuestions = allQuestions
          .filter(q => q.difficultyLevel === "Basic" || q.difficultyLevel === "Moderate")
          .slice(0, 15);
      } else {
        // Calculate average performance
        const averageScore = quizHistory.reduce((sum, h) => sum + (h.score || 0), 0) / quizHistory.length;
        
        if (averageScore >= 90) {
          // High performance - challenge with hardest questions
          selectedQuestions = allQuestions
            .filter(q => q.difficultyLevel === "Challenging" || q.difficultyLevel === "Advanced")
            .slice(0, 15);
        } else if (averageScore >= 70) {
          // Good performance - focus on mistakes and moderate challenges
          const mistakeQuestions = [];
          quizHistory.forEach(history => {
            if (history.userAnswers) {
              Object.keys(history.userAnswers).forEach(questionId => {
                const userAnswer = history.userAnswers[questionId];
                const question = allQuestions.find(q => q.id.toString() === questionId);
                if (question && userAnswer !== question.correctAnswer) {
                  mistakeQuestions.push(question);
                }
              });
            }
          });
          
          selectedQuestions = mistakeQuestions.slice(0, 10);
          
          // Fill remaining with moderate questions
          if (selectedQuestions.length < 15) {
            const moderateQuestions = allQuestions
              .filter(q => q.difficultyLevel === "Moderate" && !selectedQuestions.includes(q))
              .slice(0, 15 - selectedQuestions.length);
            selectedQuestions = [...selectedQuestions, ...moderateQuestions];
          }
        } else {
          // Low performance - focus on foundational concepts
          selectedQuestions = allQuestions
            .filter(q => q.difficultyLevel === "Basic" || q.difficultyLevel === "Moderate")
            .slice(0, 15);
        }
      }
      
      // Ensure minimum 15 questions
      if (selectedQuestions.length < 15) {
        const remainingQuestions = allQuestions
          .filter(q => !selectedQuestions.includes(q))
          .slice(0, 15 - selectedQuestions.length);
        selectedQuestions = [...selectedQuestions, ...remainingQuestions];
      }
      
      res.json({
        schedule,
        questions: selectedQuestions.slice(0, 15),
        adaptiveInfo: {
          averageScore: quizHistory.length > 0 ? 
            quizHistory.reduce((sum, h) => sum + (h.score || 0), 0) / quizHistory.length : 0,
          totalAttempts: quizHistory.length,
          selectionReason: quizHistory.length === 0 ? "first_attempt" : 
            quizHistory.reduce((sum, h) => sum + (h.score || 0), 0) / quizHistory.length >= 90 ? "high_performance" :
            quizHistory.reduce((sum, h) => sum + (h.score || 0), 0) / quizHistory.length >= 70 ? "mistake_focused" : "foundational"
        }
      });
    } catch (error) {
      console.error("Error getting adaptive questions:", error);
      res.status(500).json({ message: "Failed to get adaptive questions" });
    }
  });

  // Get individual quiz schedule with questions
  app.get("/api/quiz-schedule/:scheduleId", isAuthenticated, async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      const userId = req.session.userId!;
      
      // First get the schedule
      const schedules = await storage.getQuizSchedulesByUser(userId);
      const schedule = schedules.find(s => s.id === scheduleId);
      
      if (!schedule) {
        return res.status(404).json({ message: "Quiz schedule not found" });
      }
      
      // Get quiz details
      const quiz = await storage.getQuizById(schedule.quizId);
      const quizSet = await storage.getQuizSetById(schedule.quizSetId);
      
      if (!quiz || !quizSet) {
        return res.status(404).json({ message: "Quiz or quiz set not found" });
      }
      
      // Debug: Log the quiz set to see what's in it
      console.log("Quiz set data:", JSON.stringify(quizSet, null, 2));
      
      res.json({
        id: schedule.id,
        quizId: schedule.quizId,
        quizSetId: schedule.quizSetId,
        quiz: {
          id: quiz.id,
          title: quiz.title,
          subjectId: quiz.subjectId,
          chapterId: quiz.chapterId
        },
        quizSet: {
          id: quizSet.id,
          setNumber: quizSet.setNumber,
          questions: quizSet.questions
        }
      });
    } catch (error) {
      console.error("Error fetching quiz schedule:", error);
      res.status(500).json({ message: "Failed to fetch quiz schedule" });
    }
  });

  app.get("/api/quizzes/today", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      const todayQuizzes = await db
        .select({
          id: quizSchedules.id,
          quizId: quizSchedules.quizId,
          quizSetId: quizSchedules.quizSetId,
          scheduledDate: quizSchedules.scheduledDate,
          status: quizSchedules.status,
          title: quizzes.title,
          topic: quizzes.topic,
          setNumber: quizSets.setNumber
        })
        .from(quizSchedules)
        .innerJoin(quizzes, eq(quizSchedules.quizId, quizzes.id))
        .innerJoin(quizSets, eq(quizSchedules.quizSetId, quizSets.id))
        .where(
          and(
            eq(quizSchedules.userId, userId),
            eq(quizSchedules.status, "pending"),
            sql`DATE(${quizSchedules.scheduledDate}) = CURRENT_DATE`
          )
        );

      // Transform to match expected frontend format
      const formattedQuizzes = todayQuizzes.map(quiz => ({
        id: quiz.id,
        quizId: quiz.quizId,
        quizSetId: quiz.quizSetId,
        scheduledDate: quiz.scheduledDate,
        status: quiz.status,
        quiz: {
          title: quiz.title,
          topic: quiz.topic
        },
        quizSet: {
          setNumber: quiz.setNumber
        }
      }));
      
      console.log("Today's quizzes found:", formattedQuizzes.length, formattedQuizzes);
      res.json(formattedQuizzes);
    } catch (error) {
      console.error("Error getting today's quizzes:", error);
      res.status(500).json({ message: "Failed to get today's quizzes" });
    }
  });

  // Get completed quizzes for results viewing
  app.get("/api/quizzes/completed", isAuthenticated, async (req, res) => {
    try {
      const schedules = await storage.getQuizSchedulesByUser(req.session.userId!);
      const completedSchedules = schedules.filter(s => s.status === "completed");
      
      // Get quiz and quiz set details for completed quizzes
      const enrichedSchedules = await Promise.all(
        completedSchedules
          .filter(schedule => schedule.quizId && schedule.quizSetId) // Filter out invalid IDs
          .map(async (schedule) => {
            try {
              const quiz = await storage.getQuizById(schedule.quizId);
              const quizSet = await storage.getQuizSetById(schedule.quizSetId);
              
              return {
                ...schedule,
                quiz,
                quizSet
              };
            } catch (error) {
              console.error("Error fetching quiz details:", error);
              return null;
            }
          })
      );
      
      // Filter out any null results
      const validSchedules = enrichedSchedules.filter(Boolean);
      
      res.json(validSchedules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get completed quizzes" });
    }
  });

  // Get quiz results
  app.get("/api/quiz-results/:scheduleId", isAuthenticated, async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      
      // Get the completed quiz schedule
      const schedules = await storage.getQuizSchedulesByUser(req.session.userId!);
      const schedule = schedules.find(s => s.id === scheduleId && s.status === "completed");
      
      if (!schedule) {
        return res.status(404).json({ message: "Quiz results not found" });
      }
      
      // Get quiz and quiz set details
      const quiz = await storage.getQuizById(schedule.quizId);
      const quizSet = await storage.getQuizSetById(schedule.quizSetId);
      
      res.json({
        schedule: {
          ...schedule,
          quiz,
          quizSet
        },
        userAnswers: schedule.userAnswers || {}
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get quiz results" });
    }
  });
  
  // User update endpoint
  app.patch("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Verify that the user is updating their own profile
      if (userId !== req.session.userId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      
      // Get the data to update
      const updateData = req.body;
      console.log("Updating user with data:", updateData);
      
      // Update the user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return the updated user without the password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.get("/api/quizzes/upcoming", isAuthenticated, async (req, res) => {
    try {
      const schedules = await storage.getUpcomingQuizSchedules(req.session.userId!);
      
      // Get the quiz and quiz set details
      const enrichedSchedules = await Promise.all(
          schedules.filter(schedule => schedule.status === "pending").map(async (schedule) => {

          const quiz = await storage.getQuizById(schedule.quizId);
          const quizSet = await storage.getQuizSetById(schedule.quizSetId);
          
          return {
            ...schedule,
            quiz,
            quizSet
          };
        })
      );
      
      res.json(enrichedSchedules);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get upcoming quizzes" });
    }
  });

  app.get("/api/quizzes/:quizId", isAuthenticated, async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const quiz = await storage.getQuizById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      if (quiz.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized access to quiz" });
      }
      
      const quizSets = await storage.getQuizSetsByQuiz(quizId);
      
      res.json({
        quiz,
        quizSets
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get quiz" });
    }
  });

  app.post("/api/quizzes/:scheduleId/complete", isAuthenticated, async (req, res) => {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      const { score } = req.body;
      
      if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ message: "Invalid score" });
      }
      
      const updatedSchedule = await storage.updateQuizSchedule(scheduleId, {
        completedDate: new Date(),
        score,
        status: "completed"
      });
      
      if (!updatedSchedule) {
        return res.status(404).json({ message: "Quiz schedule not found" });
      }
      
      res.json(updatedSchedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to complete quiz" });
    }
  });

  // Doubt query routes
  app.post("/api/doubt-queries", isAuthenticated, async (req, res) => {
    try {
      // Validate the input using our schema
      const validatedData = insertDoubtQuerySchema.parse(req.body);
      
      // Get the user to check subscription tier
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has reached their doubt query limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const doubtQueries = await storage.getDoubtQueriesByUser(user.id);
      const todayQueries = doubtQueries.filter(query => 
        query.createdAt && query.createdAt >= today && query.createdAt < tomorrow
      );
      
      // Apply limits based on subscription tier
      let queryLimit = 0;
      if (user.subscriptionTier === "free") {
        // 2 daily doubt queries
        queryLimit = 2;
      } else if (user.subscriptionTier === "standard" || user.subscriptionTier === "premium") {
        // Unlimited doubt queries
        queryLimit = Infinity;
      }
      
      if (todayQueries.length >= queryLimit) {
        return res.status(403).json({ 
          message: "Doubt query limit reached for your subscription tier",
          currentTier: user.subscriptionTier,
          limit: queryLimit
        });
      }
      
      // Find an appropriate subject ID based on subject name
      let subjectId = 1; // Default to first subject
      
      try {
        const subjects = await storage.getAllSubjects();
        const matchingSubject = subjects.find(s => 
          s.name.toLowerCase() === validatedData.subject.toLowerCase()
        );
        
        if (matchingSubject) {
          subjectId = matchingSubject.id;
        }
      } catch (err) {
        console.error("Error finding matching subject:", err);
      }
      
      // Create the doubt query with all information
      const doubt = await storage.createDoubtQuery({
        userId: user.id,
        subjectId: subjectId,
        question: validatedData.question,
        board: validatedData.board,
        class: validatedData.class,
        subjectName: validatedData.subject, // Using the subject field from form
        fileUrl: validatedData.fileUrl,
        fileType: validatedData.fileType
      });
      
      // Build question text with context information
      let questionText = `[Board: ${validatedData.board}] [Class: ${validatedData.class}] [Subject: ${validatedData.subject}]\n\n${validatedData.question}`;
      
      if (validatedData.fileUrl) {
        questionText += `\n\nThe student has also uploaded a ${validatedData.fileType} file for reference. Please analyze the content carefully.`;
      }
      
      const answer = await answerDoubtQuery(
        questionText,
        validatedData.subject,
        parseInt(validatedData.class) || 10,
        validatedData.board || "CBSE"
      );
      
      // Update the doubt query with the answer
      const answeredDoubt = await storage.answerDoubtQuery(doubt.id, answer);
      
      res.status(201).json(answeredDoubt);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error:", JSON.stringify(error.errors, null, 2));
        console.error("Request body:", JSON.stringify(req.body, null, 2));
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating doubt query:", error);
        res.status(500).json({ message: "Failed to create doubt query" });
      }
    }
  });

  app.get("/api/doubt-queries", isAuthenticated, async (req, res) => {
    try {
      const doubtQueries = await storage.getDoubtQueriesByUser(req.session.userId!);
      res.json(doubtQueries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get doubt queries" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const feedbackData = {
        ...req.body,
        userId: req.session.userId!,
        userName: user.username,
        userEmail: user.email,
        status: "pending"
      };

      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  app.get("/api/feedback", isAuthenticated, async (req, res) => {
    try {
      const feedback = await storage.getFeedbackByUser(req.session.userId!);
      res.json(feedback);
    } catch (error) {
      console.error("Error getting feedback:", error);
      res.status(500).json({ message: "Failed to get feedback" });
    }
  });

  // Post-quiz feedback endpoints
  app.post("/api/quiz-feedback", isAuthenticated, async (req, res) => {
    try {
      const { quizId, rating, comments } = req.body;
      const userId = req.session.userId!;

      // For now, store as general feedback until database schema is updated
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const feedbackData = {
        userId,
        username: user.username,
        userEmail: user.email,
        type: "quiz_feedback",
        feedbackText: `Quiz Rating: ${rating}/5${comments ? `\nComments: ${comments}` : ''}\nQuiz ID: ${quizId}`,
        rating,
        status: "pending"
      };

      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating quiz feedback:", error);
      res.status(500).json({ message: "Failed to submit quiz feedback" });
    }
  });

  app.get("/api/quiz-feedback/:quizId", isAuthenticated, async (req, res) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = req.session.userId!;

      // Check if feedback exists for this quiz and user
      const userFeedback = await storage.getFeedbackByUser(userId);
      const existingFeedback = userFeedback.find(f => 
        f.type === "quiz_feedback" && f.feedbackText?.includes(`Quiz ID: ${quizId}`)
      );

      res.json(existingFeedback || null);
    } catch (error) {
      console.error("Error getting quiz feedback:", error);
      res.status(500).json({ message: "Failed to get quiz feedback" });
    }
  });

  // Admin feedback routes
  app.get("/api/admin/feedback", isAuthenticated, isAdminAuthenticated, async (req, res) => {
    try {
      const allFeedback = await storage.getAllFeedback();
      res.json(allFeedback);
    } catch (error) {
      console.error("Error getting all feedback:", error);
      res.status(500).json({ message: "Failed to get feedback" });
    }
  });

  app.patch("/api/admin/feedback/:id", isAuthenticated, isAdminAuthenticated, async (req, res) => {
    try {
      const feedbackId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Add reviewer info if updating status
      if (updateData.status) {
        updateData.reviewedBy = req.session.userId;
        updateData.reviewedAt = new Date();
      }

      const updatedFeedback = await storage.updateFeedback(feedbackId, updateData);
      res.json(updatedFeedback);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Failed to update feedback" });
    }
  });

  // Subscription routes
  app.post("/api/subscription", isAuthenticated, async (req, res) => {
    try {
      const { tier, subjectIds } = req.body;
      
      if (!tier || !["free", "standard", "premium"].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }
      
      if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        return res.status(400).json({ message: "Please select at least one subject" });
      }
      
      // Calculate total price based on tier and number of subjects
      let pricePerSubject = 0;
      if (tier === "standard") {
        pricePerSubject = 999;
      } else if (tier === "premium") {
        pricePerSubject = 1999;
      }
      
      const totalPrice = pricePerSubject * subjectIds.length;
      
      const updatedUser = await storage.updateSubscription(req.session.userId!, tier, subjectIds);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password, and include pricing information
      const { password, ...userWithoutPassword } = updatedUser;
      res.json({
        ...userWithoutPassword,
        subscription: {
          tier,
          subjectCount: subjectIds.length,
          pricePerSubject,
          totalPrice
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you would check if the user is an admin
      // Get all users from the database
      const allUsers = await storage.getAllUsers();
      
      // Remove passwords
      const usersWithoutPasswords = allUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.post("/api/admin/subjects", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you would check if the user is an admin
      const subject = await storage.createSubject(req.body);
      res.status(201).json(subject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  app.post("/api/admin/chapters", isAuthenticated, async (req, res) => {
    try {
      // In a real app, you would check if the user is an admin
      const chapter = await storage.createChapter(req.body);
      res.status(201).json(chapter);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create chapter" });
    }
  });

  // Seed curriculum data endpoint
  app.post("/api/seed-curriculum", async (req, res) => {
    try {
      const { seedCurriculumData } = await import("./seedData");
      await seedCurriculumData();
      res.json({ message: "Curriculum data seeded successfully!" });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Failed to seed curriculum data", error: error.message });
    }
  });

  // Admin change password route
  app.post("/api/admin/change-password", isAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req.session as any).userId;
      
      // Get current user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUserPassword(userId, hashedPassword);
      
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Get user details with activity tracking
  app.get("/api/admin/users/:id/details", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user statistics
      const userQuizzes = await storage.getQuizzesByUser(userId);
      const completedQuizzes = userQuizzes.filter(q => q.status === 'completed');
      const averageScore = 0; // Will implement proper calculation later
      
      const userDetails = {
        ...user,
        totalQuizzes: userQuizzes.length,
        completedQuizzes: completedQuizzes.length,
        averageScore,
        totalDoubtQueries: 0, // Would count from doubt_queries table
        feedbackSubmitted: 0, // Would count from feedback table
      };
      
      // Remove password from response
      const { password, ...userWithoutPassword } = userDetails;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user details error:", error);
      res.status(500).json({ message: "Failed to get user details" });
    }
  });

  // Get user details route
  app.get("/api/admin/users/:id/details", isAdminAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user statistics
      const userQuizzes = await storage.getQuizzesByUser(userId);
      const completedQuizzes = userQuizzes.filter(q => q.status === 'completed');
      const averageScore = 0; // Will implement proper calculation later
      
      const userDetails = {
        ...user,
        totalQuizzes: userQuizzes.length,
        completedQuizzes: completedQuizzes.length,
        averageScore,
        totalDoubtQueries: 0, // Will implement later
        feedbackSubmitted: 0 // Will implement later
      };
      
      res.json(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get user activity log
  app.get("/api/admin/users/:id/activity", isAdminAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Mock activity data - in real app would come from activity log table
      const activities = [
        {
          id: 1,
          type: "login",
          description: "User logged in",
          createdAt: new Date(),
        },
        {
          id: 2,
          type: "quiz_created",
          description: "Created quiz: Mathematics - Algebra",
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          id: 3,
          type: "quiz_completed",
          description: "Completed quiz with score 85%",
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
        },
      ];
      
      res.json(activities);
    } catch (error) {
      console.error("Get user activity error:", error);
      res.status(500).json({ message: "Failed to get user activity" });
    }
  });

  // Get user quizzes for admin view
  app.get("/api/admin/users/:id/quizzes", isAdminAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const quizzes = await storage.getQuizzesByUser(userId);
      
      res.json(quizzes);
    } catch (error) {
      console.error("Get user quizzes error:", error);
      res.status(500).json({ message: "Failed to get user quizzes" });
    }
  });

  // Admin login route
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Simple admin check - in production you'd want a proper admin table
      if (email === "admin@quickrevise.com" && password === "admin123") {
        // Create or get admin user
        let adminUser = await storage.getUserByEmail(email);
        if (!adminUser) {
          adminUser = await storage.createUser({
            email,
            password: await bcrypt.hash(password, 10),
            username: "admin",
            firstName: "Admin",
            lastName: "User",
            subscriptionTier: "premium"
          });
        }
        
        // Store admin session
        (req.session as any).userId = adminUser.id;
        (req.session as any).isAdmin = true;
        
        res.json({ 
          message: "Admin login successful",
          user: {
            id: adminUser.id,
            email: adminUser.email,
            username: adminUser.username,
            isAdmin: true
          }
        });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", isAdminAuthenticated, async (req: any, res) => {
    try {
      const totalUsers = await storage.getTotalUsers();
      const activeUsers = await storage.getActiveUsers();
      const totalQuizzes = await storage.getTotalQuizzes();
      const completedQuizzes = await storage.getCompletedQuizzes();
      const totalSubjects = await storage.getTotalSubjects();
      const usersByTier = await storage.getUsersByTier();
      const quizzesThisWeek = await storage.getQuizzesThisWeek();
      const averageScore = await storage.getAverageScore();

      const stats = {
        totalUsers,
        activeUsers,
        totalQuizzes,
        completedQuizzes,
        totalSubjects,
        revenueThisMonth: 0, // TODO: Implement revenue calculation
        usersByTier,
        quizzesThisWeek,
        averageScore
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/recent-activity", isAdminAuthenticated, async (req: any, res) => {
    try {
      const recentActivity = await storage.getRecentActivity();
      res.json(recentActivity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  app.get("/api/admin/users", isAdminAuthenticated, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:id", isAdminAuthenticated, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Don't allow deleting the admin user
      if (userId === 6) {
        return res.status(400).json({ message: "Cannot delete admin user" });
      }

      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.get("/api/admin/subjects", isAdminAuthenticated, async (req: any, res) => {
    try {
      const subjects = await storage.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.get("/api/admin/quizzes", isAdminAuthenticated, async (req: any, res) => {
    try {
      const quizzes = await storage.getAllQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Admin feedback management
  app.get("/api/admin/feedback", isAdminAuthenticated, async (req: any, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.patch("/api/admin/feedback/:id", isAdminAuthenticated, async (req: any, res) => {
    try {
      const feedbackId = parseInt(req.params.id);
      const { adminResponse, status } = req.body;
      
      const updatedFeedback = await storage.updateFeedback(feedbackId, {
        adminResponse,
        status,
        updatedAt: new Date(),
      });
      
      res.json(updatedFeedback);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Failed to update feedback" });
    }
  });

  // Admin doubt queries management
  app.get("/api/admin/doubt-queries", isAdminAuthenticated, async (req: any, res) => {
    try {
      const doubtQueries = await storage.getAllDoubtQueries();
      res.json(doubtQueries);
    } catch (error) {
      console.error("Error fetching doubt queries:", error);
      res.status(500).json({ message: "Failed to fetch doubt queries" });
    }
  });

  // Update doubt query with admin response
  app.patch("/api/admin/doubt-queries/:id", isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { response, status } = req.body;
      
      const updatedDoubt = await storage.updateDoubtQuery(parseInt(id), {
        response,
        status,
        answeredAt: new Date(),
      });
      
      res.json(updatedDoubt);
    } catch (error) {
      console.error("Error updating doubt query:", error);
      res.status(500).json({ message: "Failed to update doubt query" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:id", isAdminAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(parseInt(id));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", isAdminAuthenticated, async (req: any, res) => {
    try {
      const [totalUsers, totalQuizzes, pendingFeedback, pendingDoubts] = await Promise.all([
        storage.getUserCount(),
        storage.getQuizCount(),
        storage.getPendingFeedbackCount(),
        storage.getPendingDoubtQueriesCount(),
      ]);

      res.json({
        totalUsers,
        totalQuizzes,
        pendingFeedback,
        pendingDoubts,
        activeQuizzes: totalQuizzes,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
