export async function GET() {
  return Response.json({ status: "Chat API is running" });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    console.log('Received messages:', JSON.stringify(messages));
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    
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
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data));
    
    // Return in AI SDK compatible format
    const aiResponse = data.choices[0].message.content;
    
    // Create a simple text stream response that matches AI SDK format
    return new Response(`0:"${aiResponse}"`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      }
    });
    
  } catch (error) {
    console.error('Chat API Error:', error.message);
    return new Response(`3:"${error.message}"`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      },
      status: 500
    });
  }
}
