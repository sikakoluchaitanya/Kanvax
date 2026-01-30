'use client';

import { motion, PanInfo } from 'framer-motion';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { Calendar, MoreHorizontal, Edit2, Trash2, GripVertical, Check, ListChecks } from 'lucide-react';
import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { PriorityBadge, TagBadge } from '@/components/ui/Badge';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface TaskCardSimpleProps {
    task: Task;
    index: number;
    isDragging: boolean;
    onDragStart: () => void;
    onDragEnd: (info: PanInfo) => void;
    onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

export function TaskCardSimple({
    task,
    index,
    isDragging,
    onDragStart,
    onDragEnd,
    onDrag
}: TaskCardSimpleProps) {
    const { setSelectedTask, setIsEditingTask, deleteTask, restoreTask } = useTaskStore();
    const [showMenu, setShowMenu] = useState(false);

    const isCompleted = task.status === 'done';

    // Calculate subtask progress
    const subtaskStats = useMemo(() => {
        const subtaskMatches = task.description.match(/\[([ xX])\]/g);
        const completedMatches = task.description.match(/\[([xX])\]/g);
        const total = subtaskMatches ? subtaskMatches.length : 0;
        const completed = completedMatches ? completedMatches.length : 0;
        return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
    }, [task.description]);

    const formatDueDate = (date: Date | null) => {
        if (!date) return null;
        const dueDate = new Date(date);

        if (isToday(dueDate)) {
            return { text: 'Today', className: isCompleted ? 'text-muted-foreground' : 'text-amber-500' };
        }
        if (isTomorrow(dueDate)) {
            return { text: 'Tomorrow', className: 'text-muted-foreground' };
        }
        if (isPast(dueDate) && !isCompleted) {
            return { text: format(dueDate, 'MMM d'), className: 'text-red-500' };
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

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={(e, info) => onDragEnd(info)}
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: isDragging ? 0.9 : 1,
                y: 0,
                scale: isDragging ? 1.05 : 1,
            }}
            transition={{ duration: 0.15 }}
            whileHover={!isDragging ? { scale: 1.02, y: -2 } : undefined}
            whileDrag={{
                scale: 1.05,
                rotate: 2,
                cursor: 'grabbing',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            style={{
                zIndex: isDragging ? 9999 : 'auto',
                position: isDragging ? 'relative' : 'static',
            }}
            className={cn(
                'group cursor-grab active:cursor-grabbing',
            )}
        >
            <Card
                variant="bordered"
                className={cn(
                    'p-4 transition-all duration-200 relative overflow-hidden',
                    'hover:shadow-lg hover:border-accent/30',
                    isDragging && 'shadow-2xl ring-2 ring-accent/30',
                    // Completed task styling
                    isCompleted && 'bg-muted/30 border-border/50'
                )}
            >
                {/* Completed overlay indicator */}
                {isCompleted && (
                    <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
                        <Check size={14} strokeWidth={3} />
                    </div>
                )}

                {/* Header with Drag Handle and Priority */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <GripVertical
                            size={14}
                            className={cn(
                                'text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors',
                                isCompleted && 'opacity-50'
                            )}
                        />
                        <div className={cn(isCompleted && 'opacity-60')}>
                            <PriorityBadge priority={task.priority} size="sm" />
                        </div>
                    </div>

                    {!isCompleted && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
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
                                        }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className={cn(
                                            'absolute right-0 top-8 z-[100] w-36',
                                            'bg-card border border-border rounded-lg shadow-lg overflow-hidden'
                                        )}
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
                    )}
                </div>

                {/* Title - Click to edit */}
                <h4
                    className={cn(
                        'font-medium text-foreground mb-2 line-clamp-2 pr-8 cursor-pointer hover:text-accent transition-colors',
                        isCompleted && 'line-through text-muted-foreground'
                    )}
                    onClick={handleEdit}
                >
                    {task.title}
                </h4>

                {/* Description with Markdown rendering */}
                {task.description && (
                    <div className={cn(
                        'text-sm text-muted-foreground mb-3 prose prose-sm dark:prose-invert max-w-none',
                        'prose-p:leading-snug prose-li:my-0 prose-ul:my-1',
                        isCompleted && 'line-through opacity-60'
                    )}>
                        <div className={subtaskStats.total > 0 ? "" : "line-clamp-2"}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {task.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Subtask Progress Indicator */}
                {subtaskStats.total > 0 && (
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
            </Card>
        </motion.div>
    );
}
