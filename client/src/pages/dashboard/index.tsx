import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
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

  const { data: performanceData, isLoading: isPerformanceLoading } = useQuery<any[]>({
    queryKey: ["/api/quizzes/performance"],
  });

  // Get upcoming quizzes to calculate active quizzes
  const { data: upcomingQuizzes, isLoading: isUpcomingLoading } = useQuery<QuizSchedule[]>({
    queryKey: ["/api/quizzes/upcoming"],
  });

  // Calculate stats
  const totalQuizzes = quizzes?.length || 0;
  
  // Active quizzes = pending quizzes from today + upcoming quizzes
  const todayPendingCount = schedules?.filter(s => s.status === "pending").length || 0;
  const upcomingCount = upcomingQuizzes?.length || 0;
  const activeQuizzes = todayPendingCount + upcomingCount;
  
  const completedQuizzes = quizzes?.filter(q => q.status === "completed").length || 0;
  
  const totalScheduledToday = schedules?.length || 0;
  const completedToday = schedules?.filter(s => s.status === "completed").length || 0;

  console.log('All Schedules:', allSchedules);
  console.log('Performance Data:', performanceData);

  return (
    <div className="pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        
        {isUserLoading || isQuizzesLoading || isSchedulesLoading || isPerformanceLoading || isAllSchedulesLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Quizzes</CardTitle>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalQuizzes}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Across all subjects
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Quizzes</CardTitle>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{activeQuizzes}</div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    In progress
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Completed Quizzes</CardTitle>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">{completedQuizzes}</div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Fully mastered
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950 dark:to-gray-900">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Today's Progress</CardTitle>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {totalScheduledToday ? `${calculateProgress(completedToday, totalScheduledToday)}%` : "0%"}
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {completedToday}/{totalScheduledToday} quizzes completed
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {performanceData && performanceData.length > 0 ? (
                  <PerformanceChart data={performanceData as any} />
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
  );
};

export default Dashboard;
