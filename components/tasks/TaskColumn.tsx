'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task, Status } from '@/lib/types';

interface TaskColumnProps {
    status: Status;
    tasks: Task[];
}

const columnConfig = {
    todo: {
        title: 'To Do',
        emoji: '📋',
        borderClass: 'status-todo',
        dotColor: 'bg-status-todo',
    },
    'in-progress': {
        title: 'In Progress',
        emoji: '🚀',
        borderClass: 'status-progress',
        dotColor: 'bg-status-progress',
    },
    done: {
        title: 'Done',
        emoji: '✅',
        borderClass: 'status-done',
        dotColor: 'bg-status-done',
    },
};

export function TaskColumn({ status, tasks }: TaskColumnProps) {
    const { setIsAddingTask, moveTask } = useTaskStore();
    const config = columnConfig[status];

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-accent/5');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-accent/5');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-accent/5');
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            moveTask(taskId, status);

            // 🎉 Celebrate when task is completed!
            if (status === 'done') {
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#10b981', '#34d399', '#6ee7b7', '#a78bfa', '#c4b5fd']
                });
            }
        }
    };

    return (
        <div
            className={cn(
                'flex flex-col min-h-[600px] bg-secondary/30 rounded-xl p-4',
                'border border-border/50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className={cn('flex items-center justify-between mb-4 pb-3 border-b border-border pl-3', config.borderClass)}>
                <div className="flex items-center gap-2">
                    <span className={cn('w-2.5 h-2.5 rounded-full', config.dotColor)} />
                    <h3 className="font-semibold text-foreground">{config.title}</h3>
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                        {tasks.length}
                    </span>
                </div>

                <button
                    onClick={() => setIsAddingTask(true)}
                    className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-lg',
                        'text-muted-foreground hover:text-foreground hover:bg-secondary',
                        'transition-colors duration-200'
                    )}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {tasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-32 text-center"
                    >
                        <span className="text-3xl mb-2">{config.emoji}</span>
                        <p className="text-sm text-muted-foreground">No tasks yet</p>
                    </motion.div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('taskId', task.id);
                            }}
                        >
                            <TaskCard task={task} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
