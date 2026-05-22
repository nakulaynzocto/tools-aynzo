import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import ToolSEO from '@/lib/models/ToolSEO';

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
    const seoData = await ToolSEO.findOne({ toolSlug: slug, locale });
    
    if (seoData) {
      return NextResponse.json(seoData);
    } else {
      return NextResponse.json({ message: 'SEO data not found' }, { status: 404 });
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
    const { seoTitle, seoDescription, seoKeywords, pageH1, contentBody, faq } = await req.json();

    const seoData = await ToolSEO.findOneAndUpdate(
      { toolSlug: slug, locale },
      { seoTitle, seoDescription, seoKeywords, pageH1, contentBody, faq },
      { new: true, upsert: true, runValidators: true }
    );

    // Clear Next.js cache so changes are instantly visible
    revalidatePath(`/${locale}/tools/${slug}`);
    revalidatePath(`/tools/${slug}`); // Just in case primary locale

    return NextResponse.json(seoData);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
