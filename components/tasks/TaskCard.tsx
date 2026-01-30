'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { TaskCardContent } from './TaskCardContent';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface TaskCardProps {
    task: Task;
    isDragging?: boolean;
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
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
            >
                <TaskCardContent
                    task={task}
                    showDragHandle={false}
                    showCompletedOverlay={false}
                    showMarkdown={false}
                />
            </Card>
        </motion.div>
    );
}
