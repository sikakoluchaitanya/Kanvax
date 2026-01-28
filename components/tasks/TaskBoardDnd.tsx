'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { TaskColumnSimple } from './TaskColumnSimple';
import { useTaskStore, useTasksByStatus } from '@/store/taskStore';
import type { Task, Status } from '@/lib/types';
import { PanInfo } from 'framer-motion';

const columns: { id: Status; title: string; emoji: string }[] = [
    { id: 'todo', title: 'To Do', emoji: '📋' },
    { id: 'in-progress', title: 'In Progress', emoji: '🚀' },
    { id: 'done', title: 'Done', emoji: '✅' },
];

export function TaskBoardDnd() {
    const tasksByStatus = useTasksByStatus();
    const { moveTask, tasks } = useTaskStore();
    const [draggingTask, setDraggingTask] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const handleDragStart = useCallback((taskId: string) => {
        setDraggingTask(taskId);
    }, []);

    const handleDragEnd = useCallback((taskId: string, info: PanInfo) => {
        if (dragOverColumn) {
            const task = tasks.find(t => t.id === taskId);
            if (task && task.status !== dragOverColumn) {
                moveTask(taskId, dragOverColumn);
            }
        }
        setDraggingTask(null);
        setDragOverColumn(null);
    }, [dragOverColumn, tasks, moveTask]);

    const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // Calculate which column we're over based on X position
        if (!boardRef.current) return;

        const boardRect = boardRef.current.getBoundingClientRect();
        const relativeX = info.point.x - boardRect.left;
        const columnWidth = boardRect.width / 3;

        let newColumn: Status;
        if (relativeX < columnWidth) {
            newColumn = 'todo';
        } else if (relativeX < columnWidth * 2) {
            newColumn = 'in-progress';
        } else {
            newColumn = 'done';
        }

        if (newColumn !== dragOverColumn) {
            setDragOverColumn(newColumn);
        }
    }, [dragOverColumn]);

    return (
        <div
            ref={boardRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative"
            style={{ isolation: 'isolate' }}
        >
            {columns.map((column) => (
                <TaskColumnSimple
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    emoji={column.emoji}
                    tasks={tasksByStatus[column.id]}
                    draggingTask={draggingTask}
                    isOver={dragOverColumn === column.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrag={handleDrag}
                />
            ))}
        </div>
    );
}
