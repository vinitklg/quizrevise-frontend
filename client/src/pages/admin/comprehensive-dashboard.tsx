import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Settings,
  UserCheck,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Calendar,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Shield,
} from "lucide-react";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  grade: number;
  board: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
  selectedSubjects: string[] | null;
  stream: string | null;
}

interface Feedback {
  id: number;
  userId: number;
  username: string;
  userEmail: string;
  feedbackType: string;
  title: string;
  description: string;
  rating: number;
  status: string;
  adminResponse: string;
  createdAt: string;
}

interface DoubtQuery {
  id: number;
  userId: number;
  question: string;
  subject: string;
  board: string;
  class: string;
  status: string;
  response: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  pendingFeedback: number;
  pendingDoubts: number;
  totalQuizzes: number;
  activeQuizzes: number;
}

export default function ComprehensiveAdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [selectedDoubt, setSelectedDoubt] = useState<DoubtQuery | null>(null);
  const [doubtResponse, setDoubtResponse] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("all");

  // Fetch admin data
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/admin/feedback"],
    enabled: !!user?.isAdmin,
  });

  const { data: doubtQueries = [], isLoading: doubtsLoading } = useQuery<DoubtQuery[]>({
    queryKey: ["/api/admin/doubt-queries"],
    enabled: !!user?.isAdmin,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
  });

  // Mutations
  const respondToFeedback = useMutation({
    mutationFn: async ({ id, response }: { id: number; response: string }) => {
      return apiRequest("PATCH", `/api/admin/feedback/${id}`, {
        adminResponse: response,
        status: "resolved",
      });
    },
    onSuccess: () => {
      toast({
        title: "Response sent",
        description: "Your response has been sent to the user.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feedback"] });
      setSelectedFeedback(null);
      setAdminResponse("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const respondToDoubt = useMutation({
    mutationFn: async ({ id, response }: { id: number; response: string }) => {
      return apiRequest("PATCH", `/api/admin/doubt-queries/${id}`, {
        response: response,
        status: "answered",
      });
    },
    onSuccess: () => {
      toast({
        title: "Response sent",
        description: "Your response has been sent to the student.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/doubt-queries"] });
      setSelectedDoubt(null);
      setDoubtResponse("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Filter feedback based on status
  const filteredFeedback = feedback.filter((fb) => {
    if (feedbackFilter === "all") return true;
    return fb.status === feedbackFilter;
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            QuickRevise Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive management system for students, feedback, and educational content
          </p>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter(u => !u.isAdmin).length} active students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.pendingFeedback || feedback.filter(f => f.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Student Doubts</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.pendingDoubts || doubtQueries.filter(d => d.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Analytics</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalQuizzes || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total quizzes generated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Students</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="doubts">Doubts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{users.length} students registered</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{feedback.length} feedback submissions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">{doubtQueries.length} doubt queries received</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Priority Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {feedback.filter(f => f.status === 'pending').length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="text-sm">Pending feedback reviews</span>
                        <Badge variant="secondary">
                          {feedback.filter(f => f.status === 'pending').length}
                        </Badge>
                      </div>
                    )}
                    {doubtQueries.filter(d => d.status === 'pending').length > 0 && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-sm">Unanswered doubts</span>
                        <Badge variant="secondary">
                          {doubtQueries.filter(d => d.status === 'pending').length}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  Manage student accounts, track progress, and handle registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Board</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.filter(u => !u.isAdmin).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.board}</TableCell>
                        <TableCell>{user.grade}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.selectedSubjects?.length || 0} subjects
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteUser.mutate(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Label htmlFor="feedback-filter">Filter by status:</Label>
                <select
                  id="feedback-filter"
                  value={feedbackFilter}
                  onChange={(e) => setFeedbackFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="reviewed">Reviewed</option>
                </select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Feedback Management</CardTitle>
                <CardDescription>
                  Review and respond to student feedback, bug reports, and suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((fb) => (
                      <TableRow key={fb.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{fb.username}</div>
                            <div className="text-sm text-muted-foreground">{fb.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{fb.feedbackType}</Badge>
                        </TableCell>
                        <TableCell>
                          {fb.rating && (
                            <div className="flex items-center">
                              {"★".repeat(fb.rating)}
                              <span className="ml-1 text-sm text-muted-foreground">
                                {fb.rating}/5
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              fb.status === "resolved"
                                ? "default"
                                : fb.status === "pending"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {fb.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedFeedback(fb)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Feedback Details</DialogTitle>
                                <DialogDescription>
                                  Review and respond to student feedback
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Student</Label>
                                  <p className="text-sm">{fb.username} ({fb.userEmail})</p>
                                </div>
                                <div>
                                  <Label>Feedback</Label>
                                  <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                    {fb.description}
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="admin-response">Admin Response</Label>
                                  <Textarea
                                    id="admin-response"
                                    placeholder="Type your response..."
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                  />
                                </div>
                                <Button
                                  onClick={() => {
                                    if (selectedFeedback && adminResponse.trim()) {
                                      respondToFeedback.mutate({
                                        id: selectedFeedback.id,
                                        response: adminResponse,
                                      });
                                    }
                                  }}
                                  disabled={!adminResponse.trim() || respondToFeedback.isPending}
                                >
                                  Send Response
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doubts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Doubt Queries</CardTitle>
                <CardDescription>
                  Answer student questions and provide educational support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Board/Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doubtQueries.map((doubt) => (
                      <TableRow key={doubt.id}>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{doubt.question}</p>
                        </TableCell>
                        <TableCell>{doubt.subject}</TableCell>
                        <TableCell>{doubt.board} - {doubt.class}</TableCell>
                        <TableCell>
                          <Badge
                            variant={doubt.status === "answered" ? "default" : "secondary"}
                          >
                            {doubt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(doubt.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedDoubt(doubt)}
                              >
                                Answer
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Answer Student Doubt</DialogTitle>
                                <DialogDescription>
                                  Provide a detailed answer to help the student
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Question</Label>
                                  <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                    {doubt.question}
                                  </p>
                                </div>
                                <div>
                                  <Label>Subject: {doubt.subject}</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {doubt.board} - Grade {doubt.class}
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="doubt-response">Your Answer</Label>
                                  <Textarea
                                    id="doubt-response"
                                    placeholder="Provide a detailed answer..."
                                    value={doubtResponse}
                                    onChange={(e) => setDoubtResponse(e.target.value)}
                                    rows={6}
                                  />
                                </div>
                                <Button
                                  onClick={() => {
                                    if (selectedDoubt && doubtResponse.trim()) {
                                      respondToDoubt.mutate({
                                        id: selectedDoubt.id,
                                        response: doubtResponse,
                                      });
                                    }
                                  }}
                                  disabled={!doubtResponse.trim() || respondToDoubt.isPending}
                                >
                                  Send Answer
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quiz Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Performance metrics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">User Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Quiz Generation</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered quiz settings
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Email and system notifications
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}