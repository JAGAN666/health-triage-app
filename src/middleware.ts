import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
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