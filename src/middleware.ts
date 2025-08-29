import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Demo mode check - enable demo access when API routes are unavailable
function isDemoMode(req: NextRequest): boolean {
  // In Netlify environment, always enable demo mode for protected routes
  const isNetlify = process.env.NETLIFY === 'true' || 
                    req.headers.get('host')?.includes('netlify.app') ||
                    req.headers.get('x-forwarded-host')?.includes('netlify.app');
  
  // Demo mode cookies/headers check
  const demoAuth = req.cookies.get('demo-auth')?.value;
  const demoUser = req.cookies.get('demo-user')?.value;
  
  // In Netlify, enable demo mode automatically, otherwise check for explicit demo auth
  return isNetlify || (demoAuth === 'true' || !!demoUser);
}

export default withAuth(
  function middleware(req) {
    // Check if we're in demo mode
    if (isDemoMode(req)) {
      // Set demo authentication headers
      const response = NextResponse.next();
      response.headers.set('x-demo-mode', 'true');
      response.headers.set('x-demo-user', req.cookies.get('demo-user')?.value || 'demo-user');
      return response;
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define protected routes
        const protectedRoutes = [
          '/account',
          '/dashboard',
          '/history', 
          '/analytics',
          '/telehealth/appointments',
          '/emergency/contacts'
        ];
        
        const { pathname } = req.nextUrl;
        
        // Check if the current route is protected
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        );
        
        // If not a protected route, allow access
        if (!isProtectedRoute) {
          return true;
        }
        
        // Demo mode bypass for protected routes
        if (isDemoMode(req)) {
          return true;
        }
        
        // If it's a protected route and user is not authenticated
        if (isProtectedRoute && !token) {
          return false;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/account/:path*',
    '/dashboard/:path*',
    '/history/:path*',
    '/analytics/:path*',
    '/telehealth/appointments/:path*',
    '/emergency/contacts/:path*'
  ]
};