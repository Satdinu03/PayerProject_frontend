import { useState, useEffect, useRef } from 'react';

const BenefitChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', text: 'Hello! I can help you with benefit inquiries.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const faqChips = [
    "What is my deductible?",
    "Check prescription coverage", 
    "Preventive care benefits",
    "Out-of-pocket maximum"
  ];

  const getChatbotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('deductible')) {
      return `Your Deductible (demo):\n- Individual: ₹5,000/year\n- Family: ₹10,000/year\n- Current spent: ₹1,200\n- Remaining: ₹3,800`;
    }
    
    if (message.includes('prescription') || message.includes('drug')) {
      return `Prescription Coverage (demo):\n- Generic drugs: ₹50 copay\n- Brand drugs: ₹200 copay\n- Specialty drugs: ₹500 copay\n- Mail order: 90-day supply available`;
    }
    
    if (message.includes('preventive')) {
      return `Preventive Care Benefits (demo):\n- Annual checkup: 100% covered\n- Vaccinations: 100% covered\n- Cancer screenings: 100% covered\n- No deductible required`;
    }
    
    if (message.includes('out-of-pocket') || message.includes('maximum')) {
      return `Out-of-Pocket Maximum (demo):\n- Individual: ₹15,000/year\n- Family: ₹30,000/year\n- Current spent: ₹3,500\n- Remaining: ₹11,500`;
    }
    
    return "I can help you check deductibles, prescription coverage, preventive care, and out-of-pocket maximums. Try asking about any of these!";
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
      text: getChatbotResponse(text.trim()) 
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
            <p className="text-sm text-gray-600">Demo chat • Static answers</p>
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
                className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 border border-green-200"
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
                    ? 'bg-green-600 text-white'
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitChatPanel;
