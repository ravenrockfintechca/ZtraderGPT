// app/api/chat/route.ts

import { StreamingTextResponse, OpenAIStream } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

// 限流变量（后续建议用 Redis 替代）
let lastCall = 0;
const MIN_INTERVAL = 3000;

export async function POST(req: Request) {
  const now = Date.now();
  if (now - lastCall < MIN_INTERVAL) {
    return new Response('Too many requests. Please wait.', { status: 429 });
  }
  lastCall = now;

  try {
    const { messages, model = 'gpt-4o' } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    console.error('Chat error:', err);
    return new Response('Internal error', { status: 500 });
  }
}
