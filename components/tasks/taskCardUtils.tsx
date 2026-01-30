'use client';

import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useTaskStore } from '@/store/taskStore';
import type { Task } from '@/lib/types';

// Format due date with appropriate styling
export function formatDueDate(date: Date | null, isCompleted: boolean = false) {
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
}

// Calculate subtask progress from markdown checkboxes
export function useSubtaskStats(description: string) {
    return useMemo(() => {
        const subtaskMatches = description.match(/\[([ xX])\]/g);
        const completedMatches = description.match(/\[([xX])\]/g);
        const total = subtaskMatches ? subtaskMatches.length : 0;
        const completed = completedMatches ? completedMatches.length : 0;
        return { total, completed, percent: total > 0 ? (completed / total) * 100 : 0 };
    }, [description]);
}

// Hook for task card actions
export function useTaskCardActions(task: Task) {
    const { setSelectedTask, setIsEditingTask, deleteTask, restoreTask } = useTaskStore();

    const handleEdit = () => {
        setSelectedTask(task.id);
        setIsEditingTask(true);
    };

    const handleDelete = () => {
        deleteTask(task.id);
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

    return { handleEdit, handleDelete };
}
