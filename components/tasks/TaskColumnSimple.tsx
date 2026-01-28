'use client';

import { motion, PanInfo } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TaskCardSimple } from './TaskCardSimple';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task, Status } from '@/lib/types';

interface TaskColumnSimpleProps {
    id: Status;
    title: string;
    emoji: string;
    tasks: Task[];
    draggingTask: string | null;
    isOver: boolean;
    onDragStart: (taskId: string) => void;
    onDragEnd: (taskId: string, info: PanInfo) => void;
    onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

const statusColors = {
    todo: {
        border: 'border-l-indigo-500',
        dot: 'bg-indigo-500',
        highlight: 'ring-2 ring-indigo-500/30 bg-indigo-500/5',
    },
    'in-progress': {
        border: 'border-l-amber-500',
        dot: 'bg-amber-500',
        highlight: 'ring-2 ring-amber-500/30 bg-amber-500/5',
    },
    done: {
        border: 'border-l-emerald-500',
        dot: 'bg-emerald-500',
        highlight: 'ring-2 ring-emerald-500/30 bg-emerald-500/5',
    },
};

export function TaskColumnSimple({
    id,
    title,
    emoji,
    tasks,
    draggingTask,
    isOver,
    onDragStart,
    onDragEnd,
    onDrag
}: TaskColumnSimpleProps) {
    const { setIsAddingTask } = useTaskStore();
    const colors = statusColors[id];

    // Check if the active task is from a different column
    const isExternalDrag = draggingTask && !tasks.find(t => t.id === draggingTask);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'flex flex-col min-h-[500px] rounded-xl',
                'bg-card/50 border border-border/60',
                'transition-all duration-200',
                isOver && isExternalDrag && [colors.highlight, 'scale-[1.01]']
            )}
            style={{ overflow: 'visible' }}
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
                        'transition-colors duration-150'
                    )}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Tasks Container */}
            <div
                className="flex-1 p-3 space-y-3"
                style={{ overflow: 'visible' }}
            >
                {tasks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                            'flex flex-col items-center justify-center py-12 text-center',
                            'border-2 border-dashed border-border/40 rounded-lg',
                            isOver && isExternalDrag && 'border-primary/50 bg-primary/5'
                        )}
                    >
                        <span className="text-3xl mb-2">{emoji}</span>
                        <p className="text-sm text-muted-foreground">
                            {isOver && isExternalDrag ? 'Drop here!' : 'No tasks'}
                        </p>
                    </motion.div>
                ) : (
                    tasks.map((task, index) => (
                        <TaskCardSimple
                            key={task.id}
                            task={task}
                            index={index}
                            isDragging={draggingTask === task.id}
                            onDragStart={() => onDragStart(task.id)}
                            onDragEnd={(info) => onDragEnd(task.id, info)}
                            onDrag={onDrag}
                        />
                    ))
                )}

                {/* Drop zone indicator */}
                {isOver && isExternalDrag && tasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 48 }}
                        className="border-2 border-dashed border-primary/50 rounded-lg bg-primary/5 flex items-center justify-center text-sm text-muted-foreground"
                    >
                        Drop here
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
