'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/Card';
import { TaskCardContent } from './TaskCardContent';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface TaskCardDndProps {
    task: Task;
    index?: number;
    isDragging?: boolean;
    isHidden?: boolean;
}

export function TaskCardDnd({ task, index = 0, isDragging: isDraggingProp, isHidden }: TaskCardDndProps) {
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

    const isCurrentlyDragging = isDragging || isDraggingProp;

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
                <TaskCardContent
                    task={task}
                    showDragHandle={true}
                    showCompletedOverlay={false}
                    showMarkdown={false}
                />
            </Card>
        </div>
    );
}
