'use server';

import { NextRequest, NextResponse } from 'next/server';
import { enhanceDescription } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { title, description } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const enhanced = await enhanceDescription(title, description || '');

        return NextResponse.json({ enhanced });
    } catch (error) {
        console.error('Enhance API error:', error);
        return NextResponse.json(
            { error: 'Failed to enhance description' },
            { status: 500 }
        );
    }
}
