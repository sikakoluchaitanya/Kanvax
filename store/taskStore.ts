import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskFormData, TaskFilters, ViewMode, Tag } from '@/lib/types';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample tags
export const defaultTags: Tag[] = [
    { id: '1', name: 'Design', color: '#8B5CF6' },
    { id: '2', name: 'Development', color: '#3B82F6' },
    { id: '3', name: 'Marketing', color: '#EC4899' },
    { id: '4', name: 'Research', color: '#14B8A6' },
    { id: '5', name: 'Bug Fix', color: '#EF4444' },
    { id: '6', name: 'Feature', color: '#22C55E' },
];

// Sample tasks for demo
const sampleTasks: Task[] = [
    {
        id: generateId(),
        title: 'Design new landing page',
        description: 'Create wireframes and high-fidelity mockups for the new landing page redesign.',
        priority: 'high',
        status: 'todo',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[0], defaultTags[1]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: generateId(),
        title: 'Implement user authentication',
        description: 'Set up OAuth2 authentication with Google and GitHub providers.',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[1], defaultTags[5]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: generateId(),
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples and response schemas.',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[3]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: generateId(),
        title: 'Fix mobile navigation bug',
        description: 'The hamburger menu is not closing properly on mobile devices.',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[4]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: generateId(),
        title: 'Prepare marketing campaign',
        description: 'Plan and schedule social media posts for product launch.',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[2]],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: generateId(),
        title: 'Database optimization',
        description: 'Optimize slow queries and add proper indexing to improve performance.',
        priority: 'low',
        status: 'done',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[1]],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
    },
    {
        id: generateId(),
        title: 'User feedback analysis',
        description: 'Review and categorize user feedback from the beta testing phase.',
        priority: 'low',
        status: 'done',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: [defaultTags[3]],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
    },
];

interface TaskState {
    // Data
    tasks: Task[];
    tags: Tag[];
    lastDeletedTask: Task | null;

    // UI State
    viewMode: ViewMode;
    filters: TaskFilters;
    selectedTaskId: string | null;
    isAddingTask: boolean;
    isEditingTask: boolean;

    // Actions
    addTask: (data: TaskFormData) => void;
    updateTask: (id: string, data: Partial<TaskFormData>) => void;
    deleteTask: (id: string) => void;
    restoreTask: () => void;
    moveTask: (id: string, newStatus: Task['status']) => void;

    // UI Actions
    setViewMode: (mode: ViewMode) => void;
    setFilters: (filters: Partial<TaskFilters>) => void;
    resetFilters: () => void;
    setSelectedTask: (id: string | null) => void;
    setIsAddingTask: (value: boolean) => void;
    setIsEditingTask: (value: boolean) => void;

    // Tag Actions
    addTag: (tag: Omit<Tag, 'id'>) => void;
    deleteTag: (id: string) => void;

    // User
    userName: string;
    setUserName: (name: string) => void;
}

const defaultFilters: TaskFilters = {
    search: '',
    priority: 'all',
    status: 'all',
    tags: [],
};

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            // Initial Data
            tasks: sampleTasks,
            tags: defaultTags,
            lastDeletedTask: null,

            // Initial UI State
            userName: 'there',
            viewMode: 'board',
            filters: defaultFilters,
            selectedTaskId: null,
            isAddingTask: false,
            isEditingTask: false,

            // Task Actions
            addTask: (data) => {
                const newTask: Task = {
                    id: generateId(),
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                set((state) => ({ tasks: [...state.tasks, newTask] }));
            },

            updateTask: (id, data) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? { ...task, ...data, updatedAt: new Date() }
                            : task
                    ),
                }));
            },

            deleteTask: (id) => {
                const taskToDelete = get().tasks.find(task => task.id === id);
                set((state) => ({
                    lastDeletedTask: taskToDelete || null,
                    tasks: state.tasks.filter((task) => task.id !== id),
                }));
            },

            restoreTask: () => {
                const { lastDeletedTask } = get();
                if (lastDeletedTask) {
                    set((state) => ({
                        tasks: [...state.tasks, lastDeletedTask],
                        lastDeletedTask: null,
                    }));
                }
            },


            moveTask: (id, newStatus) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? { ...task, status: newStatus, updatedAt: new Date() }
                            : task
                    ),
                }));
            },

            // UI Actions
            setViewMode: (mode) => set({ viewMode: mode }),

            setFilters: (filters) =>
                set((state) => ({
                    filters: { ...state.filters, ...filters },
                })),

            resetFilters: () => set({ filters: defaultFilters }),

            setSelectedTask: (id) => set({ selectedTaskId: id }),

            setIsAddingTask: (value) => set({ isAddingTask: value }),

            setIsEditingTask: (value) => set({ isEditingTask: value }),

            // Tag Actions
            addTag: (tagData) => {
                const newTag: Tag = {
                    id: generateId(),
                    ...tagData,
                };
                set((state) => ({ tags: [...state.tags, newTag] }));
            },

            deleteTag: (id) => {
                set((state) => ({
                    tags: state.tags.filter((tag) => tag.id !== id),
                    // Remove tag from all tasks
                    tasks: state.tasks.map((task) => ({
                        ...task,
                        tags: task.tags.filter((tag) => tag.id !== id),
                    })),
                }));
            },

            setUserName: (name) => set({ userName: name }),
        }),
        {
            name: 'kanvax-task-storage',
            partialize: (state) => ({
                tasks: state.tasks,
                tags: state.tags,
                viewMode: state.viewMode,
                userName: state.userName,
            }),
        }
    )
);

// Selector hooks for filtered tasks
export const useFilteredTasks = () => {
    const { tasks, filters } = useTaskStore();

    return tasks.filter((task) => {
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
            return false;
        }

        // Status filter
        if (filters.status !== 'all' && task.status !== filters.status) {
            return false;
        }

        // Tags filter
        if (filters.tags.length > 0) {
            const taskTagIds = task.tags.map((t) => t.id);
            const hasMatchingTag = filters.tags.some((tagId) =>
                taskTagIds.includes(tagId)
            );
            if (!hasMatchingTag) return false;
        }

        return true;
    });
};

// Get tasks by status
export const useTasksByStatus = () => {
    const filteredTasks = useFilteredTasks();

    return {
        todo: filteredTasks.filter((t) => t.status === 'todo'),
        'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
        done: filteredTasks.filter((t) => t.status === 'done'),
    };
};

// Get task statistics
export const useTaskStats = () => {
    const { tasks } = useTaskStore();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        done: tasks.filter((t) => t.status === 'done').length,
        overdue: tasks.filter((t) => {
            if (!t.dueDate || t.status === 'done') return false;
            return new Date(t.dueDate) < today;
        }).length,
        dueToday: tasks.filter((t) => {
            if (!t.dueDate || t.status === 'done') return false;
            const dueDate = new Date(t.dueDate);
            return dueDate >= today && dueDate < tomorrow;
        }).length,
    };
};
