'use server';

import { NextRequest, NextResponse } from 'next/server';
import { breakdownTask } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { title, description } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const breakdown = await breakdownTask(title, description || '');

        return NextResponse.json({ breakdown });
    } catch (error) {
        console.error('Breakdown API error:', error);
        return NextResponse.json(
            { error: 'Failed to break down task' },
            { status: 500 }
        );
    }
}
