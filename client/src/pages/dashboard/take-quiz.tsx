import { useParams } from "wouter";

const TakeQuiz = () => {
  const params = useParams();
  const scheduleId = params.scheduleId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mathematics Quiz</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Question 1 of 5 • Algebra and Geometry
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '20%'}}></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Progress: 20%</span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Solve for x: 2x + 5 = 15
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input type="radio" name="answer" value="a" className="text-blue-600" />
                <span className="text-gray-900 dark:text-white">x = 5</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input type="radio" name="answer" value="b" className="text-blue-600" />
                <span className="text-gray-900 dark:text-white">x = 10</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input type="radio" name="answer" value="c" className="text-blue-600" />
                <span className="text-gray-900 dark:text-white">x = 7.5</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input type="radio" name="answer" value="d" className="text-blue-600" />
                <span className="text-gray-900 dark:text-white">x = 15</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <button className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Next Question
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-lg">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Hint</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Isolate x by subtracting 5 from both sides, then divide by 2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;