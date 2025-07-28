// app/(chat)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat - ZTrader GPT',
  description: 'Chat with AI using Groq LLaMA 3.1 or OpenAI GPT-4o-mini',
};

// Server Component Layout
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
