const Performance = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your learning progress and improvement over time
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                <span className="text-green-600 dark:text-green-400 text-xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">142</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-md">
                <span className="text-orange-600 dark:text-orange-400 text-xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">7 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                <span className="text-purple-600 dark:text-purple-400 text-xl">⏱️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">24h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Subject Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-medium">Mathematics</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-medium">Physics</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold">87%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-medium">Chemistry</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '81%'}}></div>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold">81%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white font-medium">Biology</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '89%'}}></div>
                </div>
                <span className="text-gray-900 dark:text-white font-semibold">89%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Algebra Quiz</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mathematics • 2 hours ago</p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-semibold">95%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Motion Laws</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Physics • Yesterday</p>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">88%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Organic Chemistry</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chemistry • 2 days ago</p>
              </div>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">76%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;