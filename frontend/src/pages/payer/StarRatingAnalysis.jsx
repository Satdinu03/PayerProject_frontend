import { useNavigate } from 'react-router-dom';

const StarRatingAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/landing')}
                className="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold">Star Rating Analysis</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Star Rating Analysis Tool
            </h2>
            <p className="text-gray-600 mb-6">
              This is a placeholder page for the Star Rating Analysis functionality.
              Here agents would be able to analyze provider star ratings and performance metrics.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                ⭐ Provider star rating analysis and performance metrics would be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StarRatingAnalysis;