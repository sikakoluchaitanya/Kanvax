'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Sun,
    Moon,
    Trash2,
    Download,
    User,
    Palette,
    Database,
    Shield,
    ChevronRight,
    Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSidebar, SidebarProvider, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/components/providers/SidebarProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

// Accent color options with light and dark mode values
const accentColors = [
    { name: 'Indigo', light: '#6366F1', dark: '#818CF8', class: 'bg-indigo-500' },
    { name: 'Purple', light: '#8B5CF6', dark: '#A78BFA', class: 'bg-purple-500' },
    { name: 'Blue', light: '#3B82F6', dark: '#60A5FA', class: 'bg-blue-500' },
    { name: 'Emerald', light: '#10B981', dark: '#34D399', class: 'bg-emerald-500' },
    { name: 'Rose', light: '#F43F5E', dark: '#FB7185', class: 'bg-rose-500' },
    { name: 'Amber', light: '#F59E0B', dark: '#FBBF24', class: 'bg-amber-500' },
];

const ACCENT_STORAGE_KEY = 'kanvax-accent-color';
const PROFILE_STORAGE_KEY = 'kanvax-user-profile';

function SettingsContent() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { isCollapsed } = useSidebar();
    const { tasks, tags, userName, setUserName } = useTaskStore();

    // Load saved accent color from localStorage
    const [selectedAccent, setSelectedAccent] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
            return saved ? parseInt(saved, 10) : 0;
        }
        return 0;
    });

    // Load saved profile from localStorage (email only - name comes from store)
    const [userEmail, setUserEmail] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return parsed.email || '';
                } catch {
                    return '';
                }
            }
        }
        return '';
    });

    // Local state for editing name (synced with store)
    const [editName, setEditName] = useState(userName);

    // Sync editName when userName changes from other sources (like header edit)
    useEffect(() => {
        setEditName(userName);
    }, [userName]);

    // Apply accent color on mount and when it changes
    useEffect(() => {
        const color = accentColors[selectedAccent];
        const accentValue = resolvedTheme === 'dark' ? color.dark : color.light;

        // Update CSS custom properties
        document.documentElement.style.setProperty('--accent', accentValue);
        document.documentElement.style.setProperty('--ring', accentValue);
        document.documentElement.style.setProperty('--sidebar-primary', accentValue);
        document.documentElement.style.setProperty('--status-todo', accentValue);

        // Save to localStorage
        localStorage.setItem(ACCENT_STORAGE_KEY, selectedAccent.toString());
    }, [selectedAccent, resolvedTheme]);

    const handleAccentChange = (index: number) => {
        setSelectedAccent(index);
        toast.success(`Accent color changed to ${accentColors[index].name}`, {
            description: 'Your preference has been saved.',
        });
    };

    const handleExportData = () => {
        const data = {
            tasks,
            tags,
            exportedAt: new Date().toISOString(),
            version: '1.0',
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kanvax-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Data exported successfully!', {
            description: 'Your backup file has been downloaded.',
        });
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('kanvax-task-storage');
            localStorage.removeItem('kanvax-sidebar');
            localStorage.removeItem(ACCENT_STORAGE_KEY);
            localStorage.removeItem(PROFILE_STORAGE_KEY);
            localStorage.removeItem('kanvax-welcome-seen');
            toast.success('All data cleared!', {
                description: 'Refresh the page to see the changes.',
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    const handleSaveProfile = () => {
        // Update the store userName (this affects the greeting)
        if (editName.trim()) {
            setUserName(editName.trim());
        }

        // Save email to localStorage
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
            name: editName.trim() || userName,
            email: userEmail
        }));

        toast.success('Profile saved!', {
            description: 'Your profile information has been updated.',
        });
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            <main
                className="transition-all duration-200 ease-out"
                style={{
                    marginLeft: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
                }}
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-accent/10">
                                <Settings className="w-6 h-6 text-accent" />
                            </div>
                            <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
                        </div>
                        <p className="text-muted-foreground ml-12">
                            Customize your Kanvax experience
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        {/* Appearance Section */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Palette className="w-5 h-5 text-accent" />
                                    <h2 className="text-lg font-medium">Appearance</h2>
                                </div>

                                {/* Theme Toggle */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-foreground mb-3 block">
                                        Theme
                                    </label>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 'light', icon: Sun, label: 'Light' },
                                            { value: 'dark', icon: Moon, label: 'Dark' },
                                            { value: 'system', icon: Settings, label: 'System' },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                                                className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
                          ${theme === option.value
                                                        ? 'border-accent bg-accent/10 text-accent'
                                                        : 'border-border bg-background hover:border-muted-foreground/30'
                                                    }
                        `}
                                            >
                                                <option.icon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{option.label}</span>
                                                {theme === option.value && (
                                                    <Check className="w-4 h-4 ml-1" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Accent Color */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-3 block">
                                        Accent Color
                                    </label>
                                    <div className="flex gap-3">
                                        {accentColors.map((color, index) => (
                                            <button
                                                key={color.name}
                                                onClick={() => handleAccentChange(index)}
                                                className={`
                          w-10 h-10 rounded-full transition-all flex items-center justify-center
                          ${color.class}
                          ${selectedAccent === index
                                                        ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110'
                                                        : 'hover:scale-105'
                                                    }
                        `}
                                                title={color.name}
                                            >
                                                {selectedAccent === index && (
                                                    <Check className="w-5 h-5 text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Profile Section */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <User className="w-5 h-5 text-accent" />
                                    <h2 className="text-lg font-medium">Profile</h2>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 mb-6">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1.5">
                                            This name appears in your greeting
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1.5">
                                            For future features like notifications
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={handleSaveProfile}>
                                    Save Profile
                                </Button>
                            </Card>
                        </motion.div>

                        {/* Data Management Section */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Database className="w-5 h-5 text-accent" />
                                    <h2 className="text-lg font-medium">Data Management</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Stats */}
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-2xl font-semibold text-foreground">{tasks.length}</p>
                                                <p className="text-sm text-muted-foreground">Total Tasks</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-foreground">{tags.length}</p>
                                                <p className="text-sm text-muted-foreground">Tags</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold text-foreground">
                                                    {tasks.filter(t => t.status === 'done').length}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Completed</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Export Button */}
                                    <button
                                        onClick={handleExportData}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Download className="w-5 h-5 text-accent" />
                                            <div className="text-left">
                                                <p className="font-medium text-foreground">Export Data</p>
                                                <p className="text-sm text-muted-foreground">Download all your tasks as JSON</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Danger Zone */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6 border-red-500/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <Shield className="w-5 h-5 text-red-500" />
                                    <h2 className="text-lg font-medium text-red-500">Danger Zone</h2>
                                </div>

                                <button
                                    onClick={handleClearData}
                                    className="w-full flex items-center justify-between p-4 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                        <div className="text-left">
                                            <p className="font-medium text-red-500">Clear All Data</p>
                                            <p className="text-sm text-muted-foreground">Permanently delete all tasks and settings</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <ToastProvider />
                <SettingsContent />
            </SidebarProvider>
        </ThemeProvider>
    );
}
