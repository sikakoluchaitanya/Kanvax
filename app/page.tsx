'use client';

import { motion } from 'framer-motion';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SidebarProvider, useSidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/components/providers/SidebarProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TaskBoardDnd } from '@/components/tasks/TaskBoardDnd';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { StatCard } from '@/components/ui/StatCard';
import { useTaskStore, useTaskStats } from '@/store/taskStore';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

function DashboardContent() {
  const { isCollapsed } = useSidebar();
  const { viewMode, isAddingTask, isEditingTask, selectedTaskId, setIsAddingTask, setIsEditingTask, setSelectedTask } = useTaskStore();
  const stats = useTaskStats();

  const handleCloseForm = () => {
    setIsAddingTask(false);
    setIsEditingTask(false);
    setSelectedTask(null);
  };

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {/* Header */}
        <Header subtitle="Let's make today productive!" />

        {/* Page Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={<ListTodo size={24} />}
              color="info"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={<Clock size={24} />}
              color="warning"
            />
            <StatCard
              title="Completed"
              value={stats.done}
              icon={<CheckCircle2 size={24} />}
              color="success"
            />
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={<AlertCircle size={24} />}
              color="accent"
            />
          </motion.div>

          {/* Filters */}
          <TaskFilters />

          {/* Task Views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {viewMode === 'board' ? <TaskBoardDnd /> : <TaskList />}
          </motion.div>
        </main>
      </motion.div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isAddingTask || isEditingTask}
        onClose={handleCloseForm}
        taskId={isEditingTask ? selectedTaskId : null}
      />
    </div>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default function Home() {
  return (
    <AppProviders>
      <DashboardContent />
    </AppProviders>
  );
}
