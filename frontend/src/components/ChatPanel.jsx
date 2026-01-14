import { useState, useEffect, useRef } from 'react';

const ChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', text: 'Hello! How may I assist you?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const faqChips = [
    "Compare SureCare vs DineshHealth",
    "Show emergency room copay", 
    "What are typical coinsurance rates?",
    "Drug coverage for diabetes"
  ];

  const getChatbotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('compare') && message.includes('surecare') && message.includes('dineshhealth')) {
      return `Comparison (demo data):
- SureCare: Premium ₹1,200/month, ER copay ₹250/visit, Coinsurance 20%
- DineshHealth: Premium ₹1,050/month, ER copay ₹300/visit, Coinsurance 15%
Overall: DineshHealth is cheaper but higher ER copay; SureCare has lower ER copay.`;
    }
    
    if (message.includes('emergency room copay') || message.includes('er copay')) {
      return `Emergency Room copay (demo):
- SureCare: ₹250/visit + 20% coinsurance (copay waived if admitted)
- DineshHealth: ₹300/visit + 15% coinsurance`;
    }
    
    if (message.includes('drug') || message.includes('formulary') || message.includes('diabetes')) {
      return `Drug coverage snapshot (demo):
- Metformin: Tier 1, ₹0 copay
- Atorvastatin: Tier 2, ₹150 copay
- Insulin glargine: Tier 3, ₹400 copay`;
    }
    
    return "I can help you compare plans, premiums, and benefits. Try: 'Compare SureCare vs DineshHealth' or 'Show emergency room copay'.";
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
            <h3 className="text-lg font-semibold text-gray-900">Plan Shopper Assistant</h3>
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
                className="px-3 py-1 text-sm bg-sky-50 text-sky-700 rounded-full hover:bg-sky-100 border border-sky-200"
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
                    ? 'bg-sky-600 text-white'
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
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;