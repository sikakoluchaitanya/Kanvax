'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Target } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { isToday, isPast, isFuture } from 'date-fns';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    gradient: string;
    delay: number;
}

function AnimatedNumber({ value, delay }: { value: number; delay: number }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.2 }}
            >
                {value}
            </motion.span>
        </motion.span>
    );
}

function StatCard({ icon, label, value, color, gradient, delay }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
                'relative overflow-hidden rounded-xl p-4',
                'bg-card border border-border',
                'transition-shadow duration-200 hover:shadow-lg'
            )}
        >
            {/* Gradient background accent */}
            <div className={cn(
                'absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-20',
                gradient
            )} />

            <div className="relative flex items-center gap-4">
                <div className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl',
                    color
                )}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold text-foreground">
                        <AnimatedNumber value={value} delay={delay} />
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export function StatsCards() {
    const { tasks } = useTaskStore();

    const stats = useMemo(() => {
        const today = new Date();
        const completedToday = tasks.filter(t =>
            t.status === 'done' &&
            t.updatedAt &&
            isToday(new Date(t.updatedAt))
        ).length;

        const overdue = tasks.filter(t =>
            t.status !== 'done' &&
            t.dueDate &&
            isPast(new Date(t.dueDate)) &&
            !isToday(new Date(t.dueDate))
        ).length;

        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const totalTodo = tasks.filter(t => t.status === 'todo').length;

        return { completedToday, overdue, inProgress, totalTodo };
    }, [tasks]);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                icon={<Target size={22} className="text-white" />}
                label="To Do"
                value={stats.totalTodo}
                color="bg-indigo-500"
                gradient="bg-indigo-500"
                delay={0}
            />
            <StatCard
                icon={<Clock size={22} className="text-white" />}
                label="In Progress"
                value={stats.inProgress}
                color="bg-amber-500"
                gradient="bg-amber-500"
                delay={0.1}
            />
            <StatCard
                icon={<CheckCircle2 size={22} className="text-white" />}
                label="Completed Today"
                value={stats.completedToday}
                color="bg-emerald-500"
                gradient="bg-emerald-500"
                delay={0.2}
            />
            <StatCard
                icon={<AlertTriangle size={22} className="text-white" />}
                label="Overdue"
                value={stats.overdue}
                color="bg-red-500"
                gradient="bg-red-500"
                delay={0.3}
            />
        </div>
    );
}
