import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Shield,
  Settings,
  BarChart3,
  Database,
  Activity,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Star
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
  selectedSubjects: string[];
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
  status: string;
  response: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalQuizzes: number;
  pendingFeedback: number;
  pendingDoubts: number;
  totalSubjects: number;
  weeklyGrowth: number;
  avgRating: number;
}

export default function ComprehensiveAdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  // Fetch admin data
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const { data: feedback = [] } = useQuery<Feedback[]>({
    queryKey: ["/api/admin/feedback"],
    enabled: !!user?.isAdmin,
  });

  const { data: doubtQueries = [] } = useQuery<DoubtQuery[]>({
    queryKey: ["/api/admin/doubt-queries"],
    enabled: !!user?.isAdmin,
  });

  const { data: stats } = useQuery<AdminStats>({
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

  // Access control
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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "doubts", label: "Doubt Queries", icon: HelpCircle },
    { id: "content", label: "Content Management", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "database", label: "Database", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedback = feedback.filter(f => 
    f.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.feedbackType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            QuickRevise Management
          </p>
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPage(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  selectedPage === item.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {sidebarItems.find(item => item.id === selectedPage)?.label}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and monitor your educational platform
            </p>
          </div>

          {/* Overview Page */}
          {selectedPage === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || users.length}</div>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalQuizzes || 0}</div>
                    <p className="text-xs text-blue-600">Across all subjects</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(stats?.pendingFeedback || 0) + (stats?.pendingDoubts || 0)}
                    </div>
                    <p className="text-xs text-orange-600">Needs attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.avgRating || 4.5}</div>
                    <p className="text-xs text-green-600">Based on user feedback</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">New user registration</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* User Management Page */}
          {selectedPage === "users" && (
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Users Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Education
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                Grade {user.grade} - {user.board}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.selectedSubjects?.length || 0} subjects
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={user.isAdmin ? "destructive" : "secondary"}>
                                {user.isAdmin ? "Admin" : "Student"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback Management Page */}
          {selectedPage === "feedback" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredFeedback.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.username}
                              </div>
                              <div className="text-sm text-gray-500">{item.userEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">{item.feedbackType}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">{item.rating}/5</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                variant={item.status === "pending" ? "destructive" : "secondary"}
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedFeedback(item)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other pages would go here... */}
          {selectedPage === "doubts" && (
            <Card>
              <CardHeader>
                <CardTitle>Doubt Queries Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Doubt queries management interface coming soon...</p>
              </CardContent>
            </Card>
          )}

          {selectedPage === "content" && (
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Subject, chapter, and quiz content management interface...</p>
              </CardContent>
            </Card>
          )}

          {selectedPage === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Comprehensive analytics and reporting interface...</p>
              </CardContent>
            </Card>
          )}

          {selectedPage === "database" && (
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Database monitoring and management tools...</p>
              </CardContent>
            </Card>
          )}

          {selectedPage === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>System configuration and settings management...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Detail Modal would go here */}
    </div>
  );
}