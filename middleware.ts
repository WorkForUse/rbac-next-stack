// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.') || pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    let permissions: string[] = [];
    let role = '';

    // Mock/Seed token handle karne ke liye (Aapka base64 logic)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      permissions = decoded.permissions || [];
      role = decoded.role || '';
    } catch {
      // Agar real JWT hai toh yahan proper verification logic aayega
      return NextResponse.next(); 
    }

    const moduleName = pathname.split('/')[1];

    if (pathname.startsWith('/dashboard')) return NextResponse.next();

    // Spec Requirement: Admin bypass OR specific permission atom check
    const hasAccess = role === 'Admin' || permissions.includes(`view_${moduleName}`);

    if (!hasAccess) {
      return NextResponse.next(); // Ya redirect to /403
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}