import { Link } from "wouter";
import { Button } from "@/components/ui/button";
var Services = function () {
    return (<div className="bg-white dark:bg-gray-900">
      {/* Header section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">Our Services</h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
            Everything you need to excel in your studies with scientifically-proven learning methods.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to excel
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Our comprehensive learning platform is designed specifically for CBSE, ICSE, and ISC students in grades 6-12.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">AI-Generated Quizzes</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Our advanced AI creates unique quizzes for every subject and chapter, with varied question types to test different skills.
                </dd>
              </div>
              
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Spaced Repetition</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Scientifically proven scheduling ensures you review material just before you're likely to forget it, maximizing retention.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Daily Doubt Solving</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Get your academic questions answered quickly through our AI-powered doubt resolution system.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Performance Analytics</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Track your progress with detailed reports showing strengths, weaknesses, and improvement over time.
                </dd>
              </div>
              
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Smart Scheduling</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Set your study preferences, and we'll organize your quizzes to fit your schedule without overwhelming you.
                </dd>
              </div>
              
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Web & Mobile Access</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  Access your learning materials anytime, anywhere with our web platform and Android app.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Quiz Demo Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Try a sample quiz
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Experience the interactive quiz format that helps students master concepts effectively.
            </p>
          </div>
          
          <div className="mt-12 max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-primary text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Physics: Laws of Motion</h3>
                <span className="bg-white text-primary px-2 py-1 rounded-full text-xs font-medium">
                  Question 1/5
                </span>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <p className="text-gray-800 dark:text-gray-200 font-medium text-lg mb-6">
                Newton's First Law of Motion is also known as the law of:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="radio" id="option1" name="answer" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"/>
                  <label htmlFor="option1" className="ml-3 block text-gray-700 dark:text-gray-300">
                    Conservation of momentum
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="option2" name="answer" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"/>
                  <label htmlFor="option2" className="ml-3 block text-gray-700 dark:text-gray-300">
                    Inertia
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="option3" name="answer" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"/>
                  <label htmlFor="option3" className="ml-3 block text-gray-700 dark:text-gray-300">
                    Action and reaction
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="option4" name="answer" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"/>
                  <label htmlFor="option4" className="ml-3 block text-gray-700 dark:text-gray-300">
                    Conservation of energy
                  </label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Previous
              </button>
              
              <div className="flex space-x-1">
                <span className="h-2 w-6 bg-primary rounded-full"></span>
                <span className="h-2 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                <span className="h-2 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                <span className="h-2 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                <span className="h-2 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              </div>
              
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Coverage */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Curriculum Coverage</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">Comprehensive subject coverage</p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              We support all major subjects from the CBSE, ICSE, and ISC curricula for grades 6-12.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science",
            "Social Studies", "Economics", "Business Studies", "Accountancy", "Political Science", "Hindi", "Sanskrit"].map(function (subject) { return (<div key={subject} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-900 dark:text-white font-medium">{subject}</p>
              </div>); })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Start mastering your subjects today</span>
            <span className="block">with our proven learning system.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of students who are using spaced repetition to achieve academic excellence.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup">
                <Button variant="secondary" size="lg">
                  Get started for free
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="bg-primary-600 text-white border-primary-500 hover:bg-primary-700">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default Services;
