import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ArrowLeft, User, BookOpen, FileQuestion, MessageSquare, Search, Calendar, Clock, Star, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

interface UserActivity {
  id: number;
  type: string;
  description: string;
  createdAt: Date;
  metadata?: any;
}

interface UserQuiz {
  id: number;
  title: string;
  subject: string;
  board: string;
  class: number;
  status: string;
  createdAt: Date;
  completedAt?: Date;
  score?: number;
  totalQuestions: number;
}

interface UserDetails {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  board?: string;
  grade?: number;
  stream?: string;
  subscriptionTier: string;
  subscribedSubjects?: string[];
  createdAt: Date;
  lastLoginAt?: Date;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalDoubtQueries: number;
  feedbackSubmitted: number;
}

export default function UserDetailsPage() {
  const [match, params] = useRoute("/admin/users/:id");
  const userId = params?.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [quizFilter, setQuizFilter] = useState("all");

  const { data: userDetails, isLoading: userLoading } = useQuery<UserDetails>({
    queryKey: ["/api/admin/users", userId, "details"],
    enabled: !!userId,
  });

  const { data: userActivity = [], isLoading: activityLoading } = useQuery<UserActivity[]>({
    queryKey: ["/api/admin/users", userId, "activity"],
    enabled: !!userId,
  });

  const { data: userQuizzes = [], isLoading: quizzesLoading } = useQuery<UserQuiz[]>({
    queryKey: ["/api/admin/users", userId, "quizzes"],
    enabled: !!userId,
  });

  if (!match || !userId) {
    return <div>User not found</div>;
  }

  if (userLoading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return <div>User not found</div>;
  }

  const filteredActivity = userActivity.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activityFilter === "all" || activity.type === activityFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredQuizzes = userQuizzes.filter(quiz => {
    const matchesSearch = !searchTerm || 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = quizFilter === "all" || quiz.status === quizFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quiz_created":
      case "quiz_completed":
        return <FileQuestion className="w-4 h-4" />;
      case "doubt_submitted":
        return <MessageSquare className="w-4 h-4" />;
      case "login":
        return <User className="w-4 h-4" />;
      case "subscription_updated":
        return <Star className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center mb-6">
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
            </div>

            {/* User Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{userDetails.firstName} {userDetails.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium">{userDetails.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{userDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{userDetails.phoneNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Board & Class</p>
                      <p className="font-medium">{userDetails.board} - Class {userDetails.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stream</p>
                      <p className="font-medium">{userDetails.stream || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <Badge variant={userDetails.subscriptionTier === "premium" ? "default" : "secondary"}>
                        {userDetails.subscriptionTier}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subscribed Subjects</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userDetails.subscribedSubjects?.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        )) || <span className="text-sm text-muted-foreground">None</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{formatDate(userDetails.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="font-medium">{userDetails.lastLoginAt ? formatDate(userDetails.lastLoginAt) : "Never"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileQuestion className="h-5 w-5 mr-2" />
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Quizzes</span>
                      <span className="font-medium">{userDetails.totalQuizzes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="font-medium">{userDetails.completedQuizzes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Score</span>
                      <span className="font-medium">{userDetails.averageScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Doubt Queries</span>
                      <span className="font-medium">{userDetails.totalDoubtQueries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Feedback Submitted</span>
                      <span className="font-medium">{userDetails.feedbackSubmitted}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Activity */}
            <Tabs defaultValue="quizzes" className="space-y-4">
              <TabsList>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="quizzes">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz History</CardTitle>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search quizzes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <Select value={quizFilter} onValueChange={setQuizFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Quiz Title</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Board/Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Completed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuizzes.map((quiz) => (
                          <TableRow key={quiz.id}>
                            <TableCell className="font-medium">{quiz.title}</TableCell>
                            <TableCell>{quiz.subject}</TableCell>
                            <TableCell>{quiz.board} - Class {quiz.class}</TableCell>
                            <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                            <TableCell>
                              {quiz.score !== undefined ? `${quiz.score}/${quiz.totalQuestions}` : "-"}
                            </TableCell>
                            <TableCell>{formatDate(quiz.createdAt)}</TableCell>
                            <TableCell>
                              {quiz.completedAt ? formatDate(quiz.completedAt) : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredQuizzes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No quizzes found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <Select value={activityFilter} onValueChange={setActivityFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Activities</SelectItem>
                          <SelectItem value="quiz_created">Quiz Created</SelectItem>
                          <SelectItem value="quiz_completed">Quiz Completed</SelectItem>
                          <SelectItem value="doubt_submitted">Doubt Submitted</SelectItem>
                          <SelectItem value="login">Login</SelectItem>
                          <SelectItem value="subscription_updated">Subscription Updated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {filteredActivity.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No activities found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}