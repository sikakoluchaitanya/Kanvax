'use client';

import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { Calendar, MoreHorizontal, Edit2, Trash2, ChevronRight, Check, Circle, CircleDot } from 'lucide-react';
import { useState } from 'react';
import { PriorityBadge, TagBadge } from '@/components/ui/Badge';
import { useTaskStore, useFilteredTasks } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Task, Status } from '@/lib/types';

export function TaskList() {
    const filteredTasks = useFilteredTasks();
    const { setSelectedTask, setIsEditingTask, deleteTask, moveTask } = useTaskStore();

    // Group tasks by status
    const groupedTasks = {
        todo: filteredTasks.filter((t) => t.status === 'todo'),
        'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
        done: filteredTasks.filter((t) => t.status === 'done'),
    };

    const statusLabels = {
        todo: { label: 'To Do', emoji: '📋' },
        'in-progress': { label: 'In Progress', emoji: '🚀' },
        done: { label: 'Done', emoji: '✅' },
    };

    return (
        <div className="space-y-6">
            {(Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map(
                (status) => (
                    <motion.div
                        key={status}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl shadow-soft border border-border overflow-hidden"
                    >
                        {/* Section Header */}
                        <div
                            className={cn(
                                'flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border',
                                status === 'todo' && 'border-l-4 border-l-indigo-500',
                                status === 'in-progress' && 'border-l-4 border-l-amber-500',
                                status === 'done' && 'border-l-4 border-l-emerald-500'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{statusLabels[status].emoji}</span>
                                <h3 className="font-semibold text-foreground">
                                    {statusLabels[status].label}
                                </h3>
                                <span className="flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                                    {groupedTasks[status].length}
                                </span>
                            </div>
                        </div>

                        {/* Task Rows */}
                        <div className="divide-y divide-border">
                            {groupedTasks[status].length === 0 ? (
                                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                                    No tasks in this section
                                </div>
                            ) : (
                                groupedTasks[status].map((task, index) => (
                                    <TaskRow
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        onEdit={() => {
                                            setSelectedTask(task.id);
                                            setIsEditingTask(true);
                                        }}
                                        onDelete={() => {
                                            if (confirm('Are you sure you want to delete this task?')) {
                                                deleteTask(task.id);
                                            }
                                        }}
                                        onStatusChange={(newStatus) =>
                                            moveTask(task.id, newStatus)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )
            )}
        </div>
    );
}

interface TaskRowProps {
    task: Task;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: Status) => void;
}

function TaskRow({ task, index, onEdit, onDelete, onStatusChange }: TaskRowProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    const getDueDateClass = () => {
        if (!task.dueDate || task.status === 'done') return 'text-muted-foreground';
        const dueDate = new Date(task.dueDate);
        if (isPast(dueDate) && !isToday(dueDate)) return 'text-red-500';
        if (isToday(dueDate)) return 'text-amber-500';
        return 'text-muted-foreground';
    };

    const formatDueDate = () => {
        if (!task.dueDate) return '-';
        const dueDate = new Date(task.dueDate);
        if (isToday(dueDate)) return 'Today';
        return format(dueDate, 'MMM d, yyyy');
    };

    // Get next status in cycle
    const getNextStatus = (): Status => {
        if (task.status === 'todo') return 'in-progress';
        if (task.status === 'in-progress') return 'done';
        return 'todo'; // done -> todo (cycle back)
    };

    const statusIcons = {
        todo: <Circle size={18} className="text-indigo-500" />,
        'in-progress': <CircleDot size={18} className="text-amber-500" />,
        done: <Check size={18} className="text-emerald-500" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
                'flex items-center gap-4 px-6 py-4',
                'hover:bg-muted/30 transition-colors duration-150 group',
                task.status === 'done' && 'bg-muted/20'
            )}
        >
            {/* Status Cycle Button with Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className={cn(
                        'flex items-center justify-center w-6 h-6 rounded-full',
                        'border-2 transition-all duration-200',
                        task.status === 'todo' && 'border-indigo-500 hover:bg-indigo-500/10',
                        task.status === 'in-progress' && 'border-amber-500 bg-amber-500/20 hover:bg-amber-500/30',
                        task.status === 'done' && 'border-emerald-500 bg-emerald-500 text-white'
                    )}
                    title="Change status"
                >
                    {task.status === 'done' && <Check size={14} strokeWidth={3} />}
                    {task.status === 'in-progress' && (
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                </button>

                {/* Status Dropdown */}
                {showStatusMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowStatusMenu(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute left-0 top-full mt-1 z-20 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                            <button
                                onClick={() => {
                                    onStatusChange('todo');
                                    setShowStatusMenu(false);
                                }}
                                className={cn(
                                    'flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted',
                                    task.status === 'todo' && 'bg-muted'
                                )}
                            >
                                <Circle size={14} className="text-indigo-500" />
                                To Do
                            </button>
                            <button
                                onClick={() => {
                                    onStatusChange('in-progress');
                                    setShowStatusMenu(false);
                                }}
                                className={cn(
                                    'flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted',
                                    task.status === 'in-progress' && 'bg-muted'
                                )}
                            >
                                <CircleDot size={14} className="text-amber-500" />
                                In Progress
                            </button>
                            <button
                                onClick={() => {
                                    onStatusChange('done');
                                    setShowStatusMenu(false);
                                }}
                                className={cn(
                                    'flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted',
                                    task.status === 'done' && 'bg-muted'
                                )}
                            >
                                <Check size={14} className="text-emerald-500" />
                                Done
                            </button>
                        </motion.div>
                    </>
                )}
            </div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4
                        className={cn(
                            'font-medium text-foreground truncate cursor-pointer hover:text-accent transition-colors',
                            task.status === 'done' && 'line-through text-muted-foreground'
                        )}
                        onClick={onEdit}
                    >
                        {task.title}
                    </h4>
                    {task.tags.slice(0, 2).map((tag) => (
                        <TagBadge key={tag.id} name={tag.name} color={tag.color} />
                    ))}
                    {task.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                            +{task.tags.length - 2}
                        </span>
                    )}
                </div>
                {task.description && (
                    <p className={cn(
                        'text-sm text-muted-foreground truncate max-w-lg',
                        task.status === 'done' && 'line-through opacity-60'
                    )}>
                        {task.description}
                    </p>
                )}
            </div>

            {/* Due Date */}
            <div
                className={cn(
                    'flex items-center gap-1.5 text-sm',
                    getDueDateClass(),
                    task.status === 'done' && 'opacity-50'
                )}
            >
                <Calendar size={14} />
                <span>{formatDueDate()}</span>
            </div>

            {/* Priority */}
            <div className={cn(task.status === 'done' && 'opacity-50')}>
                <PriorityBadge priority={task.priority} />
            </div>

            {/* Actions */}
            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-lg',
                        'text-muted-foreground hover:text-foreground hover:bg-muted',
                        'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                        showMenu && 'opacity-100 bg-muted'
                    )}
                >
                    <MoreHorizontal size={16} />
                </button>

                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-full mt-1 z-20 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                            <button
                                onClick={() => {
                                    onEdit();
                                    setShowMenu(false);
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-muted"
                            >
                                <Edit2 size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    onDelete();
                                    setShowMenu(false);
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
        </motion.div>
    );
}
