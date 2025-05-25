import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import TodayQuizzes from "@/pages/dashboard/today";
import AskDoubts from "@/pages/dashboard/doubts";
import Settings from "@/pages/dashboard/settings";
import AdminDashboard from "@/pages/admin";

function Router() {
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
      <Route path="/dashboard/take-quiz/:id" component={TakeQuiz} />
      <Route path="/dashboard/today" component={TodayQuizzes} />
      <Route path="/dashboard/doubts" component={AskDoubts} />
      <Route path="/dashboard/settings" component={Settings} />
      
      {/* Admin pages */}
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Toaster />
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
