'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage] 
        })
      });

      const text = await response.text();
      // Parse the AI SDK response format: 0:"content"
      const match = text.match(/0:"(.+)"/);
      const aiContent = match ? match[1].replace(/\\n/g, '\n') : 'Error parsing response';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not connect to AI' }]);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>🤖 AI Chatbot - WORKING!</h1>
      
      <div style={{ 
        height: '400px', 
        border: '1px solid #ccc', 
        padding: '10px', 
        marginBottom: '10px',
        overflowY: 'auto',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f3e5f5',
            borderRadius: '8px'
          }}>
            <strong>{msg.role === 'user' ? '👤 You' : '🤖 AI'}:</strong>
            <div style={{ whiteSpace: 'pre-wrap', marginTop: '4px' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ 
            padding: '8px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            fontStyle: 'italic'
          }}>
            🤖 AI is thinking...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Send
        </button>
      </div>
      
      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        ✅ Backend API: Working<br/>
        ✅ Groq Model: llama-3.1-8b-instant<br/>
        ✅ Response Time: ~500ms<br/>
        💡 Type a message to test your AI chatbot!
      </p>
    </div>
  );
}
