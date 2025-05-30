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
import PostQuizFeedback from "@/components/PostQuizFeedback";

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
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

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
      setIsCompleted(true);
      setShowResults(true);
      // Show feedback popup after a short delay
      setTimeout(() => {
        setShowFeedbackPopup(true);
      }, 1000);
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
    
    // Calculate detailed results
    const results = schedule?.quizSet.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      return {
        question: question.question,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || "No explanation available",
        options: question.options || []
      };
    }) || [];
    
    setQuizResults({
      score,
      totalQuestions: schedule?.quizSet.questions.length || 0,
      correctAnswers: results.filter(r => r.isCorrect).length,
      results
    });
    
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
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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

  if (isCompleted && showResults && quizResults) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Results Header */}
            <Card className="mb-6">
              <CardHeader className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quizResults.score}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Final Score</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{quizResults.correctAnswers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{quizResults.totalQuestions - quizResults.correctAnswers}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
                  </div>
                </div>
                <Button onClick={() => setLocation("/dashboard/today")} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Today's Quizzes
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detailed Results</h3>
              {quizResults.results.map((result: any, index: number) => (
                <Card key={index} className={`border-l-4 ${result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        Question {index + 1}
                        {result.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                        ) : (
                          <div className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center ml-2">
                            <span className="text-white text-xs">✕</span>
                          </div>
                        )}
                      </CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                         : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="font-medium text-gray-900 dark:text-white">{result.question}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Answer:</p>
                        <p className={`p-2 rounded ${result.isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                                                      : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
                          {result.userAnswer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correct Answer:</p>
                        <p className="p-2 rounded bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          {result.correctAnswer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{result.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = schedule.quizSet.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / schedule.quizSet.questions.length) * 100;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
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
                  {/* Display diagram if available */}
                  {currentQuestion.diagramUrl && (
                    <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Mathematical Diagram</h4>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
                        <div className="flex justify-center">
                          <img 
                            src={currentQuestion.diagramUrl} 
                            alt="Mathematical diagram for the question" 
                            className="max-w-full h-auto rounded-lg"
                            style={{ maxHeight: '450px', minHeight: '200px' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                      
                      {currentQuestion.diagram_instruction && (
                        <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Diagram Description:</p>
                          <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                            {currentQuestion.diagram_instruction}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* MCQ Questions - Show for any question that has options */}
                  {currentQuestion.options && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {(() => {
                        // Handle both array and object formats for options
                        const options = Array.isArray(currentQuestion.options) 
                          ? currentQuestion.options 
                          : Object.entries(currentQuestion.options).map(([key, value]) => `${key}. ${value}`);
                        
                        return options.map((option, index) => {
                          // Extract option letter and text
                          const optionText = typeof option === 'string' ? option : `${String.fromCharCode(65 + index)}. ${option}`;
                          const optionLetter = optionText.charAt(0);
                          
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={optionLetter} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                                {optionText}
                              </Label>
                            </div>
                          );
                        });
                      })()}
                    </RadioGroup>
                  )}

                  {/* Fill in the Blanks */}
                  {currentQuestion.questionType === "fill-in-blanks" && (
                    <div className="space-y-3">
                      <Input
                        placeholder="Type your answer here..."
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="text-lg p-4"
                      />
                    </div>
                  )}

                  {/* Assertion and Reasoning */}
                  {currentQuestion.questionType === "assertion-reasoning" && (
                    <RadioGroup
                      value={answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="A" id="assertion-a" />
                        <Label htmlFor="assertion-a" className="cursor-pointer">
                          A. Both Assertion and Reason are correct and Reason is the correct explanation for Assertion.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="B" id="assertion-b" />
                        <Label htmlFor="assertion-b" className="cursor-pointer">
                          B. Both Assertion and Reason are correct but Reason is not the correct explanation for Assertion.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="C" id="assertion-c" />
                        <Label htmlFor="assertion-c" className="cursor-pointer">
                          C. Assertion is correct but Reason is incorrect.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="D" id="assertion-d" />
                        <Label htmlFor="assertion-d" className="cursor-pointer">
                          D. Assertion is incorrect but Reason is correct.
                        </Label>
                      </div>
                    </RadioGroup>
                  )}

                  {/* True/False Questions */}
                  {currentQuestion.questionType === "true-false" && (
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
      
      {/* Post-Quiz Feedback Popup */}
      {showFeedbackPopup && schedule && (
        <PostQuizFeedback
          quizId={schedule.quizId}
          onClose={() => setShowFeedbackPopup(false)}
          onSubmit={() => {
            setShowFeedbackPopup(false);
            setLocation("/dashboard/today");
          }}
        />
      )}
    </div>
  );
}