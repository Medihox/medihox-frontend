import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cookies to check onboarding and authentication status
  const hasCompletedOnboarding = request.cookies.get("hasCompletedOnboarding")?.value;
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // If user is trying to access anything other than onboarding page and hasn't completed onboarding
  if (!hasCompletedOnboarding && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Only block access to admin and super-admin routes if not authenticated or not onboarded
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/super-admin");

  if (isAdminRoute) {
    // If the user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Optionally, check if the user role is valid (i.e., admin or super-admin)
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/forbidden", request.url)); // Forbidden route or any custom page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/admin/:path*", "/super-admin/:path*"], // Apply only to admin or super-admin routes
};
