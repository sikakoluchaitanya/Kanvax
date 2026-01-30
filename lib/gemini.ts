import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

// Initialize Gemini
const geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.Gemini_api || ''
});

// Initialize Groq as fallback
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

// Constants
const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL = 'moonshotai/kimi-k2-instruct'; // Fast & capable

/**
 * Check if error is a rate limit error (429)
 */
function isRateLimitError(error: unknown): boolean {
    if (error && typeof error === 'object') {
        const err = error as { status?: number; message?: string };
        return err.status === 429 || (err.message?.includes('429') ?? false) || (err.message?.includes('quota') ?? false);
    }
    return false;
}

/**
 * Generate content with Groq (fallback)
 */
async function generateWithGroq(prompt: string, temperature: number = 0.7, jsonMode: boolean = false): Promise<string> {
    console.log('⚡ Using Groq fallback...');
    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        ...(jsonMode && { response_format: { type: 'json_object' } })
    });
    return response.choices[0]?.message?.content || '';
}

/**
 * Generate content with Gemini, fallback to Groq on rate limit
 */
async function generateWithFallback(
    prompt: string,
    options: { temperature?: number; jsonMode?: boolean } = {}
): Promise<string> {
    const { temperature = 0.7, jsonMode = false } = options;

    try {
        // Try Gemini first
        const response = await geminiAI.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                temperature,
                ...(jsonMode && { responseMimeType: 'application/json' })
            }
        });
        return response.text?.trim() || '';
    } catch (error) {
        // If rate limited, fallback to Groq
        if (isRateLimitError(error)) {
            console.warn('⚠️ Gemini rate limited, falling back to Groq...');
            return generateWithGroq(prompt, temperature, jsonMode);
        }
        // Re-throw non-rate-limit errors
        throw error;
    }
}

// ============================================
// EXPORTED FUNCTIONS
// ============================================

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
        const responseText = await generateWithFallback(prompt, { temperature: 0.7, jsonMode: true });

        // Handle potential markdown code blocks from Groq
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7);
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3);
        }
        jsonText = jsonText.trim();

        const tasks: ExtractedTask[] = JSON.parse(jsonText);
        return tasks;
    } catch (error) {
        console.error('Task extraction error:', error);
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
        return await generateWithFallback(prompt, { temperature: 0.7 });
    } catch (error) {
        console.error('Enhance description error:', error);
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
        return await generateWithFallback(prompt, { temperature: 0.7 });
    } catch (error) {
        console.error('Breakdown task error:', error);
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
        const response = await generateWithFallback(prompt, { temperature: 0.8 });
        return response || 'I apologize, I could not generate a response.';
    } catch (error) {
        console.error('Chat error:', error);
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
        const response = await generateWithFallback(prompt, { temperature: 0.9 });
        return response || 'Keep making progress on your tasks!';
    } catch (error) {
        console.error('Insights error:', error);
        throw new Error('Failed to generate insights.');
    }
}