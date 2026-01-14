import { useState } from 'react';
import Header from '../../components/Header';
import ChatWidget from '../../components/ChatWidget';
import ChatPanel from '../../components/ChatPanel';
import BenefitInquiryPanel from '../../components/BenefitInquiryPanel';

const AgentLanding = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBenefitChatOpen, setIsBenefitChatOpen] = useState(false);

  const handleGetQuote = () => {
    alert('Get Quote functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header 
        onOpenPlanShopper={() => setIsChatOpen(true)}
        onOpenAgentBenefitChat={() => setIsBenefitChatOpen(true)}
      />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 py-12">
          {/* Left Column - Text */}
          <div className="flex flex-col justify-center bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Find Your{' '}
              <span className="text-blue-600">Perfect Policy</span>
            </h1>
            <p className="text-xl text-blue-700 mb-8">
              Compare, choose & save on insurances
            </p>
            <div>
              <button
                onClick={handleGetQuote}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-lg"
              >
                Get Quote
              </button>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="flex items-center justify-center">
            <img
              src="/src/assets/images/healthcare-hero.png"
              alt="Healthcare and insurance illustration"
              className="w-full h-auto max-w-lg"
            />
          </div>
        </div>
      </main>

      {/* Floating Chat Widget */}
      <ChatWidget onOpenChat={() => setIsChatOpen(true)} />

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      
      {/* Benefit Inquiry Panel */}
      <BenefitInquiryPanel 
        isOpen={isBenefitChatOpen} 
        onClose={() => setIsBenefitChatOpen(false)} 
      />
    </div>
  );
};

export default AgentLanding;