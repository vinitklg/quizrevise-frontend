import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Sidebar from "@/components/dashboard/Sidebar";
import TodayQuizzes from "@/components/dashboard/TodayQuizzes";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateProgress } from "@/lib/utils";
import { PlusCircle, BookOpen, Check, Clock, Award } from "lucide-react";

interface Quiz {
  id: number;
  title: string;
  createdAt: string;
  status: string;
}

interface QuizSchedule {
  id: number;
  quizId: number;
  scheduledDate: string;
  completedDate: string | null;
  score: number | null;
  status: string;
}

const Dashboard = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  
  const { data: quizzes, isLoading: isQuizzesLoading } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });
  
  const { data: schedules, isLoading: isSchedulesLoading } = useQuery<QuizSchedule[]>({
    queryKey: ["/api/quizzes/today"],
  });

  // Calculate stats
  const totalQuizzes = quizzes?.length || 0;
  const activeQuizzes = quizzes?.filter(q => q.status === "active").length || 0;
  const completedQuizzes = quizzes?.filter(q => q.status === "completed").length || 0;
  
  const totalScheduledToday = schedules?.length || 0;
  const completedToday = schedules?.filter(s => s.status === "completed").length || 0;
  
  // Performance data for the chart
  const performanceData = schedules
    ?.filter(s => s.completedDate && s.score !== null)
    .map(s => ({
      date: s.completedDate as string,
      score: s.score as number,
      quizSet: 1 // This would need to be fetched from the actual quiz set
    })) || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0 md:w-64">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900">
          <div className="pt-4 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
              
              {isUserLoading || isQuizzesLoading || isSchedulesLoading ? (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{totalQuizzes}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Across all subjects
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{activeQuizzes}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          In progress
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
                        <Check className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{completedQuizzes}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Fully mastered
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalScheduledToday ? `${calculateProgress(completedToday, totalScheduledToday)}%` : "0%"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {completedToday}/{totalScheduledToday} quizzes completed
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                      {performanceData.length > 0 ? (
                        <PerformanceChart data={performanceData} />
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>Performance Over Time</CardTitle>
                          </CardHeader>
                          <CardContent className="h-80 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-muted-foreground mb-4">
                                Complete quizzes to see your performance chart
                              </p>
                              <Link href="/dashboard/create-quiz">
                                <Button>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Create a quiz
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    <div className="lg:col-span-1">
                      <TodayQuizzes userId={user?.id || 0} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
