import { useState, useEffect, useRef } from 'react';

const BenefitInquiryPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', text: 'Welcome to Benefit Inquiry! Ask me about your coverage, copays, deductibles, or claims.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const faqChips = [
    "What's my deductible?",
    "Check prescription coverage",
    "Show my copay amounts",
    "When does my plan renew?"
  ];

  const getBenefitResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('deductible')) {
      return `Your Deductible Information:\n- Annual Deductible: ₹5,000\n- Amount Met: ₹2,300\n- Remaining: ₹2,700\n- Family Deductible: ₹10,000 (₹4,800 met)`;
    }
    
    if (message.includes('prescription') || message.includes('drug') || message.includes('medication')) {
      return `Prescription Coverage:\n- Tier 1 (Generic): ₹0 copay\n- Tier 2 (Preferred Brand): ₹150 copay\n- Tier 3 (Non-Preferred): ₹400 copay\n- Mail Order: 90-day supply at 2x copay`;
    }
    
    if (message.includes('copay') || message.includes('co-pay')) {
      return `Your Copay Amounts:\n- Primary Care Visit: ₹200\n- Specialist Visit: ₹400\n- Emergency Room: ₹300 (waived if admitted)\n- Urgent Care: ₹150`;
    }
    
    if (message.includes('renew') || message.includes('renewal') || message.includes('expire')) {
      return `Plan Renewal Information:\n- Current Plan: DineshHealth Plus\n- Renewal Date: January 1, 2025\n- Days Remaining: 47 days\n- Auto-renewal: Enabled`;
    }
    
    if (message.includes('claim') || message.includes('claims')) {
      return `Recent Claims:\n- Nov 15: Dr. Smith Visit - ₹200 copay (Processed)\n- Nov 3: Lab Work - ₹0 (Covered 100%)\n- Oct 28: Prescription - ₹150 (Processed)\nTotal YTD Claims: ₹12,450`;
    }
    
    if (message.includes('out of pocket') || message.includes('oop') || message.includes('maximum')) {
      return `Out-of-Pocket Maximum:\n- Individual Max: ₹15,000\n- Amount Spent: ₹6,800\n- Remaining: ₹8,200\n- Family Max: ₹30,000`;
    }
    
    return "I can help with deductibles, copays, prescription coverage, claims, and plan details. Try asking about your deductible or copay amounts!";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: text.trim() };
    const assistantResponse = { 
      id: Date.now() + 1, 
      type: 'assistant', 
      text: getBenefitResponse(text.trim()) 
    };

    setMessages(prev => [...prev, userMessage, assistantResponse]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleChipClick = (chipText) => {
    setInputValue(chipText);
    handleSend(chipText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end md:items-center justify-center p-4 z-50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Benefit Inquiry Assistant</h3>
            <p className="text-sm text-gray-600">Check your coverage & benefits</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* FAQ Chips */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {faqChips.map((chip, index) => (
              <button
                key={index}
                onClick={() => handleChipClick(chip)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 border border-blue-200"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your benefits..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitInquiryPanel;
