// Frontend JavaScript example for streaming chat
class StreamingChatClient {
    constructor(baseUrl = 'http://localhost:8000') {
        this.baseUrl = baseUrl;
    }

    async sendStreamingMessage(message, sessionId, onChunk, onComplete, onError) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            onComplete();
                            return;
                        }

                        try {
                            const chunk = JSON.parse(data);
                            
                            if (chunk.error) {
                                onError(chunk.error);
                                return;
                            }
                            
                            if (chunk.type === 'content' && chunk.content) {
                                onChunk(chunk.content, chunk.done);
                            }
                            
                            if (chunk.done) {
                                onComplete();
                                return;
                            }
                        } catch (e) {
                            console.warn('Failed to parse chunk:', data);
                        }
                    }
                }
            }
        } catch (error) {
            onError(error.message);
        }
    }
}

// Usage example:
const chatClient = new StreamingChatClient();
const messageContainer = document.getElementById('chat-messages');
let currentMessageDiv = null;

function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = content;
    messageContainer.appendChild(messageDiv);
    return messageDiv;
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    
    // Create bot message container
    currentMessageDiv = addMessage('', false);
    let fullResponse = '';
    
    chatClient.sendStreamingMessage(
        message,
        'session-123',
        // onChunk - called for each piece of content
        (content, isDone) => {
            fullResponse += content;
            currentMessageDiv.textContent = fullResponse;
            // Don't auto-scroll - let user control scroll position
        },
        // onComplete - called when streaming is done
        () => {
            console.log('Streaming complete');
            currentMessageDiv = null;
        },
        // onError - called if there's an error
        (error) => {
            currentMessageDiv.textContent = `Error: ${error}`;
            currentMessageDiv.className += ' error';
        }
    );
}

// HTML structure needed:
/*
<div id="chat-messages"></div>
<input type="text" id="message-input" placeholder="Type your message...">
<button onclick="sendMessage()">Send</button>
*/