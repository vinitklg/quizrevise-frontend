import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Award } from "lucide-react";

interface QuizResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: {
    title: string;
    setNumber: number;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
      questionType: string;
    }>;
  };
  userAnswers: Record<string, string>;
  score: number;
}

export default function QuizResultsModal({ 
  isOpen, 
  onClose, 
  quiz, 
  userAnswers, 
  score 
}: QuizResultsModalProps) {
  const totalQuestions = quiz.questions.length;
  const correctAnswers = quiz.questions.filter((q, index) => 
    userAnswers[index.toString()] === q.correctAnswer
  ).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent", variant: "default" as const };
    if (score >= 60) return { text: "Good", variant: "secondary" as const };
    return { text: "Needs Improvement", variant: "destructive" as const };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quiz Results: {quiz.title} - Set #{quiz.setNumber}</span>
            <Badge {...getScoreBadge(percentage)}>
              {getScoreBadge(percentage).text}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {/* Score Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {correctAnswers}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {totalQuestions - correctAnswers}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
            </div>
          </div>
          <Progress value={percentage} className="h-2 mt-4" />
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Question Review</h3>
          
          {quiz.questions.map((question, index) => {
            const userAnswer = userAnswers[index.toString()];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={index} className={`border rounded-lg p-4 ${
                isCorrect ? "border-green-200 bg-green-50 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:bg-red-900/20"
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium flex items-center">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    Question {index + 1}
                  </h4>
                </div>
                
                <p className="mb-3 font-medium">{question.question}</p>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const optionLetter = String.fromCharCode(65 + optionIndex);
                    const isUserChoice = userAnswer === optionLetter;
                    const isCorrectChoice = question.correctAnswer === optionLetter;
                    
                    return (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded border text-sm ${
                          isCorrectChoice
                            ? "bg-green-100 dark:bg-green-800 border-green-300"
                            : isUserChoice
                            ? "bg-red-100 dark:bg-red-800 border-red-300"
                            : "bg-white dark:bg-gray-700 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option}</span>
                          <div className="flex space-x-1">
                            {isCorrectChoice && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                Correct
                              </Badge>
                            )}
                            {isUserChoice && !isCorrectChoice && (
                              <Badge variant="destructive" className="text-xs">
                                Your Answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}