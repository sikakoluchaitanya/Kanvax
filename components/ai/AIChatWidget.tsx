'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hi! 👋 I'm your AI assistant. Ask me things like:\n• \"What should I work on first?\"\n• \"Help me plan my day\"\n• \"How can I be more productive?\""
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { tasks } = useTaskStore();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getTaskContext = () => {
        const todoTasks = tasks.filter(t => t.status === 'todo');
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

        let context = '';
        if (todoTasks.length > 0) {
            context += `TO DO:\n${todoTasks.map(t => `- ${t.title} (${t.priority} priority)`).join('\n')}\n\n`;
        }
        if (inProgressTasks.length > 0) {
            context += `IN PROGRESS:\n${inProgressTasks.map(t => `- ${t.title}`).join('\n')}`;
        }
        return context || 'No tasks currently.';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages.filter(m => m.id !== 'welcome'), userMessage].map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    taskContext: getTaskContext()
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'fixed bottom-6 right-6 z-50',
                    'w-14 h-14 rounded-full',
                    'bg-gradient-to-br from-violet-500 to-purple-600',
                    'text-white shadow-lg shadow-purple-500/30',
                    'flex items-center justify-center',
                    'hover:shadow-xl hover:shadow-purple-500/40 transition-shadow'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <MessageCircle size={24} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'fixed bottom-24 right-6 z-50',
                            'w-[360px] h-[480px]',
                            'bg-card border border-border rounded-2xl shadow-2xl',
                            'flex flex-col overflow-hidden'
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-border bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                                <p className="text-xs text-muted-foreground">Powered by Gemini</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        'flex',
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap',
                                            message.role === 'user'
                                                ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-md'
                                                : 'bg-muted text-foreground rounded-bl-md'
                                        )}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                            className="w-2 h-2 bg-violet-500 rounded-full"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                            className="w-2 h-2 bg-violet-500 rounded-full"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                            className="w-2 h-2 bg-violet-500 rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Action Chips */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {[
                                    { text: '📋 What\'s overdue?', prompt: 'Which of my tasks are overdue?' },
                                    { text: '🎯 Prioritize my day', prompt: 'Help me prioritize my tasks for today' },
                                    { text: '⚡ Quick wins', prompt: 'What are some quick tasks I can complete right now?' }
                                ].map((chip) => (
                                    <button
                                        key={chip.text}
                                        onClick={() => setInput(chip.prompt)}
                                        className={cn(
                                            'px-3 py-1.5 text-xs rounded-full',
                                            'bg-muted hover:bg-muted/80 border border-border',
                                            'text-muted-foreground hover:text-foreground',
                                            'transition-colors'
                                        )}
                                    >
                                        {chip.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className={cn(
                                        'flex-1 px-4 py-2.5 rounded-xl',
                                        'bg-muted border border-border text-foreground',
                                        'placeholder:text-muted-foreground',
                                        'focus:outline-none focus:ring-2 focus:ring-violet-500/30',
                                        'disabled:opacity-50'
                                    )}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        'w-11 h-11 rounded-xl',
                                        'bg-gradient-to-br from-violet-500 to-purple-600',
                                        'text-white flex items-center justify-center',
                                        'hover:opacity-90 transition-opacity',
                                        'disabled:opacity-50 disabled:cursor-not-allowed'
                                    )}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
