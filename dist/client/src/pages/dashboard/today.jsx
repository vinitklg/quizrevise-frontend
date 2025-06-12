import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CheckCircle2, Clock } from "lucide-react";
var TodayQuizzes = function () {
    var _a = useLocation(), navigate = _a[1];
    var user = useAuth().user;
    var _b = useQuery({
        queryKey: ["/api/quizzes/today"],
        retry: 1,
    }), _c = _b.data, todayQuizzes = _c === void 0 ? [] : _c, isLoading = _b.isLoading, isError = _b.isError;
    return (<div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Today's Quizzes</h1>
        
        <div className="mt-6">
          {isLoading ? (<div className="flex justify-center items-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
            </div>) : isError ? (<Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <p>There was an error loading your quizzes. Please try again.</p>
                </div>
              </CardContent>
            </Card>) : todayQuizzes && todayQuizzes.length > 0 ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todayQuizzes.map(function (schedule) { return (<Card key={schedule.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{schedule.quiz.title}</CardTitle>
                    <CardDescription>
                      Quiz Set #{schedule.quizSet.setNumber} - {schedule.quizSet.questions.length} questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <CalendarClock className="mr-2 h-4 w-4"/>
                      <span>Scheduled for {formatDate(schedule.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      {schedule.status === "completed" ? (<div className="flex items-center text-green-600 dark:text-green-400">
                          <CheckCircle2 className="mr-2 h-4 w-4"/>
                          <span>Completed</span>
                        </div>) : (<div className="flex items-center text-amber-600 dark:text-amber-400">
                          <Clock className="mr-2 h-4 w-4"/>
                          <span>Pending</span>
                        </div>)}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {schedule.status === "completed" ? (<Button className="w-full" disabled>
                        Already Completed
                      </Button>) : (<Link href={"/dashboard/take-quiz/".concat(schedule.id)}>
                        <Button className="w-full">
                          Start Quiz
                        </Button>
                      </Link>)}
                  </CardFooter>
                </Card>); })}
            </div>) : (<Card>
              <CardContent className="pt-6 pb-6">
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <CalendarClock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"/>
                  <h3 className="text-lg font-medium mb-2">No quizzes scheduled for today</h3>
                  <p className="mb-4">Create a new quiz to get started with your spaced repetition learning!</p>
                  <Button onClick={function () { return navigate("/dashboard/create-quiz"); }}>
                    Create a New Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>);
};
export default TodayQuizzes;
