import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface RecentActivity {
  id: number;
  type: string;
  message: string;
  timestamp: Date;
  userId?: number;
}

export default function AdminActivity() {
  const { data: recentActivity, isLoading } = useQuery<RecentActivity[]>({
    queryKey: ["/api/admin/recent-activity"],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'quiz_created':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'quiz_completed':
        return <Badge variant="default">Completed</Badge>;
      case 'quiz_created':
        return <Badge variant="secondary">Created</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Activity</h1>
            <p className="text-gray-600 dark:text-gray-400">Recent activities across the platform</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity ({recentActivity?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getActivityBadge(activity.type)}
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{activity.message}</p>
                      {activity.userId && (
                        <p className="text-xs text-gray-500 mt-1">User ID: {activity.userId}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}