export async function GET() {
  return Response.json({ 
    status: "Chat API is running", 
    models: ["openai", "groq"],
    default: "groq"
  });
}

export async function POST(req: Request) {
  try {
    const { messages, model = "groq" } = await req.json();
    
    console.log(`Using model: ${model}`);
    
    let response;
    let modelName;
    
    if (model === "openai") {
      // OpenAI API call
      modelName = "gpt-4o-mini";
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      });
    } else {
      // Groq API call (default)
      modelName = "llama-3.1-70b-versatile";
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      });
    }
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`${model.toUpperCase()} API Error:`, response.status, errorData);
      throw new Error(`${model.toUpperCase()} API error: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Add model info to response
    const responseWithModel = `Model: ${modelName}\n\n${aiResponse}`;
    
    return new Response(`0:"${responseWithModel}"`, {
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
