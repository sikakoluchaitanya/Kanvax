'use client';

import { motion } from 'framer-motion';
import { Filter, RotateCcw } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useTaskStore, defaultTags } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import type { Priority, Status } from '@/lib/types';

const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High', color: '#EF4444' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'low', label: 'Low', color: '#22C55E' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do', color: '#6366F1' },
    { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
    { value: 'done', label: 'Done', color: '#22C55E' },
];

export function TaskFilters() {
    const { filters, setFilters, resetFilters } = useTaskStore();

    const hasActiveFilters =
        filters.priority !== 'all' ||
        filters.status !== 'all' ||
        filters.tags.length > 0 ||
        filters.search.length > 0;

    const toggleTag = (tagId: string) => {
        const currentTags = filters.tags;
        if (currentTags.includes(tagId)) {
            setFilters({ tags: currentTags.filter((id) => id !== tagId) });
        } else {
            setFilters({ tags: [...currentTags, tagId] });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-border mb-6"
        >
            {/* Filter Icon & Label */}
            <div className="flex items-center gap-2 text-muted-foreground">
                <Filter size={15} />
                <span className="text-sm font-medium">Filters</span>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border" />

            {/* Priority Filter */}
            <Select
                options={priorityOptions}
                value={filters.priority}
                onChange={(value) => setFilters({ priority: value as Priority | 'all' })}
                placeholder="Priority"
                size="sm"
                className="w-32"
            />

            {/* Status Filter */}
            <Select
                options={statusOptions}
                value={filters.status}
                onChange={(value) => setFilters({ status: value as Status | 'all' })}
                placeholder="Status"
                size="sm"
                className="w-32"
            />

            {/* Tag Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {defaultTags.slice(0, 4).map((tag) => {
                    const isSelected = filters.tags.includes(tag.id);
                    return (
                        <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={cn(
                                'px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150',
                                'border',
                                isSelected
                                    ? 'border-transparent shadow-sm'
                                    : 'border-border bg-transparent opacity-60 hover:opacity-100'
                            )}
                            style={{
                                backgroundColor: isSelected ? `${tag.color}15` : 'transparent',
                                color: tag.color,
                                borderColor: isSelected ? tag.color : undefined,
                            }}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Reset Filters */}
            {hasActiveFilters && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <RotateCcw size={14} />
                        <span>Reset</span>
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}
