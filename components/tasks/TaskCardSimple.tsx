'use client';

import { motion, PanInfo } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { TaskCardContent } from './TaskCardContent';
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
    const isCompleted = task.status === 'done';

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
            className="group cursor-grab active:cursor-grabbing"
        >
            <Card
                variant="bordered"
                className={cn(
                    'p-4 transition-all duration-200 relative overflow-hidden',
                    'hover:shadow-lg hover:border-accent/30',
                    isDragging && 'shadow-2xl ring-2 ring-accent/30',
                    isCompleted && 'bg-muted/30 border-border/50'
                )}
            >
                <TaskCardContent
                    task={task}
                    showDragHandle={true}
                    showCompletedOverlay={true}
                    showMarkdown={true}
                />
            </Card>
        </motion.div>
    );
}
