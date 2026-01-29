import { NextRequest, NextResponse } from 'next/server';
import { extractTasksFromText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        if (text.length > 10000) {
            return NextResponse.json(
                { error: 'Text is too long. Maximum 10,000 characters.' },
                { status: 400 }
            );
        }

        const tasks = await extractTasksFromText(text);

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Task extraction error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to extract tasks' },
            { status: 500 }
        );
    }
}
