import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  const isActive = (path: string) => location === path;
  const isDashboardRoute = location.startsWith('/dashboard');

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-8 w-8 mr-2">
                <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
                <line x1="4" y1="20" x2="20" y2="20"></line>
              </svg>
              <span className="font-bold text-xl text-gray-900 dark:text-white">QuizRevise</span>
            </Link>
            {/* Only show marketing navigation if user is not authenticated or not on dashboard routes */}
            {!isAuthenticated && !isDashboardRoute && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" className={`${
                  isActive('/') 
                    ? 'border-primary text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Home
                </Link>
                <Link href="/services" className={`${
                  isActive('/services') 
                    ? 'border-primary text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Services
                </Link>
                <Link href="/about" className={`${
                  isActive('/about') 
                    ? 'border-primary text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  About
                </Link>
                <Link href="/pricing" className={`${
                  isActive('/pricing') 
                    ? 'border-primary text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Pricing
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="mr-2">Dashboard</Button>
                </Link>
                <form action="/api/auth/logout" method="post">
                  <Button variant="outline" type="submit">Logout</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            <button 
              type="button" 
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          {/* Only show marketing navigation if user is not authenticated or not on dashboard routes */}
          {!isAuthenticated && !isDashboardRoute && (
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/" className={`${
                isActive('/') 
                  ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Home
              </Link>
              <Link href="/services" className={`${
                isActive('/services') 
                  ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Services
              </Link>
              <Link href="/about" className={`${
                isActive('/about') 
                  ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                About
              </Link>
              <Link href="/pricing" className={`${
                isActive('/pricing') 
                  ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Pricing
              </Link>
            </div>
          )}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              {isLoading ? (
                <div className="mx-3 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : isAuthenticated ? (
                <>
                  {/* Dashboard navigation for mobile */}
                  <Link href="/dashboard" className={`${
                    isActive('/dashboard') 
                      ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/create-quiz" className={`${
                    isActive('/dashboard/create-quiz') 
                      ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    Create Quiz
                  </Link>
                  <Link href="/dashboard/today" className={`${
                    isActive('/dashboard/today') 
                      ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    Today's Quizzes
                  </Link>
                  <Link href="/dashboard/performance" className={`${
                    isActive('/dashboard/performance') 
                      ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    Performance
                  </Link>
                  <Link href="/dashboard/doubts" className={`${
                    isActive('/dashboard/doubts') 
                      ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    Ask Doubts
                  </Link>
                  <Link href="/dashboard/settings" className={`${
                    isActive('/dashboard/settings') 
                      ? 'bg-primary-50 dark:bg-gray-700 border-primary text-primary dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                    Settings
                  </Link>
                  <form action="/api/auth/logout" method="post" className="mt-4">
                    <button type="submit" className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    Log In
                  </Link>
                  <Link href="/signup" className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
