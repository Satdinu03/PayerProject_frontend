import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, FileSpreadsheet, Moon, Sun, Menu, Plus, MessageSquare, Mic } from 'lucide-react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Contract Mining Assistant. Upload your claims data (Excel/PDF) and ask me to validate claims against payer contracts.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // Update chat history
    const chatTitle = inputValue.slice(0, 50) + (inputValue.length > 50 ? '...' : '');
    const existingChatIndex = chatHistory.findIndex(chat => chat.id === currentChatId);
    
    if (existingChatIndex >= 0) {
      const updatedHistory = [...chatHistory];
      updatedHistory[existingChatIndex] = {
        ...updatedHistory[existingChatIndex],
        messages: newMessages,
        lastMessage: chatTitle,
        timestamp: new Date()
      };
      setChatHistory(updatedHistory);
    } else {
      setChatHistory(prev => [{
        id: currentChatId,
        title: chatTitle,
        messages: newMessages,
        lastMessage: chatTitle,
        timestamp: new Date()
      }, ...prev]);
    }

    // Simulate API call
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I\'m analyzing your query against the contract terms and uploaded claims data. This is a demo response - in production, this would connect to your vector DB and LLM backend.',
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Update chat history with assistant response
      const updatedHistory = [...chatHistory];
      const chatIndex = updatedHistory.findIndex(chat => chat.id === currentChatId);
      if (chatIndex >= 0) {
        updatedHistory[chatIndex].messages = finalMessages;
      }
      setChatHistory(updatedHistory);
      
      setIsLoading(false);
    }, 1500);
  };

  const startNewChat = () => {
    const newChatId = Date.now();
    setCurrentChatId(newChatId);
    setMessages([{
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your Contract Mining Assistant. Upload your claims data (Excel/PDF) and ask me to validate claims against payer contracts.',
      timestamp: new Date()
    }]);
    setUploadedFiles([]);
    setIsSidebarOpen(false);
  };

  const loadChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
    setUploadedFiles([]);
    setIsSidebarOpen(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    const uploadMessage = {
      id: Date.now(),
      type: 'system',
      content: `Uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, uploadMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension === 'pdf' ? <FileText size={16} /> : <FileSpreadsheet size={16} />;
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <div className="app-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <div className="logo">
            <span className="logo-text">CM Assistant</span>
          </div>
        </div>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button className="new-chat-btn" onClick={startNewChat}>
            <Plus size={16} />
            <span>New Chat</span>
          </button>
          
          <div className="chat-history">
            <h3>Recent Chats</h3>
            {chatHistory.map((chat) => (
              <button 
                key={chat.id} 
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => loadChat(chat)}
              >
                <MessageSquare size={14} />
                <div className="chat-info">
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-time">{chat.timestamp.toLocaleDateString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
      
      <div className="main-content">
        <div className="greeting">
          <h2>Hi, how can I help you?</h2>
        </div>
        
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="file-chip">
                  {getFileIcon(file.name)}
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="input-container">
            <div className="input-wrapper">
              <button 
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload claims data"
              >
                <Upload size={20} />
              </button>
              
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about claim validation, contract terms, or upload claims data..."
                className="message-input"
                rows="1"
              />
              
              <button 
                className="voice-btn"
                title="Voice input"
              >
                <Mic size={20} />
              </button>
              
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="send-btn"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;