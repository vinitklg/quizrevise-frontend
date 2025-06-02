import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  BookOpen,
  FileQuestion,
  Settings,
  Shield,
  Activity,
  Database,
  MessageSquare,
  LogOut,
  KeyRound
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { name: "Quizzes", href: "/admin/quizzes", icon: FileQuestion },
  { name: "Feedbacks", href: "/admin/feedbacks", icon: MessageSquare },
  { name: "Activity", href: "/admin/activity", icon: Activity },
  { name: "Database", href: "/admin/database", icon: Database },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const handleLogout = () => {
  window.location.href = '/api/auth/logout';
};

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col w-64 bg-gray-900 dark:bg-gray-950">
      <div className="flex items-center justify-center h-16 px-4">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-500" />
          <span className="ml-2 text-xl font-bold text-white">QuickRevise Admin</span>
        </div>
      </div>
      <nav className="flex-1 px-4 pb-4 mt-5">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                      )}
                    />
                    {item.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom section with logout and password change */}
      <div className="px-4 pb-4 border-t border-gray-700">
        <div className="space-y-2 mt-4">
          <Link href="/admin/change-password">
            <div className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer">
              <KeyRound className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" />
              Change Password
            </div>
          </Link>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}