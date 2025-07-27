'use client';

import { useState } from 'react';

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant powered by Groq. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newMessage] 
        })
      });
      
      const text = await response.text();
      const match = text.match(/0:"(.+)"/);
      const aiContent = match ? match[1].replace(/\\n/g, '\n') : 'Error parsing response';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🤖 AI Assistant</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            Powered by Groq LLaMA 3.1 • Lightning Fast Responses
          </p>
        </div>

        {/* Messages */}
        <div style={{
          height: '500px',
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: msg.role === 'user' ? '#1976d2' : '#e3f2fd',
                color: msg.role === 'user' ? 'white' : '#333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.4'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                  {msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
                </div>
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: '#f0f0f0',
                color: '#666',
                fontStyle: 'italic',
                animation: 'pulse 1.5s infinite'
              }}>
                🤖 AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '25px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: loading || !input.trim() ? '#ccc' : '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                minWidth: '80px'
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: '#f5f5f5',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          ✅ API Status: Online • ⚡ Response Time: ~500ms • 🔄 Dual Model Support
        </div>
      </div>
    </div>
  );
}
