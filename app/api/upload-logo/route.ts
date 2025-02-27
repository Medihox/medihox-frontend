import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', fileName);
    
    // Save the file
    await writeFile(path, buffer);
    
    // Return the URL to the file
    return NextResponse.json({ 
      success: true, 
      fileName,
      url: `/uploads/${fileName}` 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Failed to upload file' }, { status: 500 });
  }
} 