'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'accent' | 'success' | 'warning' | 'info' | 'muted';
}

const colorClasses = {
    accent: {
        bg: 'bg-accent/10',
        icon: 'text-accent',
    },
    success: {
        bg: 'bg-emerald-500/10',
        icon: 'text-emerald-500',
    },
    warning: {
        bg: 'bg-amber-500/10',
        icon: 'text-amber-500',
    },
    info: {
        bg: 'bg-indigo-500/10',
        icon: 'text-indigo-500',
    },
    muted: {
        bg: 'bg-muted',
        icon: 'text-muted-foreground',
    },
};

export function StatCard({ title, value, icon, color }: StatCardProps) {
    const classes = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex items-center gap-4 p-4 rounded-xl',
                'bg-card border border-border'
            )}
        >
            {/* Icon */}
            <div
                className={cn(
                    'flex items-center justify-center w-11 h-11 rounded-lg',
                    classes.bg
                )}
            >
                <span className={classes.icon}>{icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{title}</p>
                <span className="text-2xl font-semibold text-foreground">{value}</span>
            </div>
        </motion.div>
    );
}
