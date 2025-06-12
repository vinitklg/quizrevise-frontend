import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, calculateProgress } from "@/lib/utils";
import { Clock, BookOpen, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
var QuizCard = function (_a) {
    var id = _a.id, title = _a.title, subjectName = _a.subjectName, chapterName = _a.chapterName, createdAt = _a.createdAt, completedSets = _a.completedSets, totalSets = _a.totalSets, nextQuizDate = _a.nextQuizDate, status = _a.status;
    var progress = calculateProgress(completedSets, totalSets);
    return (<Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subjectName} • {chapterName}
            </p>
          </div>
          <div className={"px-2 py-1 rounded text-xs font-medium ".concat(status === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400")}>
            {status === "active" ? "Active" : "Completed"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1"/>
            <span>Created on {formatDate(createdAt)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {completedSets}/{totalSets} sets
              </span>
            </div>
            <Progress value={progress} className="h-2"/>
          </div>
          
          {nextQuizDate && (<div className="flex items-center text-sm font-medium text-primary">
              <BookOpen className="h-4 w-4 mr-1"/>
              <span>Next quiz: {formatDate(nextQuizDate)}</span>
            </div>)}
        </div>
      </CardContent>
      <CardFooter>
        {status === "active" ? (<Link href={"/dashboard/take-quiz/".concat(id)} className="w-full">
            <Button className="w-full">
              Continue Quiz
            </Button>
          </Link>) : (<Button variant="outline" className="w-full" disabled>
            <CheckCircle className="h-4 w-4 mr-2"/>
            Completed
          </Button>)}
      </CardFooter>
    </Card>);
};
export default QuizCard;
