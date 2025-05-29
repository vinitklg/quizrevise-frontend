import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Pricing from "@/pages/pricing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import CreateQuiz from "@/pages/dashboard/create-quiz";
import TakeQuiz from "@/pages/dashboard/take-quiz";
import QuizResults from "@/pages/dashboard/quiz-results";
import TodayQuizzes from "@/pages/dashboard/today";
import AskDoubts from "@/pages/dashboard/doubts";
import Settings from "@/pages/dashboard/settings";
import Performance from "@/pages/dashboard/performance";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLogin from "@/pages/admin/login";
import AdminUsers from "@/pages/admin/users";
import AdminSubjects from "@/pages/admin/subjects";
import AdminQuizzes from "@/pages/admin/quizzes";
import AdminActivity from "@/pages/admin/activity";
import AdminDatabase from "@/pages/admin/database";
import AdminSettings from "@/pages/admin/settings";

function Router() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Define which routes should use dashboard layout (authenticated routes)
  const isDashboardRoute = location.startsWith('/dashboard') || location.startsWith('/admin');
  
  // Define which routes are public (don't require authentication)
  const isPublicRoute = ['/', '/about', '/services', '/pricing', '/login', '/signup'].includes(location) || 
                       location.startsWith('/admin/login');

  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Dashboard pages */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/create-quiz" component={CreateQuiz} />
      <Route path="/dashboard/take-quiz/:scheduleId" component={TakeQuiz} />
      <Route path="/dashboard/quiz-results/:scheduleId" component={QuizResults} />
      <Route path="/dashboard/today" component={TodayQuizzes} />
      <Route path="/dashboard/doubts" component={AskDoubts} />
      <Route path="/dashboard/performance" component={Performance} />
      <Route path="/dashboard/settings" component={Settings} />
      
      {/* Admin pages */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/subjects" component={AdminSubjects} />
      <Route path="/admin/quizzes" component={AdminQuizzes} />
      <Route path="/admin/activity" component={AdminActivity} />
      <Route path="/admin/database" component={AdminDatabase} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Define which routes should use dashboard layout (authenticated routes)
  const isDashboardRoute = location.startsWith('/dashboard') || location.startsWith('/admin');
  
  // Define which routes are public (don't require authentication)
  const isPublicRoute = ['/', '/about', '/services', '/pricing', '/login', '/signup'].includes(location) || 
                       location.startsWith('/admin/login');

  // Show dashboard layout for authenticated dashboard/admin routes
  const shouldUseDashboardLayout = !isLoading && isAuthenticated && isDashboardRoute;
  
  // Show public layout for public routes or when not authenticated
  const shouldUsePublicLayout = isPublicRoute || !isAuthenticated || isLoading;

  return (
    <>
      <Toaster />
      {shouldUseDashboardLayout ? (
        <DashboardLayout>
          <Router />
        </DashboardLayout>
      ) : (
        <div className="flex flex-col min-h-screen">
          {shouldUsePublicLayout && <Header />}
          <main className="flex-grow">
            <Router />
          </main>
          {shouldUsePublicLayout && <Footer />}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
