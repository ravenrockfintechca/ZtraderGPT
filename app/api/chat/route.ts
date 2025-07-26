// app/api/chat/route.ts
import { streamText, convertToCoreMessages } from 'ai';
import { openai } from 'ai/openai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // 检查 API 密钥
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    console.log('Processing chat request with', messages.length, 'messages');

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// 添加 GET 方法用于测试
export async function GET() {
  return new Response('Chat API is working', { status: 200 });
}
