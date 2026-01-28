'use client';

import { useDroppable } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TaskCardDnd } from './TaskCardDnd';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task, Status } from '@/lib/types';

interface TaskColumnDndProps {
    id: Status;
    title: string;
    emoji: string;
    tasks: Task[];
    activeId?: string | null;
}

const statusColors = {
    todo: {
        border: 'border-l-indigo-500',
        dot: 'bg-indigo-500',
        dropBg: 'bg-indigo-500/5',
    },
    'in-progress': {
        border: 'border-l-amber-500',
        dot: 'bg-amber-500',
        dropBg: 'bg-amber-500/5',
    },
    done: {
        border: 'border-l-emerald-500',
        dot: 'bg-emerald-500',
        dropBg: 'bg-emerald-500/5',
    },
};

export function TaskColumnDnd({ id, title, emoji, tasks, activeId }: TaskColumnDndProps) {
    const { setIsAddingTask } = useTaskStore();
    const { setNodeRef, isOver } = useDroppable({ id });
    const colors = statusColors[id];

    // Check if the active task is from a different column
    const isExternalDrag = activeId && !tasks.find(t => t.id === activeId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            ref={setNodeRef}
            className={cn(
                'flex flex-col min-h-[500px] rounded-xl',
                'bg-card/50 border border-border/60',
                'transition-all duration-200',
                isOver && isExternalDrag && [colors.dropBg, 'border-2 border-dashed scale-[1.01]']
            )}
        >
            {/* Column Header */}
            <div
                className={cn(
                    'flex items-center justify-between px-4 py-3',
                    'border-b border-border/60 border-l-4 rounded-t-xl',
                    colors.border
                )}
            >
                <div className="flex items-center gap-2.5">
                    <span className={cn('w-2.5 h-2.5 rounded-full', colors.dot)} />
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <span className="flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                        {tasks.length}
                    </span>
                </div>

                <button
                    onClick={() => setIsAddingTask(true)}
                    className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-lg',
                        'text-muted-foreground hover:text-foreground hover:bg-muted',
                        'transition-colors duration-200'
                    )}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={cn(
                                'flex flex-col items-center justify-center py-12 text-center',
                                'border-2 border-dashed border-border/40 rounded-lg',
                                isOver && 'border-primary/50 bg-primary/5'
                            )}
                        >
                            <span className="text-3xl mb-2">{emoji}</span>
                            <p className="text-sm text-muted-foreground">
                                {isOver ? 'Drop here!' : 'No tasks'}
                            </p>
                        </motion.div>
                    ) : (
                        tasks.map((task, index) => (
                            <TaskCardDnd
                                key={task.id}
                                task={task}
                                index={index}
                                isHidden={activeId === task.id}
                            />
                        ))
                    )}
                </SortableContext>

                {/* Drop zone indicator when dragging over */}
                {isOver && tasks.length > 0 && isExternalDrag && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 60 }}
                        className="border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 flex items-center justify-center text-sm text-muted-foreground"
                    >
                        Drop here
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
