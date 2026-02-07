import { useState } from 'react';
import Header from '../../components/Header';
import ChatPanel from '../../components/ChatPanel';

const PlanShopper = () => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Open by default

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Banner */}
      <div className="bg-sky-50 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan Shopper</h1>
          <p className="text-gray-600">
            Ask questions and compare plans. Try: 'Compare SureCare vs DineshHealth'.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Browse Health Plans
            </h2>
            <p className="text-gray-600 mb-6">
              Use the chat assistant to compare plans, check copays, and explore coverage options.
              The chat panel opens automatically to help you get started.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">
                💬 Chat with our Plan Shopper Assistant to compare SureCare vs DineshHealth plans.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Panel - Opens by default */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default PlanShopper;