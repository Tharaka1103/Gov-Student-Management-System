import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

// Define protected routes and their allowed roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/director': ['director'],
  '/auditor': ['internal_auditor'],
  '/dashboard': ['admin', 'director', 'internal_auditor']
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/courses',
  '/institutions',
  '/unauthorized'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`Middleware: Processing ${pathname}`);
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isPublicRoute) {
    console.log(`Middleware: ${pathname} is public route, allowing access`);
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );
  
  if (protectedRoute) {
    console.log(`Middleware: ${pathname} is protected route (${protectedRoute})`);
    
    const token = request.cookies.get('auth-token')?.value;
    console.log(`Middleware: Token from cookies: ${token ? 'Found' : 'Not found'}`);
    
    if (!token) {
      console.log('Middleware: No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const payload = await verifyTokenEdge(token);
      if (!payload) {
        console.log('Middleware: Invalid token, redirecting to login');
        // Clear invalid cookie
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }
      
      console.log(`Middleware: Token valid for user: ${payload.email}, role: ${payload.role}`);
      
      const allowedRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes];
      if (!allowedRoles.includes(payload.role)) {
        console.log(`Middleware: Role ${payload.role} not allowed for ${protectedRoute}`);
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      console.log(`Middleware: Access granted for ${payload.role} to ${pathname}`);
    } catch (error) {
      console.error('Middleware: Token verification error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};