import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onOpenBenefitChat, onOpenPlanShopper, onOpenAgentBenefitChat }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('memberId');
    navigate('/');
  };

  const handleSearch = () => {
    alert('Search functionality coming soon!');
  };

  const handlePlaceholder = (feature) => {
    alert(`${feature} page coming soon!`);
  };

  return (
    <header className="sticky top-0 bg-blue-600/95 backdrop-blur border-b border-blue-500 h-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/landing')}
              className="text-2xl font-semibold text-white hover:text-blue-100"
            >
              DineshHealth
            </button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/landing')}
              className="text-white hover:text-blue-100 font-medium"
            >
              Home
            </button>
            {role === 'member' && onOpenBenefitChat && (
              <button
                onClick={onOpenBenefitChat}
                className="text-white hover:text-blue-100 font-medium"
              >
                Benefit Inquiry
              </button>
            )}
            {role === 'agent' && onOpenPlanShopper && (
              <button
                onClick={onOpenPlanShopper}
                className="text-white hover:text-blue-100 font-medium"
              >
                Plan Shopper
              </button>
            )}
            {role === 'agent' && onOpenAgentBenefitChat && (
              <button
                onClick={onOpenAgentBenefitChat}
                className="text-white hover:text-blue-100 font-medium"
              >
                Benefit Inquiry
              </button>
            )}
            {role === 'customer' && (
              <button
                onClick={() => navigate('/customer/plan-shopper')}
                className="text-white hover:text-blue-100 font-medium"
              >
                Plan Shopper
              </button>
            )}
            <button
              onClick={() => handlePlaceholder('About Us')}
              className="text-white hover:text-blue-100 font-medium"
            >
              About Us
            </button>
            <button
              onClick={() => handlePlaceholder('Contact')}
              className="text-white hover:text-blue-100 font-medium"
            >
              Contact
            </button>
            <button
              onClick={() => handlePlaceholder('FAQs')}
              className="text-white hover:text-blue-100 font-medium"
            >
              FAQs
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              onClick={handleSearch}
              className="p-2 text-white hover:text-blue-100"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Login/Logout */}
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white hover:text-blue-100"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;