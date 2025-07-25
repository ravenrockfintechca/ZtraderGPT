// app/api/chat/route.ts

import { OpenAI } from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages,
  });

  // 较为通用的 Response Stream 返回（不依赖 ai sdk）
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of res) {
        controller.enqueue(encoder.encode(chunk.choices?.[0]?.delta?.content || ''));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
