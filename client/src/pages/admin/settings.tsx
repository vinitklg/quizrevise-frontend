import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Settings, Key, Database, Globe } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform configuration and system settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">OpenAI API</div>
                    <div className="text-sm text-gray-500">For quiz generation</div>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Database Connection</div>
                    <div className="text-sm text-gray-500">PostgreSQL database</div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Maintenance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Quiz Generation</div>
                    <div className="text-sm text-gray-500">AI-powered quiz creation</div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Diagram Rendering</div>
                    <div className="text-sm text-gray-500">SVG diagram generation</div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">User Registration</div>
                    <div className="text-sm text-gray-500">New user signups</div>
                  </div>
                  <Badge variant="default">Open</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Version</span>
                  <span className="text-sm font-medium">QuickRevise v1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Environment</span>
                  <span className="text-sm font-medium">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Uptime</span>
                  <span className="text-sm font-medium">Online</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}