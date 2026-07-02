import { auth } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';

const authMiddleware = auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: '/auth/sign-in',
});

export default function proxy(request: NextRequest) {
  const isServerAction =
    request.method === 'POST' &&
    (request.headers.has('next-action') ||
      request.headers.get('accept')?.includes('text/x-component'));

  if (isServerAction) {
    return NextResponse.next();
  }

  return authMiddleware(request);
}

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/account/:path*', '/dashboard/:path*', '/bookings/:path*', '/rooms/:path*', '/payments/:path*',
  ],
};
