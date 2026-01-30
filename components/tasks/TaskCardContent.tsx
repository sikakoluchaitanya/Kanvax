'use client';

import { motion } from 'framer-motion';
import { Calendar, MoreHorizontal, Edit2, Trash2, GripVertical, Check, ListChecks } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PriorityBadge, TagBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { formatDueDate, useSubtaskStats, useTaskCardActions } from './taskCardUtils';
import type { Task } from '@/lib/types';

interface TaskCardContentProps {
    task: Task;
    showDragHandle?: boolean;
    showCompletedOverlay?: boolean;
    showMarkdown?: boolean;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    className?: string;
}

export function TaskCardContent({
    task,
    showDragHandle = false,
    showCompletedOverlay = true,
    showMarkdown = false,
    onMenuOpen,
    onMenuClose,
    className,
}: TaskCardContentProps) {
    const [showMenu, setShowMenu] = useState(false);
    const { handleEdit, handleDelete } = useTaskCardActions(task);
    const subtaskStats = useSubtaskStats(task.description);

    const isCompleted = task.status === 'done';
    const dueInfo = formatDueDate(task.dueDate, isCompleted);

    const onEdit = () => {
        handleEdit();
        setShowMenu(false);
        onMenuClose?.();
    };

    const onDelete = () => {
        handleDelete();
        setShowMenu(false);
        onMenuClose?.();
    };

    const toggleMenu = () => {
        const newState = !showMenu;
        setShowMenu(newState);
        if (newState) onMenuOpen?.();
        else onMenuClose?.();
    };

    return (
        <div className={cn('relative', className)}>
            {/* Completed overlay indicator */}
            {showCompletedOverlay && isCompleted && (
                <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white z-10">
                    <Check size={14} strokeWidth={3} />
                </div>
            )}

            {/* Header with Priority and Menu */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {showDragHandle && (
                        <GripVertical
                            size={14}
                            className={cn(
                                'text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors',
                                isCompleted && 'opacity-50'
                            )}
                        />
                    )}
                    <div className={cn(isCompleted && 'opacity-60')}>
                        <PriorityBadge priority={task.priority} size="sm" />
                    </div>
                </div>

                {!isCompleted && (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu();
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={cn(
                                'flex items-center justify-center w-7 h-7 rounded-md',
                                'text-muted-foreground hover:text-foreground hover:bg-muted',
                                'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                                showMenu && 'opacity-100 bg-muted'
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
                                        onMenuClose?.();
                                    }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn(
                                        'absolute right-0 top-8 z-[100] w-36',
                                        'bg-card border border-border rounded-lg shadow-lg overflow-hidden'
                                    )}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit();
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete();
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-muted"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Title */}
            <h4
                className={cn(
                    'font-medium text-foreground mb-2 line-clamp-2 pr-8 cursor-pointer hover:text-accent transition-colors',
                    isCompleted && 'line-through text-muted-foreground'
                )}
                onClick={onEdit}
                onPointerDown={(e) => e.stopPropagation()}
            >
                {task.title}
            </h4>

            {/* Description */}
            {task.description && (
                <div className={cn(
                    'text-sm text-muted-foreground mb-3',
                    isCompleted && 'line-through opacity-60',
                    showMarkdown && 'prose prose-sm dark:prose-invert max-w-none prose-p:leading-snug prose-li:my-0 prose-ul:my-1'
                )}>
                    {showMarkdown ? (
                        <div className={subtaskStats.total > 0 ? "" : "line-clamp-2"}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {task.description}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="line-clamp-2">{task.description}</p>
                    )}
                </div>
            )}

            {/* Subtask Progress Indicator */}
            {showMarkdown && subtaskStats.total > 0 && (
                <div className="mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <ListChecks size={10} />
                            <span>{subtaskStats.completed}/{subtaskStats.total} Subtasks</span>
                        </div>
                        <span>{Math.round(subtaskStats.percent)}%</span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${subtaskStats.percent}%` }}
                            className="h-full bg-accent"
                        />
                    </div>
                </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
                <div className={cn(
                    'flex flex-wrap gap-1.5 mb-3',
                    isCompleted && 'opacity-60'
                )}>
                    {task.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                    ))}
                    {task.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                            +{task.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer with Due Date */}
            {dueInfo && (
                <div className={cn(
                    'flex items-center gap-1.5 text-xs',
                    dueInfo.className,
                    isCompleted && 'opacity-50'
                )}>
                    <Calendar size={12} />
                    <span className={cn(isCompleted && 'line-through')}>{dueInfo.text}</span>
                </div>
            )}
        </div>
    );
}
