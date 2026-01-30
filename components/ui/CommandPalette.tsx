'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Moon,
    Sun,
    Sparkles,
    CheckCircle2,
    Clock,
    ListTodo,
    Command,
    ArrowRight
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';

interface CommandItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    action: () => void;
    category: 'actions' | 'navigation' | 'tasks';
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const { setTheme, resolvedTheme } = useTheme();
    const { setIsAddingTask, tasks, setFilters } = useTaskStore();

    // Define available commands
    const commands: CommandItem[] = useMemo(() => [
        // Actions
        {
            id: 'new-task',
            icon: <Plus size={16} />,
            label: 'Create new task',
            shortcut: 'N',
            action: () => { setIsAddingTask(true); setIsOpen(false); },
            category: 'actions'
        },
        {
            id: 'brain-dump',
            icon: <Sparkles size={16} />,
            label: 'Open Brain Dump',
            action: () => {
                // Trigger brain dump button click
                document.querySelector<HTMLButtonElement>('button[title*="Brain Dump"]')?.click();
                setIsOpen(false);
            },
            category: 'actions'
        },
        {
            id: 'toggle-theme',
            icon: resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
            label: `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`,
            action: () => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); setIsOpen(false); },
            category: 'actions'
        },
        // Filters
        {
            id: 'filter-high',
            icon: <ListTodo size={16} className="text-red-500" />,
            label: 'Show high priority tasks',
            action: () => { setFilters({ priority: 'high' }); setIsOpen(false); },
            category: 'navigation'
        },
        {
            id: 'filter-todo',
            icon: <Clock size={16} className="text-indigo-500" />,
            label: 'Show To Do tasks',
            action: () => { setFilters({ status: 'todo' }); setIsOpen(false); },
            category: 'navigation'
        },
        {
            id: 'filter-done',
            icon: <CheckCircle2 size={16} className="text-emerald-500" />,
            label: 'Show completed tasks',
            action: () => { setFilters({ status: 'done' }); setIsOpen(false); },
            category: 'navigation'
        },
        {
            id: 'clear-filters',
            icon: <ArrowRight size={16} />,
            label: 'Clear all filters',
            action: () => { setFilters({ priority: 'all', status: 'all', search: '' }); setIsOpen(false); },
            category: 'navigation'
        },
        // Recent tasks as quick jump
        ...tasks.slice(0, 5).map(task => ({
            id: `task-${task.id}`,
            icon: task.status === 'done' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <ListTodo size={16} />,
            label: task.title,
            action: () => {
                useTaskStore.getState().setSelectedTask(task.id);
                useTaskStore.getState().setIsEditingTask(true);
                setIsOpen(false);
            },
            category: 'tasks' as const
        }))
    ], [resolvedTheme, setTheme, setIsAddingTask, setFilters, tasks]);

    // Filter commands based on search
    const filteredCommands = useMemo(() => {
        if (!search.trim()) return commands;
        const lowerSearch = search.toLowerCase();
        return commands.filter(cmd =>
            cmd.label.toLowerCase().includes(lowerSearch) ||
            cmd.category.toLowerCase().includes(lowerSearch)
        );
    }, [commands, search]);

    // Group by category
    const groupedCommands = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) groups[cmd.category] = [];
            groups[cmd.category].push(cmd);
        });
        return groups;
    }, [filteredCommands]);

    // Keyboard shortcut to open (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }

            // Quick shortcuts when palette is closed
            if (!isOpen && !e.metaKey && !e.ctrlKey) {
                const activeEl = document.activeElement;
                const isTyping = activeEl?.tagName === 'INPUT' ||
                    activeEl?.tagName === 'TEXTAREA' ||
                    (activeEl as HTMLElement)?.isContentEditable;

                if (e.key === 'n' && !isTyping) {
                    e.preventDefault();
                    setIsAddingTask(true);
                }
                if (e.key === '/' && !isTyping) {
                    e.preventDefault();
                    setIsOpen(true);
                }
            }

            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }

            // Navigate with arrows
            if (isOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(i - 1, 0));
                }
                if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                    e.preventDefault();
                    filteredCommands[selectedIndex].action();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, setIsAddingTask]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const categoryLabels: Record<string, string> = {
        actions: 'Actions',
        navigation: 'Navigation',
        tasks: 'Recent Tasks'
    };

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

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'fixed top-[20%] left-1/2 -translate-x-1/2 z-50',
                            'w-full max-w-lg',
                            'bg-card border border-border rounded-xl shadow-2xl overflow-hidden'
                        )}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-border">
                            <Search size={18} className="text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Type a command or search..."
                                className={cn(
                                    'flex-1 bg-transparent text-foreground',
                                    'placeholder:text-muted-foreground',
                                    'focus:outline-none'
                                )}
                            />
                            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                                <Command size={12} />K
                            </kbd>
                        </div>

                        {/* Commands List */}
                        <div className="max-h-[320px] overflow-y-auto p-2">
                            {Object.entries(groupedCommands).map(([category, items]) => (
                                <div key={category} className="mb-2">
                                    <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {categoryLabels[category] || category}
                                    </div>
                                    {items.map((cmd, idx) => {
                                        const globalIndex = filteredCommands.indexOf(cmd);
                                        return (
                                            <button
                                                key={cmd.id}
                                                onClick={cmd.action}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                className={cn(
                                                    'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg',
                                                    'text-sm text-left transition-colors',
                                                    globalIndex === selectedIndex
                                                        ? 'bg-accent text-white'
                                                        : 'text-foreground hover:bg-muted'
                                                )}
                                            >
                                                <span className={cn(
                                                    globalIndex === selectedIndex ? 'text-white' : 'text-muted-foreground'
                                                )}>
                                                    {cmd.icon}
                                                </span>
                                                <span className="flex-1 truncate">{cmd.label}</span>
                                                {cmd.shortcut && (
                                                    <kbd className={cn(
                                                        'px-1.5 py-0.5 text-xs rounded',
                                                        globalIndex === selectedIndex
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-muted text-muted-foreground'
                                                    )}>
                                                        {cmd.shortcut}
                                                    </kbd>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}

                            {filteredCommands.length === 0 && (
                                <div className="px-3 py-8 text-center text-muted-foreground">
                                    No commands found
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1 py-0.5 bg-muted rounded">↑↓</kbd> navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1 py-0.5 bg-muted rounded">↵</kbd> select
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1 py-0.5 bg-muted rounded">esc</kbd> close
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
