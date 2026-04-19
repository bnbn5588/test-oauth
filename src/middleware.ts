import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";

interface NextRequestWithAuth extends NextRequest {
  nextauth?: {
    token: JWT | null;
  };
}

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth?.token;
    const pathname = req.nextUrl.pathname;

    // If user is authenticated
    if (token) {
      // Redirect authenticated users away from auth pages to dashboard
      if (
        pathname === "/" ||
        pathname === "/auth/login" ||
        pathname === "/auth/register"
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // If user is not authenticated, they'll be redirected by withAuth to /auth/login
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Protect dashboard routes - require authentication
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/account") || pathname === "/api/auth/me") {
          return !!token; // Only allow if token exists
        }

        // Allow access to public routes and auth pages
        return true;
      },
    },
    pages: {
      signIn: "/auth/login", // Redirect unauthenticated users to login
    },
  },
);

// Apply middleware to all routes
export const config = {
  matcher: [
    "/", // Root page
    "/dashboard/:path*", // Dashboard routes
    "/account/:path*", // Account routes
    "/auth/:path*", // Auth pages (login, register)
    "/api/auth/me", // Protected API endpoint
  ],
};
