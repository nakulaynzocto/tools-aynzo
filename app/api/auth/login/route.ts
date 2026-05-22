import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const { email, password } = await req.json();

    const admin = await AdminUser.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
      }
      const token = jwt.sign({ id: admin._id }, secret, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
      });

      const response = NextResponse.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      });

      response.cookies.set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
