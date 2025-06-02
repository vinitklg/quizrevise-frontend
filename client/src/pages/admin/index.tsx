const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage users, content, and platform analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                <span className="text-blue-600 dark:text-blue-400 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                <span className="text-green-600 dark:text-green-400 text-xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3,456</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                <span className="text-purple-600 dark:text-purple-400 text-xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">892</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-md">
                <span className="text-orange-600 dark:text-orange-400 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">84%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Management</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              View and manage user accounts, permissions, and activity
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
              Manage Users
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Review</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Review and moderate quiz content and user submissions
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
              Review Content
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              View detailed platform analytics and performance metrics
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">New user registered</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">sarah.wilson@email.com • 5 minutes ago</p>
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">New</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Quiz content flagged</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mathematics Quiz #1234 • 1 hour ago</p>
              </div>
              <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">Review</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">System backup completed</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily backup • 3 hours ago</p>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Success</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;