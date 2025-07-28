// app/(chat)/page.tsx
import { Suspense } from 'react';
import { ChatInterface } from './chat-interface';

// Server Component (default)
export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<ChatLoading />}>
          <ChatInterface />
        </Suspense>
      </main>
    </div>
  );
}

// Loading component
function ChatLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading chat...</span>
    </div>
  );
}
