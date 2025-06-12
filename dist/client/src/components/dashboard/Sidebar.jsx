import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, Settings, BookOpen, MessageSquare, LogOut, BarChart2 } from "lucide-react";
var Sidebar = function (_a) {
    var _b;
    var _c = _a === void 0 ? {} : _a, className = _c.className;
    var location = useLocation()[0];
    var user = useAuth().user;
    var navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Create Quiz", href: "/dashboard/create-quiz", icon: PlusCircle },
        { name: "Today's Quizzes", href: "/dashboard/today", icon: BookOpen },
        { name: "Performance", href: "/dashboard/performance", icon: BarChart2 },
        { name: "Ask Doubts", href: "/dashboard/doubts", icon: MessageSquare },
        { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
        { name: "Profile", href: "/dashboard/settings", icon: Settings },
    ];
    return (<div className={cn("flex flex-col h-full py-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700", className)}>
      <div className="px-4 mb-6">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8 mr-2">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
            <line x1="4" y1="20" x2="20" y2="20"></line>
          </svg>
          <span className="font-bold text-xl text-gray-900 dark:text-white">QuizRevise</span>
        </div>
      </div>

      <div className="flex-1 px-2 space-y-1">
        {navigation.map(function (item) {
            var isActive = location === item.href;
            return (<Link key={item.name} href={item.href}>
              <Button variant="ghost" className={cn("w-full justify-start", isActive
                    ? "bg-gray-100 dark:bg-gray-700 text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white")}>
                <item.icon className="mr-3 h-5 w-5"/>
                {item.name}
              </Button>
            </Link>);
        })}
      </div>

      <div className="px-3 mt-6 mb-2">
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-300 font-medium text-lg">
                {((_b = user === null || user === void 0 ? void 0 : user.firstName) === null || _b === void 0 ? void 0 : _b.charAt(0)) || ((user === null || user === void 0 ? void 0 : user.email) ? user.email.charAt(0).toUpperCase() : "U")}
              </span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {(user === null || user === void 0 ? void 0 : user.firstName) ? "".concat(user.firstName, " ").concat(user.lastName || "") : user === null || user === void 0 ? void 0 : user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(user === null || user === void 0 ? void 0 : user.subscriptionTier) === "free" ? "Free Plan" :
            (user === null || user === void 0 ? void 0 : user.subscriptionTier) === "standard" ? "Standard Plan" :
                (user === null || user === void 0 ? void 0 : user.subscriptionTier) === "premium" ? "Premium Plan" : ""}
            </p>
          </div>

          <form action="/api/auth/logout" method="post" className="mt-3 w-full">
            <Button type="submit" variant="outline" className="w-full text-gray-700 dark:text-gray-300" size="sm">
              <LogOut className="mr-2 h-4 w-4"/> Log out
            </Button>
          </form>
        </div>
      </div>
    </div>);
};
export default Sidebar;
