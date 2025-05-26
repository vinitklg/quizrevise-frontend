import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";

interface QuizSchedule {
  id: number;
  quizId: number;
  quizSetId: number;
  scheduledDate: string;
  status: string;
  quiz: {
    id: number;
    title: string;
    subjectId: number;
    chapterId: number;
  };
  quizSet: {
    id: number;
    setNumber: number;
    questions: any[];
  };
}

const TodayQuizzes = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: todayQuizzes = [], isLoading, isError } = useQuery<QuizSchedule[]>({
    queryKey: ["/api/quizzes/today"],
    retry: 1,
  });

  const handleStartQuiz = (quizId: number, quizSetId: number) => {
    navigate(`/dashboard/take-quiz/${quizId}?setId=${quizSetId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="pt-2 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Today's Quizzes</h1>
              
              <div className="mt-6">
              {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : isError ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>There was an error loading your quizzes. Please try again.</p>
                  </div>
                </CardContent>
              </Card>
            ) : todayQuizzes && todayQuizzes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {todayQuizzes.map((schedule: QuizSchedule) => (
                  <Card key={schedule.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">{schedule.quiz.title}</CardTitle>
                      <CardDescription>
                        Quiz Set #{schedule.quizSet.setNumber} - {schedule.quizSet.questions.length} questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <CalendarClock className="mr-2 h-4 w-4" />
                        <span>Scheduled for {formatDate(schedule.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {schedule.status === "completed" ? (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 dark:text-amber-400">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        disabled={schedule.status === "completed"}
                        onClick={() => handleStartQuiz(schedule.quiz.id, schedule.quizSet.id)}
                      >
                        {schedule.status === "completed" ? "Already Completed" : "Start Quiz"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6">
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <CalendarClock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quizzes scheduled for today</h3>
                    <p className="mb-4">Create a new quiz to get started with your spaced repetition learning!</p>
                    <Button onClick={() => navigate("/dashboard/create-quiz")}>
                      Create a New Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TodayQuizzes;