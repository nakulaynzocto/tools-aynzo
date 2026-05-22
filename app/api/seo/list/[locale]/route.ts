import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import ToolSEO from '@/lib/models/ToolSEO';
import { tools } from '@/lib/tools';

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

export async function GET(req: Request, { params }: { params: { locale: string } }) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { locale } = params;
    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';

    const query: any = { locale };
    if (category) {
      const categorySlugs = tools.filter(t => t.category === category).map(t => t.slug);
      query.toolSlug = { $in: categorySlugs };
    }
    if (search) {
      query.$or = [
        { toolSlug: { $regex: search, $options: 'i' } },
        { seoTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const seoData = await ToolSEO.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ toolSlug: 1 });
      
    const total = await ToolSEO.countDocuments(query);

    return NextResponse.json({
      data: seoData,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
