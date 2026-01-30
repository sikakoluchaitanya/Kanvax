'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const shortcuts = [
    {
        category: 'General', items: [
            { keys: ['⌘', 'K'], description: 'Open command palette' },
            { keys: ['N'], description: 'Create new task' },
            { keys: ['/'], description: 'Quick search' },
            { keys: ['?'], description: 'Show keyboard shortcuts' },
            { keys: ['Esc'], description: 'Close modal / Cancel' },
        ]
    },
    {
        category: 'Navigation', items: [
            { keys: ['↑', '↓'], description: 'Navigate in lists' },
            { keys: ['Enter'], description: 'Select / Confirm' },
        ]
    },
    {
        category: 'Task Actions', items: [
            { keys: ['Click + Drag'], description: 'Move task between columns' },
            { keys: ['Double Click'], description: 'Edit task' },
        ]
    },
];

export function KeyboardShortcutsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeEl = document.activeElement;
            const isTyping = activeEl?.tagName === 'INPUT' ||
                activeEl?.tagName === 'TEXTAREA' ||
                (activeEl as HTMLElement)?.isContentEditable;

            if (e.key === '?' && !isTyping && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'fixed top-[15%] left-1/2 -translate-x-1/2 z-50',
                            'w-full max-w-md',
                            'bg-card border border-border rounded-xl shadow-2xl overflow-hidden'
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                                    <Keyboard size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-foreground">Keyboard Shortcuts</h2>
                                    <p className="text-xs text-muted-foreground">Navigate faster with shortcuts</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <X size={18} className="text-muted-foreground" />
                            </button>
                        </div>

                        {/* Shortcuts List */}
                        <div className="p-4 max-h-[400px] overflow-y-auto space-y-4">
                            {shortcuts.map(category => (
                                <div key={category.category}>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                        {category.category}
                                    </h3>
                                    <div className="space-y-2">
                                        {category.items.map((shortcut, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                                            >
                                                <span className="text-sm text-foreground">
                                                    {shortcut.description}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {shortcut.keys.map((key, keyIdx) => (
                                                        <kbd
                                                            key={keyIdx}
                                                            className="px-2 py-1 text-xs font-medium bg-background border border-border rounded-md text-foreground"
                                                        >
                                                            {key}
                                                        </kbd>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-border bg-muted/30 text-center">
                            <span className="text-xs text-muted-foreground">
                                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">?</kbd> to toggle this modal
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
