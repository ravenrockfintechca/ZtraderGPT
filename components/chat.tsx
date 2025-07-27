'use client';

import { useState } from 'react';

function Chat() {
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
      const match = text.match(/0:"(.+)"/);
      const aiContent = match ? match[1].replace(/\\n/g, '\n') : 'Error parsing response';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not connect to AI' }]);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🤖 AI Chat</h1>
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ccc', 
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            marginBottom: '10px',
            padding: '8px',
            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f3e5f5',
            borderRadius: '8px'
          }}>
            <strong>{msg.role === 'user' ? '👤' : '🤖'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div>🤖 Thinking...</div>}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ 
            flex: 1, 
            padding: '10px', 
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          placeholder="Type your message..."
        />
        <button 
          onClick={sendMessage} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export { Chat };
export default Chat;
