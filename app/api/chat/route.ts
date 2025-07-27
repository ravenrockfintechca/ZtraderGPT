export async function GET() {
  return Response.json({ status: "Chat API is running" });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Simple OpenAI call without AI SDK for now
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        stream: false
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }
    
    return Response.json({
      content: data.choices[0].message.content,
      role: 'assistant'
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
