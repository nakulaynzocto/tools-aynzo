import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully!',
        data: {
          id: newMessage._id,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error occurred.' },
      { status: 500 }
    );
  }
}
