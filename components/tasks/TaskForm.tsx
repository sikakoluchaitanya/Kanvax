'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { TagBadge } from '@/components/ui/Badge';
import { useTaskStore, defaultTags } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Priority, Status, Tag, TaskFormData } from '@/lib/types';

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    taskId?: string | null;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'high', label: 'High', color: 'priority-high' },
    { value: 'medium', label: 'Medium', color: 'priority-medium' },
    { value: 'low', label: 'Low', color: 'priority-low' },
];

const statusOptions: { value: Status; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

export function TaskForm({ isOpen, onClose, taskId }: TaskFormProps) {
    const { tasks, tags, addTask, updateTask } = useTaskStore();

    const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null;
    const isEditing = !!existingTask;

    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: null,
        tags: [],
    });

    const [errors, setErrors] = useState<{ title?: string }>({});

    // Reset form when task changes
    useEffect(() => {
        if (existingTask) {
            setFormData({
                title: existingTask.title,
                description: existingTask.description,
                priority: existingTask.priority,
                status: existingTask.status,
                dueDate: existingTask.dueDate,
                tags: existingTask.tags,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                dueDate: null,
                tags: [],
            });
        }
        setErrors({});
    }, [existingTask, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            setErrors({ title: 'Title is required' });
            return;
        }

        if (isEditing && taskId) {
            updateTask(taskId, formData);
            toast.success('Task updated', {
                description: formData.title,
            });
        } else {
            addTask(formData);
            toast.success('Task created', {
                description: formData.title,
            });
        }

        onClose();
    };

    const toggleTag = (tag: Tag) => {
        const hasTag = formData.tags.some((t) => t.id === tag.id);
        if (hasTag) {
            setFormData({
                ...formData,
                tags: formData.tags.filter((t) => t.id !== tag.id),
            });
        } else {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag],
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Task' : 'Create New Task'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title" required>
                        Task Title
                    </Label>
                    <Input
                        id="title"
                        placeholder="What needs to be done?"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            if (errors.title) setErrors({});
                        }}
                        error={errors.title}
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Add more details about this task..."
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                    />
                </div>

                {/* Priority & Status Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Priority */}
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <div className="flex gap-2">
                            {priorityOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, priority: option.value })
                                    }
                                    className={cn(
                                        'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                        'border',
                                        formData.priority === option.value
                                            ? cn(option.color, 'border-transparent')
                                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value as Status })
                            }
                            className={cn(
                                'w-full h-10 px-3 rounded-lg',
                                'bg-card border border-input text-foreground',
                                'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent'
                            )}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={
                            formData.dueDate
                                ? format(new Date(formData.dueDate), 'yyyy-MM-dd')
                                : ''
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                dueDate: e.target.value ? new Date(e.target.value) : null,
                            })
                        }
                    />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                        {defaultTags.map((tag) => {
                            const isSelected = formData.tags.some((t) => t.id === tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                                        isSelected
                                            ? 'ring-2 ring-offset-2 ring-offset-background scale-105'
                                            : 'opacity-60 hover:opacity-100'
                                    )}
                                    style={{
                                        backgroundColor: `${tag.color}20`,
                                        color: tag.color,
                                        ...(isSelected && { ringColor: tag.color }),
                                    }}
                                >
                                    {tag.name}
                                </button>
                            );
                        })}
                    </div>
                    {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="text-xs text-muted-foreground">Selected:</span>
                            {formData.tags.map((tag) => (
                                <TagBadge
                                    key={tag.id}
                                    name={tag.name}
                                    color={tag.color}
                                    onRemove={() => toggleTag(tag)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="accent">
                        {isEditing ? 'Save Changes' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
