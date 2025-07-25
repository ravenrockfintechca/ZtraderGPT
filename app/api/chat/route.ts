import { StreamingTextResponse } from 'ai';
import { OpenAIStream } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, model = 'gpt-4o' } = await req.json();

  // ✅ OpenAI 系列
  if (model.startsWith('gpt')) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const response = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }

  // ✅ Claude 系列（via OpenRouter）
  if (model.startsWith('claude')) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    return new StreamingTextResponse(res.body as ReadableStream);
  }

  // ✅ Together.ai 系列（Mistral / Mixtral）
  if (model.startsWith('mistral') || model.startsWith('mixtral')) {
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    return new StreamingTextResponse(res.body as ReadableStream);
  }

  // ✅ DeepSeek 系列
  if (model.startsWith('deepseek')) {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    return new StreamingTextResponse(res.body as ReadableStream);
  }

  return new Response(`Unsupported model: ${model}`, { status: 400 });
}
