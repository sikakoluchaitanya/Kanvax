'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-muted/50',
                className
            )}
        />
    );
}

// Task Card Skeleton
export function TaskCardSkeleton() {
    return (
        <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-6 rounded-md" />
            </div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex gap-2 mb-3">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

// Task Column Skeleton
export function TaskColumnSkeleton() {
    return (
        <div className="flex-1 min-w-[300px] max-w-[400px]">
            <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <div className="space-y-3">
                <TaskCardSkeleton />
                <TaskCardSkeleton />
                <TaskCardSkeleton />
            </div>
        </div>
    );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                ))}
            </div>

            {/* Kanban Columns */}
            <div className="flex gap-6 overflow-x-auto pb-4">
                <TaskColumnSkeleton />
                <TaskColumnSkeleton />
                <TaskColumnSkeleton />
            </div>
        </div>
    );
}

// Analytics Skeleton
export function AnalyticsSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card">
                        <Skeleton className="h-10 w-10 rounded-full mb-2" />
                        <Skeleton className="h-6 w-8 mb-1" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-border bg-card">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
