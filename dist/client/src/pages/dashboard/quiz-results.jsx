import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowLeft, Clock, BookOpen, Award } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
export default function QuizResults() {
    var scheduleId = useParams().scheduleId;
    var _a = useQuery({
        queryKey: ["/api/quiz-results", scheduleId],
    }), result = _a.data, isLoading = _a.isLoading;
    if (isLoading) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">
            <div className="h-screen flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
            </div>
          </main>
        </div>
      </div>);
    }
    if (!result) {
        return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Results Not Found
                </h2>
                <Link href="/dashboard/today">
                  <Button>Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>);
    }
    var schedule = result.schedule, userAnswers = result.userAnswers;
    var questions = schedule.quizSet.questions;
    var totalQuestions = questions.length;
    var correctAnswers = questions.filter(function (q, index) {
        return userAnswers[index.toString()] === q.correctAnswer;
    }).length;
    var percentage = Math.round((correctAnswers / totalQuestions) * 100);
    var getScoreColor = function (score) {
        if (score >= 80)
            return "text-green-600 dark:text-green-400";
        if (score >= 60)
            return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };
    var getScoreBadge = function (score) {
        if (score >= 80)
            return { text: "Excellent", variant: "default" };
        if (score >= 60)
            return { text: "Good", variant: "secondary" };
        return { text: "Needs Improvement", variant: "destructive" };
    };
    return (<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/dashboard/today">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Dashboard
                </Button>
              </Link>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Quiz Results
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {schedule.quiz.title} - Set #{schedule.quizSet.setNumber}
                  </p>
                </div>
                <Badge {...getScoreBadge(percentage)}>
                  {getScoreBadge(percentage).text}
                </Badge>
              </div>
            </div>

            {/* Score Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500"/>
                  Your Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={"text-4xl font-bold ".concat(getScoreColor(percentage))}>
                      {percentage}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                      {correctAnswers}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Correct Answers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                      {totalQuestions - correctAnswers}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Incorrect Answers</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Progress value={percentage} className="h-3"/>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Question Review
              </h2>
              
              {questions.map(function (question, index) {
            var userAnswer = userAnswers[index.toString()];
            var isCorrect = userAnswer === question.correctAnswer;
            return (<Card key={index} className={"border-l-4 ".concat(isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center text-lg">
                          {isCorrect ? (<CheckCircle className="h-6 w-6 text-green-500 mr-3"/>) : (<XCircle className="h-6 w-6 text-red-500 mr-3"/>)}
                          Question {index + 1}
                        </CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {question.bloomTaxonomy}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.difficultyLevel}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {question.question}
                      </p>
                      
                      <div className="grid gap-2">
                        {question.options.map(function (option, optionIndex) {
                    var optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
                    var isUserChoice = userAnswer === optionLetter;
                    var isCorrectChoice = question.correctAnswer === optionLetter;
                    return (<div key={optionIndex} className={"p-3 rounded-lg border ".concat(isCorrectChoice
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : isUserChoice
                                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700")}>
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                <div className="flex space-x-2">
                                  {isCorrectChoice && (<Badge variant="default" className="text-xs bg-green-600">
                                      Correct
                                    </Badge>)}
                                  {isUserChoice && !isCorrectChoice && (<Badge variant="destructive" className="text-xs">
                                      Your Answer
                                    </Badge>)}
                                </div>
                              </div>
                            </div>);
                })}
                      </div>
                      
                      {question.explanation && (<div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            Explanation:
                          </h4>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            {question.explanation}
                          </p>
                        </div>)}
                    </CardContent>
                  </Card>);
        })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/dashboard/today">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2"/>
                  Back to Quizzes
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  <Clock className="h-4 w-4 mr-2"/>
                  View Performance
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>);
}
