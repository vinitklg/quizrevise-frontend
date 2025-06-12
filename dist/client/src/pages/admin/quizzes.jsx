import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/admin/AdminSidebar";
export default function AdminQuizzes() {
    var _a = useQuery({
        queryKey: ["/api/admin/quizzes"],
    }), quizzes = _a.data, isLoading = _a.isLoading;
    if (isLoading) {
        return (<div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
        </div>
      </div>);
    }
    return (<div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
            <p className="text-gray-600 dark:text-gray-400">All generated quizzes on the platform</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Quizzes ({(quizzes === null || quizzes === void 0 ? void 0 : quizzes.length) || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Board/Grade</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(quizzes === null || quizzes === void 0 ? void 0 : quizzes.map(function (quiz) { return (<TableRow key={quiz.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quiz.title}</div>
                          <div className="text-sm text-gray-500">{quiz.chapter} - {quiz.topic}</div>
                        </div>
                      </TableCell>
                      <TableCell>{quiz.subject}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{quiz.board}</div>
                          <div className="text-gray-500">Grade {quiz.grade}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={quiz.difficulty === 'most challenging' ? 'destructive' :
                quiz.difficulty === 'challenging' ? 'default' :
                    quiz.difficulty === 'standard' ? 'secondary' : 'outline'}>
                          {quiz.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quiz.username}</div>
                          <div className="text-sm text-gray-500">{quiz.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>); })) || (<TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No quizzes found
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
