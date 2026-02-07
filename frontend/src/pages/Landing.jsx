import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    // Redirect based on role
    if (role === 'agent') {
      navigate('/agent/landing');
    } else if (role === 'member') {
      navigate('/member/landing');
    } else if (role === 'payer') {
      // Keep existing payer dashboard logic
      // This maintains backward compatibility
    } else {
      navigate('/');
    }
  }, [role, navigate]);

  const memberId = localStorage.getItem('memberId');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('memberId');
    navigate('/');
  };

  const payerTiles = [
    { title: 'Medical Code Extraction', path: '/payer/medical-code-extraction', description: 'Extract and analyze medical codes' },
    { title: 'Star Rating Analysis', path: '/payer/star-rating-analysis', description: 'Analyze provider star ratings' }
  ];

  // Show payer dashboard if payer role
  if (role === 'payer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Healthcare GenAI Portal</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {memberId} ({role})</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Payer Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payerTiles.map((tile) => (
                <div
                  key={tile.title}
                  onClick={() => navigate(tile.path)}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tile.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tile.description}
                    </p>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                    <span className="text-sm text-indigo-600 font-medium">
                      Access →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer layout="links" />
      </div>
    );
  }

  return null; // Will redirect via useEffect
};

export default Landing;