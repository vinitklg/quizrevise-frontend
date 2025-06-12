import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Database, Server, HardDrive } from "lucide-react";
export default function AdminDatabase() {
    return (<div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Database Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Database status and management tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Connected</div>
                <Badge variant="default" className="mt-2">PostgreSQL</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <Badge variant="secondary" className="mt-2">Production</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground"/>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Available</div>
                <Badge variant="outline" className="mt-2">Managed</Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
            'users', 'quizzes', 'quiz_schedules', 'subjects',
            'chapters', 'topics', 'doubt_queries', 'questions'
        ].map(function (table) { return (<div key={table} className="p-3 border rounded-lg">
                    <div className="font-medium">{table}</div>
                    <div className="text-sm text-gray-500">Active</div>
                  </div>); })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
}
