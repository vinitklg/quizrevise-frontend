import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateQuizQuestions, answerDoubtQuery } from "./openai";
import bcrypt from "bcryptjs";
import session from "express-session";
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
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Helper to calculate spaced repetition dates
const calculateSpacedRepetitionDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  const intervals = [0, 1, 5, 15, 30, 60, 120, 180]; // Days
  
  for (const interval of intervals) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + interval);
    dates.push(date);
  }
  
  return dates;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'quiz-revise-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
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
      
      // Set initial empty subscribed subjects array
      const userData = {
        ...validatedData,
        subscribedSubjects: []
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
      res.status(200).json({ message: "Logged out successfully" });
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
      const validatedData = generateQuizSchema.parse(req.body);
      
      // Get the user to check subscription tier
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has reached their quiz limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const activeQuizzes = await storage.getActiveQuizzesByUser(user.id);
      
      // Apply limits based on subscription tier
      let quizLimit = 0;
      if (user.subscriptionTier === "free") {
        // 1 quiz per subject per week
        quizLimit = 1;
      } else if (user.subscriptionTier === "standard") {
        // 1 quiz per subject per day
        quizLimit = 1;
      } else if (user.subscriptionTier === "premium") {
        // 3 quizzes per subject per day
        quizLimit = 3;
      }
      
      const subjectQuizzes = activeQuizzes.filter(quiz => quiz.subjectId === validatedData.subjectId);
      if (subjectQuizzes.length >= quizLimit) {
        return res.status(403).json({ 
          message: "Quiz limit reached for your subscription tier",
          currentTier: user.subscriptionTier,
          limit: quizLimit
        });
      }
      
      // Create a new quiz with the expanded fields
      const quiz = await storage.createQuiz({
        userId: user.id,
        chapterId: validatedData.chapterId,
        subjectId: validatedData.subjectId,
        title: validatedData.title,
        topic: validatedData.topic,
        questionTypes: validatedData.questionTypes,
        bloomTaxonomy: validatedData.bloomTaxonomy,
        difficultyLevels: validatedData.difficultyLevels,
        numberOfQuestions: validatedData.numberOfQuestions,
        status: "active"
      });
      
      // Get subject and chapter details for OpenAI
      const [subject] = await storage.getSubjectsByBoard(user.board || "CBSE");
      const chapters = await storage.getChaptersBySubject(validatedData.subjectId);
      const chapter = chapters.find(c => c.id === validatedData.chapterId);
      
      if (!subject || !chapter) {
        return res.status(404).json({ message: "Subject or chapter not found" });
      }
      
      // Generate 8 sets of questions with the new parameters
      const quizSets = [];
      for (let i = 1; i <= 8; i++) {
        const questions = await generateQuizQuestions(
          subject.name,
          chapter.name,
          validatedData.topic,
          user.grade || 10,
          user.board || "CBSE",
          validatedData.questionTypes,
          validatedData.bloomTaxonomy,
          validatedData.difficultyLevels,
          validatedData.numberOfQuestions,
          i
        );
        
        const quizSet = await storage.createQuizSet({
          quizId: quiz.id,
          setNumber: i,
          questions: questions.questions
        });
        
        quizSets.push(quizSet);
      }
      
      // Schedule quizzes for spaced repetition
      const dates = calculateSpacedRepetitionDates(new Date());
      const schedules = [];
      
      for (let i = 0; i < quizSets.length; i++) {
        const schedule = await storage.createQuizSchedule({
          quizId: quiz.id,
          userId: user.id,
          quizSetId: quizSets[i].id,
          scheduledDate: dates[i],
          status: "pending"
        });
        
        schedules.push(schedule);
      }
      
      res.status(201).json({
        quiz,
        quizSets,
        schedules
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
      res.json(quizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get quizzes" });
    }
  });

  app.get("/api/quizzes/today", isAuthenticated, async (req, res) => {
    try {
      const schedules = await storage.getTodayQuizSchedules(req.session.userId!);
      
      // Get the quiz and quiz set details
      const enrichedSchedules = await Promise.all(
        schedules.map(async (schedule) => {
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
      res.status(500).json({ message: "Failed to get today's quizzes" });
    }
  });
  
  app.get("/api/quizzes/upcoming", isAuthenticated, async (req, res) => {
    try {
      const schedules = await storage.getUpcomingQuizSchedules(req.session.userId!);
      
      // Get the quiz and quiz set details
      const enrichedSchedules = await Promise.all(
        schedules.map(async (schedule) => {
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
      
      // Create the doubt query with file information if provided
      const doubt = await storage.createDoubtQuery({
        ...validatedData,
        userId: user.id
      });
      
      // Get subject details
      let subjectName = "general";
      if (validatedData.subjectId) {
        const [subject] = await storage.getSubjectsByBoard(user.board || "CBSE");
        if (subject) {
          subjectName = subject.name;
        }
      }
      
      // Generate answer with OpenAI, potentially analyzing file content if a file was uploaded
      let questionText = validatedData.question;
      
      if (validatedData.fileUrl) {
        questionText += `\n\nThe student has also uploaded a ${validatedData.fileType} file for reference. Please analyze the content carefully.`;
      }
      
      const answer = await answerDoubtQuery(
        questionText,
        subjectName,
        user.grade || 10,
        user.board || "CBSE"
      );
      
      // Update the doubt query with the answer
      const answeredDoubt = await storage.answerDoubtQuery(doubt.id, answer);
      
      res.status(201).json(answeredDoubt);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error(error);
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

  const httpServer = createServer(app);
  return httpServer;
}
