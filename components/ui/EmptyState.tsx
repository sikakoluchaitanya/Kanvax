'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ListTodo, Sparkles, Plus, BarChart3, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    type: 'no-tasks' | 'all-done' | 'no-results' | 'no-analytics';
    onAction?: () => void;
}

const states = {
    'no-tasks': {
        icon: ListTodo,
        iconBg: 'from-violet-500 to-purple-600',
        title: 'No tasks yet',
        description: 'Get started by creating your first task or use Brain Dump to let AI help you!',
        actionLabel: 'Create Task',
    },
    'all-done': {
        icon: CheckCircle2,
        iconBg: 'from-emerald-500 to-green-600',
        title: 'All done! 🎉',
        description: "You've completed all your tasks. Time to celebrate or add more!",
        actionLabel: 'Add More Tasks',
    },
    'no-results': {
        icon: Sparkles,
        iconBg: 'from-amber-500 to-orange-600',
        title: 'No matching tasks',
        description: 'Try adjusting your filters or search query to find what you\'re looking for.',
        actionLabel: 'Clear Filters',
    },
    'no-analytics': {
        icon: BarChart3,
        iconBg: 'from-blue-500 to-cyan-600',
        title: 'No data yet',
        description: 'Start adding tasks to see your productivity analytics and insights.',
        actionLabel: 'Get Started',
    },
};

export function EmptyState({ type, onAction }: EmptyStateProps) {
    const state = states[type];
    const Icon = state.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className={cn(
                    'w-20 h-20 rounded-2xl flex items-center justify-center mb-6',
                    'bg-gradient-to-br shadow-lg',
                    state.iconBg
                )}
            >
                <Icon size={36} className="text-white" />
            </motion.div>

            {/* Floating particles decoration */}
            <div className="relative mb-4">
                <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-8 -left-12 w-3 h-3 rounded-full bg-violet-500/20"
                />
                <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute -top-4 -right-10 w-2 h-2 rounded-full bg-amber-500/30"
                />
                <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-2 -right-16 w-4 h-4 rounded-full bg-emerald-500/20"
                />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-foreground mb-2">
                {state.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground max-w-sm mb-6">
                {state.description}
            </p>

            {/* Action Button */}
            {onAction && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAction}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl',
                        'bg-gradient-to-r from-violet-600 to-purple-600',
                        'text-white font-medium shadow-lg shadow-violet-500/25',
                        'hover:shadow-xl hover:shadow-violet-500/30 transition-shadow'
                    )}
                >
                    <Plus size={18} />
                    {state.actionLabel}
                </motion.button>
            )}
        </motion.div>
    );
}

// Column-specific empty state (smaller version)
interface ColumnEmptyStateProps {
    status: 'todo' | 'in-progress' | 'done';
}

const columnStates = {
    'todo': {
        icon: ListTodo,
        message: 'No tasks to do',
        hint: 'Drag tasks here or create new ones',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
    'in-progress': {
        icon: Clock,
        message: 'Nothing in progress',
        hint: 'Move tasks here when you start working',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    'done': {
        icon: CheckCircle2,
        message: 'No completed tasks',
        hint: 'Complete tasks to see them here',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
};

export function ColumnEmptyState({ status }: ColumnEmptyStateProps) {
    const state = columnStates[status];
    const Icon = state.icon;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                'flex flex-col items-center justify-center py-8 px-4 rounded-xl',
                'border-2 border-dashed border-border/50',
                state.bg
            )}
        >
            <Icon size={24} className={cn(state.color, 'mb-2 opacity-50')} />
            <p className="text-sm font-medium text-muted-foreground mb-1">
                {state.message}
            </p>
            <p className="text-xs text-muted-foreground/70 text-center">
                {state.hint}
            </p>
        </motion.div>
    );
}
