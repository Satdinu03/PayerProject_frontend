import { useState, useRef } from 'react';
import MessageBubble from '../planshopper_ui/MessageBubble';
import { chatApi } from '../planshopper_ui/chatApi';

const ChatPanel = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', text: "Hello! I'm your Plan Shopper assistant. I can help you find and compare health insurance plans, check drug coverage, find providers, and more. What would you like to know?", hasTable: false, tableData: null }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const faqChips = [
    "Compare available plans",
    "Show drug coverage", 
    "Find providers in my area",
    "What are the costs?"
  ];

  const handleSend = async (text = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { id: Date.now(), type: 'user', text: text.trim(), hasTable: false, tableData: null };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add placeholder for streaming response
    const assistantId = Date.now() + 1;
    const assistantMessage = {
      id: assistantId,
      type: 'assistant',
      text: '',
      hasTable: false,
      tableData: null
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      await chatApi.sendMessageStream(text.trim(), 'default-session', (chunk) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantId 
              ? { ...msg, text: msg.text + chunk }
              : msg
          )
        );
      });
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantId 
            ? { ...msg, text: `Sorry, I encountered an error: ${error.message}. Please try again.` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
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
    <div className="fixed inset-0 flex items-end md:items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Plan Shopper Assistant</h3>
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
            <MessageBubble
              key={message.id}
              message={message.text}
              isUser={message.type === 'user'}
              hasTable={message.hasTable}
              tableData={message.tableData}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">
                Typing...
              </div>
            </div>
          )}
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
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
