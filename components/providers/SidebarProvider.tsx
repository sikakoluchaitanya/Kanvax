'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Persist sidebar state
    useEffect(() => {
        const stored = localStorage.getItem('kanvax-sidebar-collapsed');
        if (stored) {
            setIsCollapsed(stored === 'true');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('kanvax-sidebar-collapsed', String(isCollapsed));
    }, [isCollapsed]);

    const toggle = () => setIsCollapsed(!isCollapsed);

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}

// Export sidebar dimensions for consistent spacing
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
