import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cookies to check onboarding and authentication status
  const hasCompletedOnboarding = request.cookies.get("hasCompletedOnboarding")?.value;
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true";
  const userRole = request.cookies.get("userRole")?.value;

  // If user is authenticated but trying to access login or home page, redirect to dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
    // Redirect based on role
    if (userRole === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/super-admin/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // If user is trying to access anything other than onboarding page and hasn't completed onboarding
  if (!hasCompletedOnboarding && 
      pathname !== "/onboarding" && 
      pathname !== "/login" && 
      !pathname.startsWith("/api/")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Only block access to admin and super-admin routes if not authenticated or not onboarded
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/super-admin");

  if (isAdminRoute) {
    // If the user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check user roles for specific routes
    if (pathname.startsWith("/super-admin") && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }

    if (pathname.startsWith("/admin") && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  // Role-based access control
  if (isAuthenticated) {
    // Super Admin can access everything
    if (userRole === "SUPER_ADMIN") {
      return NextResponse.next();
    }
    
    // Admin can access admin routes and dashboard but not super-admin routes
    if (userRole === "ADMIN") {
      if (pathname.startsWith("/super-admin")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }
    
    // Employee can only access dashboard
    if (userRole === "EMPLOYEE") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/super-admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/admin/:path*", "/super-admin/:path*", "/login", "/onboarding", "/dashboard/:path*", "/settings/:path*"],
};
