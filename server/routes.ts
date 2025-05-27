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
      
      // Set initial empty subscribed subjects array and ensure required fields
      const userData = {
        ...validatedData,
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName || null,
        lastName: validatedData.lastName || null,
        phoneNumber: validatedData.phoneNumber || null,
        preferredSubject: validatedData.preferredSubject || null,
        grade: validatedData.grade || null,
        board: validatedData.board || null,
        subscribedSubjects: [],
        subscriptionTier: "free"
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
  
  // Get subjects that the user has subscribed to
  app.get("/api/subjects/subscribed", isAuthenticated, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // For this user, only include subjects they've taken quizzes for
      // Get all quizzes created by the user
      const userQuizzes = await storage.getQuizzesByUser(req.session.userId!);
      
      // Get unique subject IDs from user's quizzes
      const subjectIds = new Set();
      userQuizzes.forEach(quiz => {
        subjectIds.add(quiz.subjectId);
      });
      
      // Convert to array and get subjects
      const subjectObjects = await Promise.all(
        Array.from(subjectIds).map(async (subjectId) => {
          return await storage.getSubjectById(subjectId as number);
        })
      );
      
      // Filter out any undefined subjects
      const validSubjects = subjectObjects.filter(subject => subject !== undefined);
      
      // If no subjects found from quizzes, return a default subject (Mathematics)
      if (validSubjects.length === 0) {
        const mathSubject = await storage.getSubjectById(1); // Assuming Mathematics has ID 1
        if (mathSubject) {
          validSubjects.push(mathSubject);
        }
      }
      
      res.json(validSubjects);
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
        if (!user.subscribedSubjects.includes(reqData.subject)) {
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
        numberOfQuestions: reqData.numberOfQuestions || 10
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
      
      // Generate all 8 sets of questions for spaced repetition with proper isolation
      const quizSets = [];
      for (let setNumber = 1; setNumber <= 8; setNumber++) {
        console.log(`Generating quiz set ${setNumber}/8 for user ${user.id}, subject: ${selectedSubject.name}, topic: ${selectedTopic.name}`);
        
        // Use the specific topic for much better targeted question generation
        const questions = await generateQuizQuestions(
          selectedSubject.name,
          selectedChapter.name,
          selectedTopic.name, // Using the specific topic for precise targeting
          user.grade || 10,
          user.board || "CBSE",
          validatedData.questionTypes,
          validatedData.bloomTaxonomy,
          validatedData.difficultyLevels,
          validatedData.numberOfQuestions,
          setNumber
        );
        
        const quizSet = await storage.createQuizSet({
          quizId: quiz.id,
          setNumber: setNumber,
          questions: questions.questions
        });
        
        quizSets.push(quizSet);
      }
      
      // Schedule quizzes for spaced repetition
      const dates = calculateSpacedRepetitionDates(new Date());
      const schedules = [];
      
      for (let i = 0; i < quizSets.length; i++) {
        console.log(`Scheduling quiz set ${i + 1}/8 for user ${user.id} on ${dates[i]}`);
        
        const schedule = await storage.createQuizSchedule({
          quizId: quiz.id,
          userId: user.id, // Ensure proper user isolation
          quizSetId: quizSets[i].id,
          scheduledDate: dates[i],
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
      const schedules = await storage.getTodayQuizSchedules(req.session.userId!);
      
      // Get the quiz and quiz set details, only for pending quizzes
      const enrichedSchedules = await Promise.all(
        schedules
          .filter(schedule => schedule.status === "pending")  // ✅ Only show pending quizzes
          .map(async (schedule) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
