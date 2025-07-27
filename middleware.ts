import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle the ping endpoint
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  // Let everything else through
  return NextResponse.next();
}

export const config = {
  matcher: ['/ping'],
};
