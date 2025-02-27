import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  // Forward the request to the API
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Forward authorization header if it exists
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
    },
    cache: 'no-store',
  });
  
  // Get the response data
  const data = await response.json();
  
  // Return the response
  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json();
  
  // Forward the request to the API
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward authorization header if it exists
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
    },
    body: JSON.stringify(body),
  });
  
  // Get the response data
  const data = await response.json();
  
  // Return the response
  return NextResponse.json(data, {
    status: response.status,
  });
}

// Add similar functions for PUT, DELETE, etc.
export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const body = await request.json();
  
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
    },
    body: JSON.stringify(body),
  });
  
  const data = await response.json();
  
  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('Authorization') 
        ? { 'Authorization': request.headers.get('Authorization')! } 
        : {}),
    },
  });
  
  const data = await response.json();
  
  return NextResponse.json(data, {
    status: response.status,
  });
} 