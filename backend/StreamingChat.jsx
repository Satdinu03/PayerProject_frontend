import React, { useState, useRef } from 'react';

const StreamingChat = () => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const sendStreamingMessage = async (message) => {
        if (!message.trim() || isStreaming) return;

        // Add user message
        const userMessage = { id: Date.now(), content: message, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsStreaming(true);
        setCurrentMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: 'session-123'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            // Add final message to messages array
                            const botMessage = { 
                                id: Date.now(), 
                                content: fullResponse, 
                                isUser: false 
                            };
                            setMessages(prev => [...prev, botMessage]);
                            setCurrentMessage('');
                            setIsStreaming(false);
                            return;
                        }

                        try {
                            const chunk = JSON.parse(data);
                            
                            if (chunk.error) {
                                throw new Error(chunk.error);
                            }
                            
                            if (chunk.type === 'content' && chunk.content) {
                                fullResponse += chunk.content;
                                setCurrentMessage(fullResponse);
                            }
                            
                            if (chunk.done) {
                                const botMessage = { 
                                    id: Date.now(), 
                                    content: fullResponse, 
                                    isUser: false 
                                };
                                setMessages(prev => [...prev, botMessage]);
                                setCurrentMessage('');
                                setIsStreaming(false);
                                return;
                            }
                        } catch (e) {
                            console.warn('Failed to parse chunk:', data);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage = { 
                id: Date.now(), 
                content: `Error: ${error.message}`, 
                isUser: false, 
                isError: true 
            };
            setMessages(prev => [...prev, errorMessage]);
            setCurrentMessage('');
            setIsStreaming(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendStreamingMessage(input);
    };

    return (
        <div className="streaming-chat">
            <div className="chat-messages" style={{ 
                height: '400px', 
                overflowY: 'auto', 
                border: '1px solid #ccc', 
                padding: '10px',
                marginBottom: '10px'
            }}>
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`message ${msg.isUser ? 'user' : 'bot'} ${msg.isError ? 'error' : ''}`}
                        style={{
                            padding: '8px',
                            margin: '5px 0',
                            backgroundColor: msg.isUser ? '#e3f2fd' : msg.isError ? '#ffebee' : '#f5f5f5',
                            borderRadius: '8px',
                            alignSelf: msg.isUser ? 'flex-end' : 'flex-start'
                        }}
                    >
                        {msg.content}
                    </div>
                ))}
                
                {/* Show streaming message */}
                {isStreaming && currentMessage && (
                    <div 
                        className="message bot streaming"
                        style={{
                            padding: '8px',
                            margin: '5px 0',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            opacity: 0.8
                        }}
                    >
                        {currentMessage}
                        <span className="cursor">|</span>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isStreaming}
                    style={{ 
                        flex: 1, 
                        padding: '8px', 
                        border: '1px solid #ccc', 
                        borderRadius: '4px' 
                    }}
                />
                <button 
                    type="submit" 
                    disabled={isStreaming || !input.trim()}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: isStreaming ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isStreaming ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default StreamingChat;