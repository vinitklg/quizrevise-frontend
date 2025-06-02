import { Link } from "wouter";

const TodayQuizzes = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Today's Quizzes</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Quizzes scheduled for review based on spaced repetition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mathematics</h3>
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded">Overdue</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Algebra and Geometry concepts
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Due 2 hours ago</span>
              <Link href="/dashboard/take-quiz/1">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  Take Quiz
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Physics</h3>
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">Due Soon</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Motion and Forces review
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Due in 30 minutes</span>
              <Link href="/dashboard/take-quiz/2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  Take Quiz
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chemistry</h3>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">Ready</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Periodic Table elements
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Due in 2 hours</span>
              <Link href="/dashboard/take-quiz/3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  Take Quiz
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Study Streak</h2>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">7</div>
            <div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">Days</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Keep it up!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayQuizzes;