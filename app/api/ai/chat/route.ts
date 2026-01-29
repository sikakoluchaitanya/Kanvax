'use server';

import { NextRequest, NextResponse } from 'next/server';
import { chat, ChatMessage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { messages, taskContext } = await request.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        const response = await chat(messages as ChatMessage[], taskContext);

        return NextResponse.json({ response });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to get AI response' },
            { status: 500 }
        );
    }
}
