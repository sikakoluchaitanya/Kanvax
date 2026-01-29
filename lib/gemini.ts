import { GoogleGenAI } from '@google/genai';

// Initialize with API key from environment
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.Gemini_api || ''
});

export interface ExtractedTask {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    suggestedDueDate: string | null;
    suggestedTag: string | null;
}

export async function extractTasksFromText(rawText: string): Promise<ExtractedTask[]> {
    const prompt = `You are a task extraction AI assistant. Your job is to analyze raw text (meeting notes, brain dumps, emails, etc.) and extract actionable tasks.

For each task you identify, provide:
- title: A clear, actionable task title (start with a verb)
- description: Brief context if available, otherwise empty string
- priority: "high" (urgent/important), "medium" (normal), or "low" (can wait)
- suggestedDueDate: If a date/time is mentioned, extract it as a human-readable string (e.g., "Friday", "next week", "tomorrow"). Otherwise null.
- suggestedTag: Suggest ONE category tag that fits (e.g., "Development", "Design", "Marketing", "Personal", "Finance", "Meeting"). Otherwise null.

IMPORTANT RULES:
1. Only extract ACTIONABLE items (things that need to be done)
2. Ignore completed items or general statements
3. Be concise with titles - keep them under 10 words
4. Return ONLY a valid JSON array, no markdown, no explanation
5. If no tasks are found, return an empty array []

Raw text to analyze:
"""
${rawText}
"""

Return the JSON array of tasks:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.7
            }
        });

        const tasks: ExtractedTask[] = JSON.parse(response.text as string);
        return tasks;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to extract tasks. Please try again.');
    }
}

/**
 * Enhance a brief description into a more detailed, professional one
 */
export async function enhanceDescription(title: string, briefDescription: string): Promise<string> {
    const prompt = `You are a professional task description writer. Take the brief task info and enhance it into a clear, actionable description.

Task Title: "${title}"
Brief Description: "${briefDescription || 'No description provided'}"

Write an enhanced description that:
1. Is 2-3 sentences maximum
2. Clarifies the goal and expected outcome
3. Uses professional, clear language
4. Stays focused and actionable

Return ONLY the enhanced description text, no quotes, no explanation.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        return response.text?.trim() || briefDescription;
    } catch (error) {
        console.error('Gemini enhance error:', error);
        throw new Error('Failed to enhance description.');
    }
}

/**
 * Break down a task into smaller subtasks as a markdown checklist
 */
export async function breakdownTask(title: string, description: string): Promise<string> {
    const prompt = `You are a task breakdown expert. Break this task into 3-6 smaller, actionable subtasks.

Task: "${title}"
Context: "${description || 'No additional context'}"

Return ONLY a markdown checklist (no intro text) like:
- [ ] First subtask
- [ ] Second subtask
- [ ] Third subtask

Keep subtasks specific and actionable. Start each with a verb.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        return response.text?.trim() || '';
    } catch (error) {
        console.error('Gemini breakdown error:', error);
        throw new Error('Failed to break down task.');
    }
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * General AI chat for productivity assistance
 */
export async function chat(messages: ChatMessage[], taskContext?: string): Promise<string> {
    const systemPrompt = `You are a helpful productivity assistant for a task management app called Kanvax. 
${taskContext ? `The user currently has these tasks:\n${taskContext}\n\n` : ''}
Be concise, friendly, and actionable. Help users prioritize, plan, and stay productive.
If asked "what should I work on", give a specific recommendation based on priority and due dates.`;

    const formattedMessages = messages.map(m =>
        `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
    ).join('\n');

    const prompt = `${systemPrompt}\n\nConversation:\n${formattedMessages}\n\nAssistant:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.8 }
        });
        return response.text?.trim() || 'I apologize, I could not generate a response.';
    } catch (error) {
        console.error('Gemini chat error:', error);
        throw new Error('Failed to get AI response.');
    }
}

export interface TaskData {
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string | null;
}

/**
 * Generate personalized productivity insights based on task data
 */
export async function generateInsights(tasks: TaskData[]): Promise<string> {
    const now = new Date();
    const taskDetails = tasks.map(t => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate || null,
        isOverdue: t.dueDate && t.status !== 'done' && new Date(t.dueDate) < now
    }));

    const prompt = `You are a productivity coach analyzing a user's task data. Generate a personalized, encouraging insight.

USER'S TASKS:
${JSON.stringify(taskDetails, null, 2)}

TODAY: ${now.toLocaleDateString()}

Write 2-3 sentences that:
1. Mention at least ONE specific task title from the data above
2. Acknowledge completed tasks (status: "done")
3. Give ONE actionable suggestion for pending tasks

Be specific and reference actual task names! No bullet points or headers.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.9 }
        });
        return response.text?.trim() || 'Keep making progress on your tasks!';
    } catch (error) {
        console.error('Gemini insights error:', error);
        throw new Error('Failed to generate insights.');
    }
}