import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import Blog from '@/lib/models/Blog';

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

export async function GET(req: Request, { params }: { params: { locale: string, slug: string } }) {
  try {
    await connectToDatabase();
    const { slug, locale } = params;
    const blog = await Blog.findOne({ slug, locale });
    
    if (blog) {
      return NextResponse.json(blog);
    } else {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { locale: string, slug: string } }) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { slug, locale } = params;
    const data = await req.json();

    const blog = await Blog.findOneAndUpdate(
      { slug, locale },
      data,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    revalidatePath(`/${locale}/blog/${slug}`);
    revalidatePath(`/${locale}/blog`);

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { locale: string, slug: string } }) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { slug, locale } = params;

    await Blog.findOneAndDelete({ slug, locale });

    revalidatePath(`/${locale}/blog`);

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
