import { generateInsights, TaskData } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const tasks: TaskData[] = body.tasks || [];

        if (!tasks || tasks.length === 0) {
            return NextResponse.json({
                insights: "🚀 Welcome to your productivity dashboard! Add tasks to unlock personalized AI insights."
            });
        }

        // Use the shared Gemini function
        const insights = await generateInsights(tasks);
        return NextResponse.json({ insights });

    } catch (error) {
        console.error('AI Insights error:', error);
        // Provide a meaningful fallback with actual data
        try {
            const body = await request.clone().json();
            const tasks = body.tasks || [];
            const completed = tasks.filter((t: any) => t.status === 'done').length;
            const highPriority = tasks.filter((t: any) => t.priority === 'high' && t.status !== 'done').length;
            return NextResponse.json({
                insights: `You have ${completed}/${tasks.length} tasks completed. ${highPriority > 0 ? `Focus on your ${highPriority} high-priority items!` : 'Great job staying on top of things!'}`
            });
        } catch {
            return NextResponse.json({
                insights: "Keep making progress on your tasks! Every step counts."
            });
        }
    }
}
