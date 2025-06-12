import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { calculateTimeRemaining } from "@/lib/utils";
import { ChevronRight, Clock, BarChart2 } from "lucide-react";
import { useState } from "react";
var TodayQuizzes = function (_a) {
    var userId = _a.userId;
    var _b = useState(null), selectedQuizResults = _b[0], setSelectedQuizResults = _b[1];
    var _c = useState(false), isResultsModalOpen = _c[0], setIsResultsModalOpen = _c[1];
    var _d = useQuery({
        queryKey: ["/api/quizzes/today"],
    }), todayQuizzes = _d.data, isLoading = _d.isLoading, error = _d.error;
    // Also fetch completed quizzes for results viewing
    var completedQuizzes = useQuery({
        queryKey: ["/api/quizzes/completed"],
    }).data;
    if (isLoading) {
        return (<div className="space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>);
    }
    if (error) {
        return (<div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex">
          <div className="text-red-700 dark:text-red-400">
            Error loading today's quizzes. Please try again later.
          </div>
        </div>
      </div>);
    }
    if (!todayQuizzes || todayQuizzes.length === 0) {
        return (<Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <BarChart2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"/>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No quizzes for today</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
              You've completed all your scheduled quizzes for today or you haven't created any quizzes yet.
            </p>
            <Link href="/dashboard/create-quiz">
              <Button>Create a new quiz</Button>
            </Link>
          </div>
        </CardContent>
      </Card>);
    }
    return (<div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Quizzes</h2>
      
      <div className="grid gap-4">
        {todayQuizzes.map(function (schedule) { return (<Card key={schedule.id}>
            <CardHeader className="pb-2">
              <CardTitle>{schedule.quiz.title}</CardTitle>
              <CardDescription>
                Set {schedule.quizSet.setNumber} • {schedule.quizSet.questions.length} questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Clock className="h-4 w-4 mr-1"/>
                <span>Scheduled for {new Date(schedule.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="text-sm font-medium">
                {schedule.status === "completed" ? (<span className="text-blue-600 dark:text-blue-400">Completed</span>) : new Date(schedule.scheduledDate) <= new Date() ? (<span className="text-green-600 dark:text-green-400">Ready to take</span>) : (<span className="text-amber-600 dark:text-amber-400">
                    Available in {calculateTimeRemaining(schedule.scheduledDate)}
                  </span>)}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={"/dashboard/take-quiz/".concat(schedule.quizId, "?scheduleId=").concat(schedule.id)} className="w-full">
                <Button className="w-full" disabled={schedule.status === "completed" || new Date(schedule.scheduledDate) > new Date()}>
                  {schedule.status === "completed" ? "Completed" : "Start Quiz"}
                  {schedule.status !== "completed" && <ChevronRight className="h-4 w-4 ml-1"/>}
                </Button>
              </Link>
            </CardFooter>
          </Card>); })}
      </div>
    </div>);
};
export default TodayQuizzes;
