'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { Calendar, MoreHorizontal, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { PriorityBadge, TagBadge } from '@/components/ui/Badge';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Task } from '@/lib/types';

interface TaskCardDndProps {
    task: Task;
    index?: number;
    isDragging?: boolean;
    isHidden?: boolean;
}

export function TaskCardDnd({ task, index = 0, isDragging: isDraggingProp, isHidden }: TaskCardDndProps) {
    const { setSelectedTask, setIsEditingTask, deleteTask, restoreTask } = useTaskStore();
    const [showMenu, setShowMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const formatDueDate = (date: Date | null) => {
        if (!date) return null;
        const dueDate = new Date(date);

        if (isToday(dueDate)) {
            return { text: 'Today', className: 'text-amber-500' };
        }
        if (isTomorrow(dueDate)) {
            return { text: 'Tomorrow', className: 'text-muted-foreground' };
        }
        if (isPast(dueDate) && task.status !== 'done') {
            return { text: format(dueDate, 'MMM d'), className: 'text-red-500' };
        }
        return { text: format(dueDate, 'MMM d'), className: 'text-muted-foreground' };
    };

    const dueInfo = formatDueDate(task.dueDate);
    const isCurrentlyDragging = isDragging || isDraggingProp;

    const handleEdit = () => {
        setSelectedTask(task.id);
        setIsEditingTask(true);
        setShowMenu(false);
    };

    const handleDelete = () => {
        deleteTask(task.id);
        setShowMenu(false);
        toast('Task deleted', {
            description: task.title,
            action: {
                label: 'Undo',
                onClick: () => restoreTask(),
            },
            icon: <Trash2 size={16} />,
            duration: 5000,
        });
    };

    // Hide the original card while dragging (we show DragOverlay instead)
    if (isHidden) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 pointer-events-none"
            >
                <Card variant="bordered" className="p-4 border-dashed">
                    <div className="h-24" />
                </Card>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group touch-none',
                isCurrentlyDragging && 'z-50 opacity-50'
            )}
        >
            <Card
                variant="bordered"
                className={cn(
                    'p-4 transition-all duration-200',
                    'hover:shadow-md hover:border-border',
                    'cursor-grab active:cursor-grabbing',
                    isCurrentlyDragging && 'shadow-xl ring-2 ring-primary/30'
                )}
                {...attributes}
                {...listeners}
            >
                {/* Header with Priority and Menu */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {/* Drag Handle Icon */}
                        <GripVertical
                            size={14}
                            className="text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <PriorityBadge priority={task.priority} size="sm" />
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowMenu(!showMenu);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={cn(
                                'flex items-center justify-center w-7 h-7 rounded-md',
                                'text-muted-foreground hover:text-foreground hover:bg-muted',
                                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
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
                                    }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={cn(
                                        'absolute right-0 top-8 z-20 w-36',
                                        'bg-card border border-border rounded-lg shadow-lg overflow-hidden'
                                    )}
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit();
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
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
                </div>

                {/* Title - Click to edit */}
                <h4
                    className="font-medium text-foreground mb-2 line-clamp-2 pr-4 cursor-pointer hover:text-primary transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
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
                                +{task.tags.length - 3}
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
        </div>
    );
}
