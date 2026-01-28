'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Settings,
} from 'lucide-react';
import { useSidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/components/providers/SidebarProvider';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    isActive?: boolean;
}

// Only essential navigation for the assignment
const mainNavItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
    },
    {
        label: 'AI Assistant',
        href: '/chat',
        icon: <Sparkles size={20} strokeWidth={1.5} />,
    },
];

const bottomNavItems: NavItem[] = [
    {
        label: 'Settings',
        href: '/settings',
        icon: <Settings size={20} strokeWidth={1.5} />,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggle } = useSidebar();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                'fixed left-0 top-0 z-40 h-screen',
                'bg-sidebar border-r border-sidebar-border',
                'flex flex-col'
            )}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-3">
                    <motion.div
                        className={cn(
                            'flex items-center justify-center w-9 h-9 rounded-lg',
                            'bg-gradient-to-br from-accent to-indigo-600'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-lg font-bold text-white">K</span>
                    </motion.div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.15 }}
                                className="text-lg font-semibold text-foreground tracking-tight"
                            >
                                Kanvax
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto">
                <div className="space-y-1">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                            >
                                Navigation
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <div className="mt-3 space-y-1">
                        {mainNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                                        'group',
                                        isActive
                                            ? 'bg-accent/10 text-accent font-medium'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                        isCollapsed && 'justify-center px-2'
                                    )}
                                >
                                    <span className={cn(
                                        'transition-colors',
                                        isActive && 'text-accent'
                                    )}>
                                        {item.icon}
                                    </span>

                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex-1 text-sm"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {!isCollapsed && item.badge && (
                                        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-medium rounded-full bg-accent text-white">
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className={cn(
                                            'absolute left-full ml-3 px-2 py-1.5',
                                            'bg-foreground text-background text-xs font-medium rounded-md',
                                            'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                                            'pointer-events-none whitespace-nowrap z-50',
                                            'shadow-lg'
                                        )}>
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 border-t border-sidebar-border">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150',
                                'group',
                                isActive
                                    ? 'bg-accent/10 text-accent font-medium'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                isCollapsed && 'justify-center px-2'
                            )}
                        >
                            <span className={cn(isActive && 'text-accent')}>
                                {item.icon}
                            </span>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className={cn(
                                    'absolute left-full ml-3 px-2 py-1.5',
                                    'bg-foreground text-background text-xs font-medium rounded-md',
                                    'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
                                    'pointer-events-none whitespace-nowrap z-50',
                                    'shadow-lg'
                                )}>
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Collapse Button */}
            <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    'absolute -right-3 top-20',
                    'flex items-center justify-center w-6 h-6',
                    'bg-card border border-border rounded-full',
                    'text-muted-foreground hover:text-foreground',
                    'shadow-sm transition-colors duration-150'
                )}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </motion.button>
        </motion.aside>
    );
}
