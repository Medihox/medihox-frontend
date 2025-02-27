import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth cookies
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true";
  const userRole = request.cookies.get("userRole")?.value;
  const hasCompletedOnboarding = request.cookies.get("hasCompletedOnboarding")?.value === "true";
  
  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/onboarding"];
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  
  // Handle admin routes
  if (pathname.startsWith("/admin")) {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // If authenticated but wrong role, redirect to appropriate dashboard
    if (userRole && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  
  // If trying to access login when already authenticated, redirect to dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  
  // Prevent authenticated users from accessing onboarding
  if (pathname === "/onboarding" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
