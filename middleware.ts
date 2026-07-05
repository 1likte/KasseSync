import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin, super-admin, and possystem
  if (path.startsWith('/admin') || path.startsWith('/super-admin') || path.startsWith('/possystem')) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const admin = JSON.parse(token);
      
      // Super admin path protection
      if (path.startsWith('/super-admin') && admin.role !== 'super-admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*', '/possystem/:path*'],
};
