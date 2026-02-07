import { useState } from 'react';
import HealthcareModal from './HealthcareModal';
import { 
  ShieldCheckIcon, 
  ComputerDesktopIcon, 
  CurrencyDollarIcon, 
  ClipboardDocumentListIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

// Fallback icons as simple SVGs
const FallbackIcons = {
  shield: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  computer: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  dollar: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  clipboard: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  chevron: () => (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
};

const Footer = ({ layout = 'grid' }) => {
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleArticleClick = (articleId) => {
    setSelectedArticle(articleId);
    setModalOpen(true);
  };

  const footerArticles = [
    {
      id: 1,
      title: "Why Health Insurance is Essential",
      summary: "Protect yourself from unexpected medical costs and ensure access to quality healthcare when you need it most.",
      icon: ShieldCheckIcon || FallbackIcons.shield,
      linkText: "Learn More",
      category: "Protection"
    },
    {
      id: 2,
      title: "Benefits of Digital Healthcare Platforms",
      summary: "Experience faster claims, 24/7 support, and seamless plan management through our secure online portal.",
      icon: ComputerDesktopIcon || FallbackIcons.computer,
      linkText: "Explore Features",
      category: "Technology"
    },
    {
      id: 3,
      title: "Smart Policy Comparison Saves Money",
      summary: "Compare coverage options, deductibles, and networks to find the perfect plan that fits your budget and needs.",
      icon: CurrencyDollarIcon || FallbackIcons.dollar,
      linkText: "Start Comparing",
      category: "Savings"
    },
    {
      id: 4,
      title: "Choosing the Right Health Plan",
      summary: "Consider your healthcare needs, preferred doctors, and budget to select a plan that provides optimal coverage.",
      icon: ClipboardDocumentListIcon || FallbackIcons.clipboard,
      linkText: "Get Guide",
      category: "Planning"
    }
  ];

  const renderGridLayout = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {footerArticles.map((article) => {
        const IconComponent = article.icon;
        return (
          <div
            key={article.id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            onMouseEnter={() => setHoveredArticle(article.id)}
            onMouseLeave={() => setHoveredArticle(null)}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <IconComponent className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                {article.category}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
              {article.title}
            </h3>
            <p className="text-gray-600 text-xs mb-4 leading-relaxed">
              {article.summary}
            </p>
            <button 
              onClick={() => handleArticleClick(article.id)}
              className="flex items-center text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
            >
              {article.linkText}
              {ChevronRightIcon ? (
                <ChevronRightIcon 
                  className={`h-3 w-3 ml-1 transition-transform ${
                    hoveredArticle === article.id ? 'translate-x-1' : ''
                  }`} 
                />
              ) : (
                <FallbackIcons.chevron />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderBlogLayout = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Healthcare Insights</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Articles
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {footerArticles.slice(0, 2).map((article) => {
          const IconComponent = article.icon;
          return (
            <div key={article.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {article.category}
                </span>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-xs mb-3">
                  {article.summary}
                </p>
                <button 
                  onClick={() => handleArticleClick(article.id)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                >
                  {article.linkText} →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLinksLayout = () => (
    <div className="grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quick Resources</h3>
        <ul className="space-y-2">
          {footerArticles.slice(0, 2).map((article) => (
            <li key={article.id}>
              <button className="text-gray-600 hover:text-blue-600 text-xs transition-colors text-left">
                {article.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Planning Tools</h3>
        <ul className="space-y-2">
          {footerArticles.slice(2, 4).map((article) => (
            <li key={article.id}>
              <button className="text-gray-600 hover:text-blue-600 text-xs transition-colors text-left">
                {article.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Support</h3>
        <ul className="space-y-2 text-xs text-gray-600">
          <li><button className="hover:text-blue-600 transition-colors">Help Center</button></li>
          <li><button className="hover:text-blue-600 transition-colors">Contact Us</button></li>
          <li><button className="hover:text-blue-600 transition-colors">Live Chat</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Company</h3>
        <ul className="space-y-2 text-xs text-gray-600">
          <li><button className="hover:text-blue-600 transition-colors">About DineshHealth</button></li>
          <li><button className="hover:text-blue-600 transition-colors">Careers</button></li>
          <li><button className="hover:text-blue-600 transition-colors">Privacy Policy</button></li>
        </ul>
      </div>
    </div>
  );

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Articles Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Healthcare Resources & Insights
            </h2>
            <p className="text-gray-600 text-sm">
              Expert guidance to help you make informed healthcare decisions
            </p>
          </div>
          
          {layout === 'grid' && renderGridLayout()}
          {layout === 'blog' && renderBlogLayout()}
          {layout === 'links' && renderLinksLayout()}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-2xl font-bold text-blue-600 mr-4">
                DineshHealth
              </div>
              <p className="text-gray-600 text-sm">
                Your trusted healthcare insurance partner
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© 2024 DineshHealth Insurance</span>
              <button className="hover:text-blue-600 transition-colors">Terms</button>
              <button className="hover:text-blue-600 transition-colors">Privacy</button>
            </div>
          </div>
        </div>
      </div>

      {/* Healthcare Modal */}
      <HealthcareModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        articleId={selectedArticle}
      />
    </footer>
  );
};

export default Footer;