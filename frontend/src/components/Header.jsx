import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onOpenBenefitChat, onOpenPlanShopper, onOpenAgentBenefitChat }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (dropdown) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('memberId');
    navigate('/');
  };

  const handleSearch = () => {
    alert('Search functionality coming soon!');
  };

  const handleDropdownClick = (type, item) => {
    const routes = {
      about: {
        'Our Mission': '/about?section=our-mission',
        'Member Benefits': '/about?section=member-benefits', 
        'Network Providers': '/about?section=network-providers',
        'Agent Portal': '/about?section=agent-portal',
        'Training Center': '/about?section=training-center',
        'Commission Structure': '/about?section=commission-structure'
      },
      contact: {
        'Member Services': '/contact?section=member-services',
        'Claims Department': '/contact?section=claims-department',
        'Emergency Line': '/contact?section=emergency-line',
        'Agent Support': '/contact?section=agent-support',
        'Technical Help': '/contact?section=technical-help',
        'Sales Team': '/contact?section=sales-team'
      },
      faq: {
        'How to file a claim?': '/faq?section=file-claim',
        'Find a doctor?': '/faq?section=find-doctor',
        'Coverage questions?': '/faq?section=coverage-questions',
        'How to enroll clients?': '/faq?section=enroll-clients',
        'Commission payments?': '/faq?section=commission-payments',
        'Marketing materials?': '/faq?section=marketing-materials'
      }
    };

    const route = routes[type]?.[item.title];
    if (route) {
      navigate(route);
      setActiveDropdown(null);
    }
  };

  const dropdownContent = {
    about: {
      member: [
        { title: 'Our Mission', desc: 'Providing quality healthcare coverage for members' },
        { title: 'Member Benefits', desc: 'Comprehensive health plans and wellness programs' },
        { title: 'Network Providers', desc: 'Access to 50,000+ healthcare providers nationwide' }
      ],
      agent: [
        { title: 'Agent Portal', desc: 'Tools and resources for insurance agents' },
        { title: 'Training Center', desc: 'Certification programs and continuing education' },
        { title: 'Commission Structure', desc: 'Competitive rates and bonus opportunities' }
      ]
    },
    contact: {
      member: [
        { title: 'Member Services', desc: '1-800-MEMBER (24/7 support)' },
        { title: 'Claims Department', desc: '1-800-CLAIMS (Mon-Fri 8AM-6PM)' },
        { title: 'Emergency Line', desc: '1-800-URGENT (24/7 emergency assistance)' }
      ],
      agent: [
        { title: 'Agent Support', desc: '1-800-AGENTS (Mon-Fri 7AM-7PM)' },
        { title: 'Technical Help', desc: '1-800-TECH-HELP (24/7 system support)' },
        { title: 'Sales Team', desc: '1-800-SALES (Mon-Fri 8AM-8PM)' }
      ]
    },
    faq: {
      member: [
        { title: 'How to file a claim?', desc: 'Submit online or call member services' },
        { title: 'Find a doctor?', desc: 'Use our provider directory tool' },
        { title: 'Coverage questions?', desc: 'Review your benefits summary or call us' }
      ],
      agent: [
        { title: 'How to enroll clients?', desc: 'Use the agent portal enrollment system' },
        { title: 'Commission payments?', desc: 'Paid monthly via direct deposit' },
        { title: 'Marketing materials?', desc: 'Download from the resource center' }
      ]
    }
  };

  const DropdownMenu = ({ type, items }) => (
    <div className="absolute top-full left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 w-80"
         onMouseEnter={() => handleMouseEnter(type)}
         onMouseLeave={handleMouseLeave}>
      {items.map((item, idx) => (
        <div key={idx} 
             className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
             onClick={() => handleDropdownClick(type, item)}>
          <div className="font-medium text-gray-900 text-sm">{item.title}</div>
          <div className="text-gray-600 text-xs mt-1">{item.desc}</div>
        </div>
      ))}
    </div>
  );

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
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('about')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <button className="text-white hover:text-blue-100 font-medium">
                About Us
              </button>
              {activeDropdown === 'about' && (
                <div onMouseEnter={() => setActiveDropdown('about')} onMouseLeave={() => setActiveDropdown(null)}>
                  <DropdownMenu type="about" items={dropdownContent.about[role] || dropdownContent.about.member} />
                </div>
              )}
            </div>
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('contact')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <button className="text-white hover:text-blue-100 font-medium">
                Contact
              </button>
              {activeDropdown === 'contact' && (
                <div onMouseEnter={() => setActiveDropdown('contact')} onMouseLeave={() => setActiveDropdown(null)}>
                  <DropdownMenu type="contact" items={dropdownContent.contact[role] || dropdownContent.contact.member} />
                </div>
              )}
            </div>
            <div className="relative"
                 onMouseEnter={() => setActiveDropdown('faq')}
                 onMouseLeave={() => setActiveDropdown(null)}>
              <button className="text-white hover:text-blue-100 font-medium">
                FAQs
              </button>
              {activeDropdown === 'faq' && (
                <div onMouseEnter={() => setActiveDropdown('faq')} onMouseLeave={() => setActiveDropdown(null)}>
                  <DropdownMenu type="faq" items={dropdownContent.faq[role] || dropdownContent.faq.member} />
                </div>
              )}
            </div>
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