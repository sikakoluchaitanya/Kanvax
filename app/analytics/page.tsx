'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Sparkles,
    RefreshCw,
    Target,
    Zap,
    Calendar,
    Flame,
    Award,
    ListTodo
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebar, SidebarProvider, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/components/providers/SidebarProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Card } from '@/components/ui/Card';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    subMonths,
    addMonths,
    getDay,
    startOfWeek,
    endOfWeek,
    isToday,
    parseISO
} from 'date-fns';

// Calendar Heatmap Component
function CalendarHeatmap({ tasks }: { tasks: any[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Get task activity per day
    const getActivityForDay = (date: Date) => {
        return tasks.filter(task => {
            if (task.status === 'done' && task.completedAt) {
                return isSameDay(new Date(task.completedAt), date);
            }
            if (task.createdAt) {
                return isSameDay(new Date(task.createdAt), date);
            }
            return false;
        }).length;
    };

    // Get due tasks for a day
    const getDueTasksForDay = (date: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            return isSameDay(new Date(task.dueDate), date);
        }).length;
    };

    // Generate calendar days for the month with padding
    const generateCalendarDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        return eachDayOfInterval({ start: startDate, end: endDate });
    };

    const days = generateCalendarDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getIntensity = (count: number) => {
        if (count === 0) return 'bg-muted/30';
        if (count === 1) return 'bg-emerald-500/30';
        if (count === 2) return 'bg-emerald-500/50';
        if (count === 3) return 'bg-emerald-500/70';
        return 'bg-emerald-500';
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Activity Calendar</h3>
                        <p className="text-xs text-muted-foreground">Task activity heatmap</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        ←
                    </button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    const activity = getActivityForDay(day);
                    const dueTasks = getDueTasksForDay(day);
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isTodayDate = isToday(day);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                            className={cn(
                                'aspect-square rounded-md flex flex-col items-center justify-center relative group cursor-pointer',
                                'transition-all duration-200 hover:scale-110',
                                !isCurrentMonth && 'opacity-30',
                                getIntensity(activity + dueTasks),
                                isTodayDate && 'ring-2 ring-accent'
                            )}
                        >
                            <span className={cn(
                                'text-xs font-medium',
                                activity > 0 || dueTasks > 0 ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                                {format(day, 'd')}
                            </span>
                            {(activity > 0 || dueTasks > 0) && (
                                <div className="absolute -bottom-0.5 flex gap-0.5">
                                    {activity > 0 && (
                                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                    )}
                                    {dueTasks > 0 && (
                                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                                    )}
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className={cn(
                                'absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50',
                                'bg-foreground text-background text-xs px-2 py-1 rounded-md',
                                'opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
                                'pointer-events-none'
                            )}>
                                {activity} completed, {dueTasks} due
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-muted/30" />
                    <span>No activity</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500/50" />
                    <span>Some activity</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-500" />
                    <span>High activity</span>
                </div>
            </div>
        </Card>
    );
}

function AnalyticsContent() {
    const { isCollapsed } = useSidebar();
    const { tasks } = useTaskStore();
    const [aiInsights, setAiInsights] = useState<string>('');
    const [isLoadingInsights, setIsLoadingInsights] = useState(false);

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    const overdueTasks = tasks.filter(t => {
        if (!t.dueDate || t.status === 'done') return false;
        return new Date(t.dueDate) < new Date();
    }).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate streak (consecutive days with completed tasks)
    const calculateStreak = () => {
        // Simplified streak calculation
        const completedWithDates = tasks.filter(t => t.status === 'done');
        return Math.min(completedWithDates.length, 7); // Simplified for now
    };

    const streak = calculateStreak();

    // Chart data
    const statusData = [
        { name: 'To Do', value: todoTasks, color: '#6366F1' },
        { name: 'In Progress', value: inProgressTasks, color: '#F59E0B' },
        { name: 'Done', value: completedTasks, color: '#22C55E' },
    ];

    const priorityData = [
        { name: 'High', count: highPriority, fill: '#EF4444' },
        { name: 'Medium', count: mediumPriority, fill: '#F59E0B' },
        { name: 'Low', count: lowPriority, fill: '#22C55E' },
    ];

    // Fetch AI insights
    const fetchInsights = async () => {
        setIsLoadingInsights(true);
        try {
            const response = await fetch('/api/ai/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks })
            });
            const data = await response.json();
            setAiInsights(data.insights);
        } catch (error) {
            setAiInsights('Keep up the great work! Focus on high-priority tasks for maximum productivity.');
        } finally {
            setIsLoadingInsights(false);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const stats = [
        { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10' },
        { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-500/10' },
        { label: 'In Progress', value: inProgressTasks, icon: Clock, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-500/10' },
        { label: 'Overdue', value: overdueTasks, icon: AlertTriangle, color: 'from-red-500 to-rose-600', bgColor: 'bg-red-500/10' },
    ];

    const highlights = [
        { label: 'Completion Rate', value: `${completionRate}%`, icon: Target, color: 'text-accent' },
        { label: 'High Priority', value: highPriority, icon: Flame, color: 'text-red-500' },
        { label: 'Current Streak', value: `${streak} days`, icon: Award, color: 'text-amber-500' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            <main
                className="transition-all duration-200 ease-out"
                style={{
                    marginLeft: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent to-indigo-600 shadow-lg shadow-accent/25">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                                <p className="text-muted-foreground text-sm">
                                    Track your productivity with AI-powered insights
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <Card className="p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                                    <div className={cn(
                                        'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity',
                                        stat.color
                                    )} />
                                    <div className="relative flex items-center gap-4">
                                        <div className={cn(
                                            'w-12 h-12 rounded-xl flex items-center justify-center',
                                            'bg-gradient-to-br shadow-lg',
                                            stat.color
                                        )}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* AI Insights + Highlights Row */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        {/* AI Insights Card - Spans 2 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-2"
                        >
                            <Card className="p-6 h-full bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 border-violet-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-violet-500" />
                                                    AI Productivity Coach
                                                </h2>
                                                <p className="text-xs text-muted-foreground">Personalized insights based on your task patterns</p>
                                            </div>
                                            <button
                                                onClick={fetchInsights}
                                                disabled={isLoadingInsights}
                                                className={cn(
                                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                                                    'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                                                    'hover:bg-violet-500/20 transition-all duration-200',
                                                    'disabled:opacity-50 hover:scale-105'
                                                )}
                                            >
                                                <RefreshCw className={cn('w-4 h-4', isLoadingInsights && 'animate-spin')} />
                                                Analyze
                                            </button>
                                        </div>
                                        {isLoadingInsights ? (
                                            <div className="flex items-center gap-3 text-muted-foreground py-4">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                                <span>Analyzing your productivity patterns...</span>
                                            </div>
                                        ) : (
                                            <div className="bg-background/50 rounded-xl p-4 border border-border">
                                                <p className="text-foreground leading-relaxed">
                                                    {aiInsights || 'Click "Analyze" to get AI-powered insights about your productivity!'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Highlights Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <Card className="p-6 h-full">
                                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-accent" />
                                    Key Metrics
                                </h3>
                                <div className="space-y-4">
                                    {highlights.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn('w-5 h-5', item.color)} />
                                                <span className="text-sm text-muted-foreground">{item.label}</span>
                                            </div>
                                            <span className={cn('text-lg font-bold', item.color)}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Completion Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                    >
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-accent" />
                                    <h3 className="font-semibold text-foreground">Overall Progress</h3>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-accent">{completionRate}%</span>
                                    <span className="text-sm text-muted-foreground">complete</span>
                                </div>
                            </div>
                            <div className="h-4 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionRate}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-accent via-indigo-500 to-purple-500 rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </motion.div>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground mt-3">
                                <span>{completedTasks} completed</span>
                                <span>{totalTasks - completedTasks} remaining</span>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Calendar Heatmap + Charts Row */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        {/* Calendar Heatmap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                        >
                            <CalendarHeatmap tasks={tasks} />
                        </motion.div>

                        {/* Status Distribution - Richer Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6 h-full">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Task Status</h3>
                                        <p className="text-xs text-muted-foreground">Current workflow distribution</p>
                                    </div>
                                </div>
                                {totalTasks > 0 ? (
                                    <div className="space-y-3">
                                        {/* To Do */}
                                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                        <ListTodo className="w-5 h-5 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-foreground">To Do</span>
                                                        <p className="text-xs text-muted-foreground">Ready to start</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-indigo-500">{todoTasks}</span>
                                                    <p className="text-xs text-muted-foreground">{Math.round((todoTasks / totalTasks) * 100)}%</p>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-indigo-500/20 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(todoTasks / totalTasks) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.3 }}
                                                    className="h-full rounded-full bg-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        {/* In Progress */}
                                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                                        <Clock className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-foreground">In Progress</span>
                                                        <p className="text-xs text-muted-foreground">Currently working</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-amber-500">{inProgressTasks}</span>
                                                    <p className="text-xs text-muted-foreground">{Math.round((inProgressTasks / totalTasks) * 100)}%</p>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.4 }}
                                                    className="h-full rounded-full bg-amber-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Done */}
                                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-foreground">Completed</span>
                                                        <p className="text-xs text-muted-foreground">Finished tasks</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-emerald-500">{completedTasks}</span>
                                                    <p className="text-xs text-muted-foreground">{Math.round((completedTasks / totalTasks) * 100)}%</p>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.5 }}
                                                    className="h-full rounded-full bg-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[150px] flex items-center justify-center text-muted-foreground">
                                        No tasks to display
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    </div>

                    {/* Priority Breakdown - Full Width */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-600">
                                    <Flame className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Priority Breakdown</h3>
                                    <p className="text-xs text-muted-foreground">Tasks organized by priority level</p>
                                </div>
                            </div>
                            {totalTasks > 0 ? (
                                <div className="grid md:grid-cols-3 gap-4">
                                    {priorityData.map((item, index) => (
                                        <div
                                            key={item.name}
                                            className="p-4 rounded-xl bg-muted/30 border border-border"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-foreground">{item.name}</span>
                                                <span
                                                    className="text-2xl font-bold"
                                                    style={{ color: item.fill }}
                                                >
                                                    {item.count}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${totalTasks > 0 ? (item.count / totalTasks) * 100 : 0}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: item.fill }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0}% of total tasks
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-[100px] flex items-center justify-center text-muted-foreground">
                                    No tasks to display
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <ToastProvider />
                <AnalyticsContent />
            </SidebarProvider>
        </ThemeProvider>
    );
}
