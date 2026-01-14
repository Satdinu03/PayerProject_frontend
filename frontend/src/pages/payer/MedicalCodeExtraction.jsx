import { useNavigate } from 'react-router-dom';

const MedicalCodeExtraction = () => {
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
              <h1 className="text-xl font-semibold">Medical Code Extraction</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Medical Code Extraction Tool
            </h2>
            <p className="text-gray-600 mb-6">
              This is a placeholder page for the Medical Code Extraction functionality.
              Here agents would be able to extract and analyze medical codes using AI.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
              <p className="text-purple-800">
                🤖 AI-powered medical code extraction and analysis tools would be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalCodeExtraction;