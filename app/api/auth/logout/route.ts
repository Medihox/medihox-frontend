import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Get the cookie store
    const cookieStore = cookies();
    
    // Clear all possible auth-related cookies
    cookieStore.delete('token');
    cookieStore.delete('refreshToken');
    cookieStore.delete('accessToken');
    cookieStore.delete('auth');
    cookieStore.delete('session');
    cookieStore.delete('user');
    cookieStore.delete('authenticated');
    
    // Create response with proper headers to clear cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Add cookie clearing headers one by one
    response.headers.set('Set-Cookie', 'token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');
    response.headers.append('Set-Cookie', 'refreshToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');
    response.headers.append('Set-Cookie', 'accessToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');
    response.headers.append('Set-Cookie', 'auth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');
    response.headers.append('Set-Cookie', 'session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');
    
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
} 