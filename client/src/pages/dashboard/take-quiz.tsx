import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

interface Question {
  id: string;
  question: string;
  type: "mcq" | "fill-blank" | "true-false";
  options?: string[];
  correctAnswer: string;
}

interface QuizSet {
  id: number;
  setNumber: number;
  questions: Question[];
}

interface QuizSchedule {
  id: number;
  quizId: number;
  quizSetId: number;
  quiz: {
    id: number;
    title: string;
    subjectId: number;
    chapterId: number;
  };
  quizSet: QuizSet;
}

export default function TakeQuiz() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const scheduleId = parseInt(params.scheduleId || "0");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch quiz schedule and questions
  const { data: schedule, isLoading } = useQuery<QuizSchedule>({
    queryKey: [`/api/quiz-schedule/${scheduleId}`],
    enabled: !!scheduleId,
  });

  // Submit quiz mutation
  const submitQuizMutation = useMutation({
    mutationFn: async ({ score }: { score: number }) => {
      return await apiRequest("POST", `/api/quizzes/${scheduleId}/complete`, { score });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes/today"] });
      toast({
        title: "Quiz Completed!",
        description: "Your answers have been submitted successfully.",
      });
      setIsCompleted(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    if (!schedule?.quizSet.questions) return 0;
    
    let correct = 0;
    schedule.quizSet.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / schedule.quizSet.questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    submitQuizMutation.mutate({ score });
  };

  const handleNextQuestion = () => {
    if (schedule && currentQuestionIndex < schedule.quizSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Not Found</h2>
            <Button onClick={() => setLocation("/dashboard/today")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Today's Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle>Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg">Your Score: <span className="font-bold text-primary">{calculateScore()}%</span></p>
              <Button onClick={() => setLocation("/dashboard/today")} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Today's Quizzes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = schedule.quizSet.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / schedule.quizSet.questions.length) * 100;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {schedule.quiz.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Quiz Set #{schedule.quizSet.setNumber}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-orange-600 dark:text-orange-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {schedule.quizSet.questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Debug: Let's see the question structure */}
                  {console.log("Current Question:", currentQuestion)}
                  
                  {(currentQuestion.questionType === "mcq" || currentQuestion.type === "mcq") && currentQuestion.options && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {(() => {
                        const options = currentQuestion.options;
                        
                        // Handle both array format ["A) ...", "B) ..."] and object format {"A": "...", "B": "..."}
                        if (Array.isArray(options)) {
                          return options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={String.fromCharCode(65 + index)} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ));
                        } else if (typeof options === 'object') {
                          return Object.entries(options).map(([key, value], index) => (
                            <div key={key} className="flex items-center space-x-2">
                              <RadioGroupItem value={key} id={`option-${key}`} />
                              <Label htmlFor={`option-${key}`} className="cursor-pointer">
                                {key}) {value}
                              </Label>
                            </div>
                          ));
                        }
                        return null;
                      })()}
                    </RadioGroup>
                  )}

                  {currentQuestion.questionType === "fill-blank" && (
                    <Input
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                  )}

                  {currentQuestion.type === "true-false" && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="true" />
                        <Label htmlFor="true" className="cursor-pointer">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="false" />
                        <Label htmlFor="false" className="cursor-pointer">False</Label>
                      </div>
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex === schedule.quizSet.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={submitQuizMutation.isPending}
                  >
                    {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}