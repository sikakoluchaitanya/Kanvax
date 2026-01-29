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