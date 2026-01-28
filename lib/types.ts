// ========================================
// KANVAX TYPE DEFINITIONS
// ========================================

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: Date | null;
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: Date | null;
    tags: Tag[];
}

// Chat types for AI integration (Phase 3)
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isLoading?: boolean;
}

export interface TaskSuggestion {
    title: string;
    description: string;
    priority: Priority;
}

// Filter types
export interface TaskFilters {
    search: string;
    priority: Priority | 'all';
    status: Status | 'all';
    tags: string[];
}

// View types
export type ViewMode = 'board' | 'list';
