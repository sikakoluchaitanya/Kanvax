'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Sun,
    Moon,
    Plus,
    LayoutGrid,
    List,
    X,
    Sparkles,
    Menu,
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTaskStore } from '@/store/taskStore';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { BrainDumpModal } from '@/components/ai/BrainDumpModal';
import { cn } from '@/lib/utils';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
    const { setTheme, resolvedTheme } = useTheme();
    const { viewMode, setViewMode, filters, setFilters, setIsAddingTask } = useTaskStore();
    const { isMobile, setIsMobileOpen } = useSidebar();
    const [showSearch, setShowSearch] = useState(false);
    const [showBrainDump, setShowBrainDump] = useState(false);

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Left Section - Mobile Menu + Title */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    {isMobile && (
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className={cn(
                                'flex items-center justify-center w-9 h-9 rounded-lg',
                                'bg-muted/50 hover:bg-muted',
                                'text-muted-foreground hover:text-foreground',
                                'transition-colors duration-150'
                            )}
                        >
                            <Menu size={20} />
                        </button>
                    )}

                    <div className="flex flex-col">
                        <h1 className="text-base md:text-lg font-semibold text-foreground">
                            {title || `${getGreeting()} 👋`}
                        </h1>
                        {subtitle && (
                            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <AnimatePresence mode="wait">
                        {showSearch ? (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 260, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                <Search
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ search: e.target.value })}
                                    autoFocus
                                    className={cn(
                                        'w-full h-9 pl-9 pr-9 rounded-lg',
                                        'bg-muted/50 border border-border',
                                        'text-sm text-foreground placeholder:text-muted-foreground',
                                        'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring'
                                    )}
                                />
                                <button
                                    onClick={() => {
                                        setShowSearch(false);
                                        setFilters({ search: '' });
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setShowSearch(true)}
                                className={cn(
                                    'flex items-center justify-center w-9 h-9 rounded-lg',
                                    'bg-muted/50 hover:bg-muted',
                                    'text-muted-foreground hover:text-foreground',
                                    'transition-colors duration-150'
                                )}
                                title="Search"
                            >
                                <Search size={18} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* View Toggle */}
                    <div className="flex items-center p-1 rounded-lg bg-muted/50 border border-border">
                        <button
                            onClick={() => setViewMode('board')}
                            className={cn(
                                'flex items-center justify-center w-8 h-7 rounded-md transition-all duration-150',
                                viewMode === 'board'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="Board view"
                        >
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'flex items-center justify-center w-8 h-7 rounded-md transition-all duration-150',
                                viewMode === 'list'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                            title="List view"
                        >
                            <List size={15} />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-border" />

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            'flex items-center justify-center w-9 h-9 rounded-lg',
                            'bg-muted/50 hover:bg-muted',
                            'text-muted-foreground hover:text-foreground',
                            'transition-colors duration-150'
                        )}
                        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <AnimatePresence mode="wait">
                            {resolvedTheme === 'dark' ? (
                                <motion.div
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Sun size={18} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Moon size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Brain Dump Button */}
                    <button
                        onClick={() => setShowBrainDump(true)}
                        className={cn(
                            'flex items-center gap-2 h-9 px-3 md:px-4 rounded-lg',
                            'bg-gradient-to-r from-indigo-500 to-purple-600',
                            'hover:from-indigo-600 hover:to-purple-700',
                            'text-white font-medium text-sm',
                            'transition-all duration-150',
                            'shadow-sm hover:shadow-md',
                            'active:scale-[0.98]'
                        )}
                        title="Extract tasks from notes using AI"
                    >
                        <Sparkles size={16} />
                        <span className="hidden md:inline">Brain Dump</span>
                    </button>

                    {/* Add Task Button */}
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className={cn(
                            'flex items-center gap-2 h-9 px-3 md:px-4 rounded-lg',
                            'bg-accent hover:bg-accent/90',
                            'text-white font-medium text-sm',
                            'transition-all duration-150',
                            'shadow-sm hover:shadow-md',
                            'active:scale-[0.98]'
                        )}
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        <span className="hidden md:inline">Add Task</span>
                    </button>
                </div>
            </div>

            {/* Brain Dump Modal */}
            <BrainDumpModal
                isOpen={showBrainDump}
                onClose={() => setShowBrainDump(false)}
            />
        </header>
    );
}
