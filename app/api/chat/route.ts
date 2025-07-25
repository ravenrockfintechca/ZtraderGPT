k// app/api/chat/route.ts
import { streamText, convertToCoreMessages } from 'ai';
import { openai } from 'ai/openai';

// 改為 nodejs 運行時以避免 Edge Runtime 問題
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
