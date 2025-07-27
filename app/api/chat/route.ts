import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function GET() {
  return Response.json({ status: "Chat API is running" });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'), // Use cheaper model for testing
      messages,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
