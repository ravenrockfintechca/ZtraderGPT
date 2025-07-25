import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// 🧠 初始化 OpenAI SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ✅ 告诉 Vercel 这是 Edge 函数
export const runtime = 'edge';

// ✅ 简单内存限流器（每 IP 每分钟最多 5 次）
const ipCache = new Map<string, { count: number; lastReset: number }>();
const LIMIT_PER_MINUTE = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const minute = 60 * 1000;

  const record = ipCache.get(ip);
  if (!record || now - record.lastReset > minute) {
    ipCache.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= LIMIT_PER_MINUTE) return false;

  record.count += 1;
  ipCache.set(ip, record);
  return true;
}

// ✅ 主函数入口
export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response('⛔️ Rate limit exceeded. Try again later.', { status: 429 });
  }

  const body = await req.json();
  const { messages } = body;

  // ✅ fallback 模型列表（按顺序尝试）
  const fallbackModels = ['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'];

  for (const model of fallbackModels) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
      });

      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    } catch (err: any) {
      console.warn(`⚠️ Model ${model} failed:`, err.message || err);
      continue; // 尝试下一个 fallback 模型
    }
  }

  return new Response('❌ All fallback models failed.', { status: 500 });
}
