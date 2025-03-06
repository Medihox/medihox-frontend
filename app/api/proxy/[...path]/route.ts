import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  // Get query string from the request URL
  const url = new URL(request.url);
  const queryString = url.search; // This includes the '?' character
  
  // Forward the request to the API with query parameters
  const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
    headers: {
      'Content-Type': 'application/json',
      // Forward authorization header if it exists
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
      'Cookie': request.headers.get('cookie') || '',
    },
    cache: 'no-store',
    credentials: 'include',
  });
  
  // Get the response data
  const data = await response.json();
  
  // Return the response
  const result = NextResponse.json(data, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      result.headers.append('Set-Cookie', value);
    }
  });

  return result;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json();
  
  // Get query string from the request URL
  const url = new URL(request.url);
  const queryString = url.search;
  
  // Forward the request to the API with query parameters
  const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward authorization header if it exists
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
      'Cookie': request.headers.get('cookie') || '',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  
  // Get the response data
  const data = await response.json();
  
  // Return the response
  const result = NextResponse.json(data, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      result.headers.append('Set-Cookie', value);
    }
  });

  return result;
}

// Add similar functions for PUT, DELETE, etc.
export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json();
  
  // Get query string from the request URL
  const url = new URL(request.url);
  const queryString = url.search;
  
  const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
      'Cookie': request.headers.get('cookie') || '',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  
  const data = await response.json();
  
  const result = NextResponse.json(data, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      result.headers.append('Set-Cookie', value);
    }
  });

  return result;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  // Get query string from the request URL
  const url = new URL(request.url);
  const queryString = url.search;
  
  const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
      'Cookie': request.headers.get('cookie') || '',
    },
    credentials: 'include',
  });
  
  const data = await response.json();
  
  const result = NextResponse.json(data, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      result.headers.append('Set-Cookie', value);
    }
  });

  return result;
} 