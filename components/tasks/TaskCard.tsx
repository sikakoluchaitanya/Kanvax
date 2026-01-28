'use client';

import { motion } from 'framer-motion';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { Calendar, MoreHorizontal, Clock, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { PriorityBadge, TagBadge } from '@/components/ui/Badge';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface TaskCardProps {
    task: Task;
    isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
    const { setSelectedTask, setIsEditingTask, deleteTask } = useTaskStore();
    const [showMenu, setShowMenu] = useState(false);

    const formatDueDate = (date: Date | null) => {
        if (!date) return null;
        const dueDate = new Date(date);

        if (isToday(dueDate)) {
            return { text: 'Today', className: 'text-status-progress' };
        }
        if (isTomorrow(dueDate)) {
            return { text: 'Tomorrow', className: 'text-muted-foreground' };
        }
        if (isPast(dueDate) && task.status !== 'done') {
            return { text: format(dueDate, 'MMM d'), className: 'text-destructive' };
        }
        return { text: format(dueDate, 'MMM d'), className: 'text-muted-foreground' };
    };

    const dueInfo = formatDueDate(task.dueDate);

    const handleEdit = () => {
        setSelectedTask(task.id);
        setIsEditingTask(true);
        setShowMenu(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
        }
        setShowMenu(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: isDragging ? 1 : 1.02 }}
            className={cn(isDragging && 'opacity-50')}
        >
            <Card
                variant="bordered"
                hover={!isDragging}
                className={cn(
                    'p-4 cursor-pointer group',
                    isDragging && 'ring-2 ring-accent shadow-lg'
                )}
                onClick={() => {
                    setSelectedTask(task.id);
                    setIsEditingTask(true);
                }}
            >
                {/* Header with Priority and Menu */}
                <div className="flex items-start justify-between mb-3">
                    <PriorityBadge priority={task.priority} size="sm" />

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className={cn(
                                'flex items-center justify-center w-7 h-7 rounded-md',
                                'text-muted-foreground hover:text-foreground hover:bg-secondary',
                                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                                showMenu && 'opacity-100 bg-secondary'
                            )}
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                    }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn(
                                        'absolute right-0 top-8 z-20 w-36',
                                        'bg-card border border-border rounded-lg shadow-lg overflow-hidden'
                                    )}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit();
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-secondary"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-destructive hover:bg-secondary"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                    {task.title}
                </h4>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                    </p>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {task.tags.slice(0, 3).map((tag) => (
                            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                        ))}
                        {task.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                                +{task.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer with Due Date */}
                {dueInfo && (
                    <div className={cn('flex items-center gap-1.5 text-xs', dueInfo.className)}>
                        <Calendar size={12} />
                        <span>{dueInfo.text}</span>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
