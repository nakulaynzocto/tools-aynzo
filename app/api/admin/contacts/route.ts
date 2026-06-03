import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';

function verifyAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    // Fetch all contact messages, sorted by latest first
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error occurred.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required.' }, { status: 400 });
    }

    await ContactMessage.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error occurred.' }, { status: 500 });
  }
}
