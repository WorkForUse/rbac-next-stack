import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static files, images, favicon aur API routes ko ignore karo
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  // 2. Agar token nahi hai, login par bhejo
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Decode static mock token
  try {
    const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString());
    const permissions = decodedToken.permissions || [];
    const moduleName = pathname.split('/')[1];

    // Allow all authenticated users to access dashboard
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.next();
    }

    // Check permission for other routes
    const hasAccess = 
      decodedToken.role === 'Admin' || 
      permissions.includes(`view_${moduleName}`);

    if (!hasAccess) {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth check failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)'],
};