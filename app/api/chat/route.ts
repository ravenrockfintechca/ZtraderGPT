// app/api/chat/route.ts

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, model = 'gpt-4' } = await req.json();

  let endpoint = '';
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  let body: Record<string, any> = {
    model,
    messages,
    stream: true,
  };

  // ✅ GPT 系列（OpenAI）
  if (model.startsWith('gpt')) {
    endpoint = 'https://api.openai.com/v1/chat/completions';
    headers.Authorization = `Bearer ${process.env.OPENAI_API_KEY!}`;
  }

  // ✅ Claude 系列（OpenRouter）
  else if (model.startsWith('claude')) {
    endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    headers.Authorization = `Bearer ${process.env.OPENROUTER_API_KEY!}`;
  }

  // ✅ Mistral / Mixtral（Together.ai）
  else if (model.startsWith('mistral') || model.startsWith('mixtral')) {
    endpoint = 'https://api.together.xyz/v1/chat/completions';
    headers.Authorization = `Bearer ${process.env.TOGETHER_API_KEY!}`;
  }

  // ✅ DeepSeek
  else if (model.startsWith('deepseek')) {
    endpoint = 'https://api.deepseek.com/chat/completions';
    headers.Authorization = `Bearer ${process.env.DEEPSEEK_API_KEY!}`;
  }

  // ❌ 不支持的模型
  else {
    return new Response(`❌ Unsupported model: ${model}`, { status: 400 });
  }

  // ✅ 发送请求
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(`❌ API error: ${text}`, { status: 500 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return new Response(`❌ Request failed: ${err}`, { status: 500 });
  }
}

