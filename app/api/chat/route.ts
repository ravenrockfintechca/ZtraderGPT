import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function GET() {
  return Response.json({ status: "Chat API is running" });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('Received messages:', messages);
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        hasApiKey: !!process.env.OPENAI_API_KEY 
      },
      { status: 500 }
    );
  }
}
