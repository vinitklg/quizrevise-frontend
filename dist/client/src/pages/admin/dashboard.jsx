import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, FileQuestion, TrendingUp, AlertCircle } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
export default function AdminDashboard() {
    var _a = useQuery({
        queryKey: ["/api/admin/stats"],
    }), stats = _a.data, statsLoading = _a.isLoading;
    var _b = useQuery({
        queryKey: ["/api/admin/recent-activity"],
    }), recentActivity = _b.data, activityLoading = _b.isLoading;
    if (statsLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">QuickRevise Platform Overview</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats === null || stats === void 0 ? void 0 : stats.totalUsers) || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(stats === null || stats === void 0 ? void 0 : stats.activeUsers) || 0} active this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <FileQuestion className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats === null || stats === void 0 ? void 0 : stats.totalQuizzes) || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(stats === null || stats === void 0 ? void 0 : stats.quizzesThisWeek) || 0} created this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats === null || stats === void 0 ? void 0 : stats.totalSubjects) || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Across CBSE, ICSE, ISC boards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats === null || stats === void 0 ? void 0 : stats.averageScore) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Platform average performance
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subscription Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Distribution</CardTitle>
                    <CardDescription>Users by subscription tier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Free Tier</span>
                        <span className="font-semibold">{(stats === null || stats === void 0 ? void 0 : stats.usersByTier.free) || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Standard (₹999/yr)</span>
                        <span className="font-semibold">{(stats === null || stats === void 0 ? void 0 : stats.usersByTier.standard) || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Premium (₹1999/yr)</span>
                        <span className="font-semibold">{(stats === null || stats === void 0 ? void 0 : stats.usersByTier.premium) || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quiz Completion Rate */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Performance</CardTitle>
                    <CardDescription>Platform-wide quiz statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Quizzes Created</span>
                        <span className="font-semibold">{(stats === null || stats === void 0 ? void 0 : stats.totalQuizzes) || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed Quizzes</span>
                        <span className="font-semibold">{(stats === null || stats === void 0 ? void 0 : stats.completedQuizzes) || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completion Rate</span>
                        <span className="font-semibold">
                          {(stats === null || stats === void 0 ? void 0 : stats.totalQuizzes) ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (<div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"/>) : (<div className="space-y-4">
                      {(recentActivity === null || recentActivity === void 0 ? void 0 : recentActivity.slice(0, 10).map(function (activity) { return (<div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <AlertCircle className="h-4 w-4 mt-1 text-blue-500"/>
                          <div className="flex-1">
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>); })) || <p className="text-sm text-muted-foreground">No recent activity</p>}
                    </div>)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>);
}
