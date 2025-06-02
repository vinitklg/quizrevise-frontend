import { Link } from "wouter";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Learning Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your progress and continue your spaced learning journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/create-quiz">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg">📝</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create Quiz</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate new quiz</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/today">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-lg">📅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Quizzes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due for review</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/performance">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-lg">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Performance</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View analytics</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/doubts">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-md flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 text-lg">❓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ask Doubts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get help</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Mathematics Quiz</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed 2 hours ago</p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-medium">85%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Physics Review</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due in 1 hour</p>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;