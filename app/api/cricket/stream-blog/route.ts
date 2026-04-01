import { NextRequest, NextResponse } from 'next/server';
import { generateMatchInsightsSummary } from '@/lib/tools/cricket/gemini';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { matchData } = body;

        if (!matchData) {
            return NextResponse.json({ error: 'Match Data required' }, { status: 400 });
        }

        // Use the highly stable REST summary engine
        const analysis = await generateMatchInsightsSummary(matchData);
        
        return NextResponse.json(analysis, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        });

    } catch (err: any) {
        return NextResponse.json({ error: `Process failed: ${err.message}` }, { status: 500 });
    }
}
