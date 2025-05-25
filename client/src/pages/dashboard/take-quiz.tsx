import { useState, useEffect } from "react";
import { useParams, useLocation, useRoute } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizSet {
  id: number;
  quizId: number;
  setNumber: number;
  questions: Question[];
}

interface Quiz {
  id: number;
  title: string;
  subjectId: number;
  chapterId: number;
  quizSets: QuizSet[];
}

const TakeQuiz = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [match, params2] = useRoute<{ scheduleId: string }>("/dashboard/take-quiz/:id?scheduleId=:scheduleId");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const quizId = parseInt(params.id);
  const scheduleId = match ? parseInt(params2.scheduleId) : undefined;
  
  // Fetch quiz data
  const { data: quizData, isLoading, error } = useQuery<{ quiz: Quiz, quizSets: QuizSet[] }>({
    queryKey: [`/api/quizzes/${quizId}`],
  });
  
  const quiz = quizData?.quiz;
  const quizSet = quizData?.quizSets && quizData.quizSets.length > 0 
    ? quizData.quizSets[0] // For simplicity, we're using the first quiz set. In a real app, you'd select the proper set based on the schedule.
    : null;
  
  const questions = quizSet?.questions || [];
  
  useEffect(() => {
    // Initialize selected answers array with empty values
    if (questions.length > 0 && selectedAnswers.length === 0) {
      setSelectedAnswers(Array(questions.length).fill(""));
    }
  }, [questions, selectedAnswers]);

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    if (!quiz || !quizSet) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate score (percentage of correct answers)
      const correctCount = selectedAnswers.reduce((count, answer, index) => {
        const question = questions[index];
        return answer === question.correctAnswer ? count + 1 : count;
      }, 0);
      
      const score = Math.round((correctCount / questions.length) * 100);
      
      // Submit the quiz completion
      if (scheduleId) {
        await apiRequest("POST", `/api/quizzes/${scheduleId}/complete`, { score });
        
        toast({
          title: "Quiz completed!",
          description: `You scored ${score}%. This will help with your spaced repetition learning.`,
        });
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
        queryClient.invalidateQueries({ queryKey: ["/api/quizzes/today"] });
        
        // Navigate back to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Quiz practice completed",
          description: `You scored ${score}%. This was a practice run.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error submitting quiz",
        description: "There was a problem saving your quiz results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0 md:w-64">
          <Sidebar />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Skeleton className="h-8 w-72 mb-6" />
                <Skeleton className="h-[400px] w-full rounded-lg" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (error || !quiz || !quizSet) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0 md:w-64">
          <Sidebar />
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Error loading quiz
                    </h3>
                  </div>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                    There was a problem loading this quiz. Please try again or return to dashboard.
                  </div>
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate("/dashboard")}
                      variant="outline"
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{quiz.title}</h1>
                <div className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm">
                  Set {quizSet.setNumber}
                </div>
              </div>
              
              {showResults ? (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-center">Quiz Results</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium">Quiz Complete!</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        You've answered all {questions.length} questions.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Your Performance:</h4>
                      {questions.map((question, index) => {
                        const isCorrect = selectedAnswers[index] === question.correctAnswer;
                        return (
                          <div 
                            key={index}
                            className={`p-4 rounded-md ${
                              isCorrect 
                                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900" 
                                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900"
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`mt-0.5 mr-2 h-5 w-5 ${
                                isCorrect 
                                  ? "text-green-500 dark:text-green-400" 
                                  : "text-red-500 dark:text-red-400"
                              }`}>
                                {isCorrect ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                              </div>
                              <div>
                                <p className="font-medium">{question.question}</p>
                                <p className="text-sm mt-1">
                                  Your answer: {selectedAnswers[index] || "Not answered"}
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    Correct answer: {question.correctAnswer}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  {question.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResults(false);
                        setCurrentQuestionIndex(0);
                      }}
                    >
                      Review Questions
                    </Button>
                    <Button 
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Results"}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </div>
                    </div>
                    <Progress value={progress} className="h-2 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-lg font-medium">{currentQuestion.question}</div>
                    
                    <RadioGroup 
                      value={selectedAnswers[currentQuestionIndex]} 
                      onValueChange={handleAnswerChange}
                      className="space-y-3"
                    >
                      {/* Handle options safely in case they're not in the expected format */}
                      {Array.isArray(currentQuestion.options) ? 
                        currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={String.fromCharCode(65 + index)} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1">
                              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Label>
                          </div>
                        )) : 
                        // If options is not an array, create default options
                        ["A", "B", "C", "D"].map((letter, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={letter} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1">
                              <span className="font-medium mr-2">{letter}.</span>
                              Option {letter}
                            </Label>
                          </div>
                        ))
                      }
                    </RadioGroup>
                    
                    {!selectedAnswers[currentQuestionIndex] && (
                      <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        <span>Please select an answer to continue</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswers[currentQuestionIndex]}
                    >
                      {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
                      {currentQuestionIndex !== questions.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TakeQuiz;
