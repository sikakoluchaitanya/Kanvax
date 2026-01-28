'use client';

import { TaskColumn } from './TaskColumn';
import { useTasksByStatus } from '@/store/taskStore';

export function TaskBoard() {
    const tasksByStatus = useTasksByStatus();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <TaskColumn status="todo" tasks={tasksByStatus.todo} />
            <TaskColumn status="in-progress" tasks={tasksByStatus['in-progress']} />
            <TaskColumn status="done" tasks={tasksByStatus.done} />
        </div>
    );
}
