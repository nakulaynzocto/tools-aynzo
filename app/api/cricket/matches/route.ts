import { NextResponse } from 'next/server';
import { getCachedMatches } from '@/lib/tools/cricket/cache';

export async function GET() {
    try {
        const matches = await getCachedMatches();
        return NextResponse.json(matches);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
