'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, Check, AlertCircle, Flag, Tag as TagIcon, Calendar } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ExtractedTask } from '@/lib/gemini';

interface BrainDumpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BrainDumpModal({ isOpen, onClose }: BrainDumpModalProps) {
    const [rawText, setRawText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'input' | 'preview'>('input');

    const { addTask, tags } = useTaskStore();

    const handleExtract = async () => {
        if (!rawText.trim()) {
            setError('Please enter some text to analyze');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/extract-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: rawText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to extract tasks');
            }

            if (data.tasks.length === 0) {
                setError('No actionable tasks found in the text. Try adding more details.');
                return;
            }

            setExtractedTasks(data.tasks);
            setSelectedTasks(new Set(data.tasks.map((_: ExtractedTask, i: number) => i)));
            setStep('preview');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTask = (index: number) => {
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedTasks(newSelected);
    };

    const handleCreateTasks = () => {
        const tasksToCreate = extractedTasks.filter((_, i) => selectedTasks.has(i));

        tasksToCreate.forEach((task) => {
            // Try to match suggested tag with existing tags
            const matchedTag = tags.find(
                t => t.name.toLowerCase() === task.suggestedTag?.toLowerCase()
            );

            addTask({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: 'todo',
                dueDate: null, // Could parse suggestedDueDate if needed
                tags: matchedTag ? [matchedTag] : [],
            });
        });

        toast.success(`Created ${tasksToCreate.length} tasks from your notes! 🎉`);
        handleClose();
    };

    const handleClose = () => {
        setRawText('');
        setExtractedTasks([]);
        setSelectedTasks(new Set());
        setError(null);
        setStep('input');
        onClose();
    };

    const handleBack = () => {
        setStep('input');
        setExtractedTasks([]);
        setSelectedTasks(new Set());
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">Brain Dump</h2>
                            <p className="text-xs text-muted-foreground">
                                {step === 'input' ? 'Paste your notes, AI extracts the tasks' : 'Review extracted tasks'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === 'input' ? (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <textarea
                                    value={rawText}
                                    onChange={(e) => setRawText(e.target.value)}
                                    placeholder="Paste your meeting notes, brain dump, email, or any text with action items...

Example:
'Had a call with the design team. Need to update the homepage hero section by Friday. Also, John mentioned we should optimize our database queries - it's becoming urgent. Don't forget to schedule the marketing sync for next week.'"
                                    className="w-full h-64 p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 text-foreground placeholder:text-muted-foreground/50"
                                />

                                {error && (
                                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleExtract}
                                        disabled={isLoading || !rawText.trim()}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all",
                                            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
                                            "hover:from-indigo-600 hover:to-purple-700",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Analyzing with AI...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={18} />
                                                Extract Tasks
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <p className="text-sm text-muted-foreground mb-4">
                                    AI found <span className="font-medium text-foreground">{extractedTasks.length} tasks</span>.
                                    Select which ones to add:
                                </p>

                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {extractedTasks.map((task, index) => (
                                        <div
                                            key={index}
                                            onClick={() => toggleTask(index)}
                                            className={cn(
                                                "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                                                selectedTasks.has(index)
                                                    ? "bg-indigo-500/5 border-indigo-500/30"
                                                    : "bg-muted/30 border-border hover:border-muted-foreground/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex items-center justify-center w-5 h-5 rounded border-2 mt-0.5 transition-colors",
                                                selectedTasks.has(index)
                                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                                    : "border-muted-foreground/30"
                                            )}>
                                                {selectedTasks.has(index) && <Check size={12} />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-foreground">{task.title}</h4>
                                                {task.description && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className={cn(
                                                        "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                                                        task.priority === 'high' && "bg-red-500/10 text-red-500",
                                                        task.priority === 'medium' && "bg-amber-500/10 text-amber-500",
                                                        task.priority === 'low' && "bg-blue-500/10 text-blue-500"
                                                    )}>
                                                        <Flag size={10} />
                                                        {task.priority}
                                                    </span>
                                                    {task.suggestedTag && (
                                                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                            <TagIcon size={10} />
                                                            {task.suggestedTag}
                                                        </span>
                                                    )}
                                                    {task.suggestedDueDate && (
                                                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                            <Calendar size={10} />
                                                            {task.suggestedDueDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-border">
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleCreateTasks}
                                        disabled={selectedTasks.size === 0}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all",
                                            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
                                            "hover:from-indigo-600 hover:to-purple-700",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        <Check size={18} />
                                        Add {selectedTasks.size} Tasks
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
}
