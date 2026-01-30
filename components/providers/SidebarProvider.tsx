'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    isMobile: boolean;
    setIsCollapsed: (value: boolean) => void;
    setIsMobileOpen: (value: boolean) => void;
    toggle: () => void;
    closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(true); // Always collapsed on mobile
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Persist sidebar state (only for desktop)
    useEffect(() => {
        if (!isMobile) {
            const stored = localStorage.getItem('kanvax-sidebar-collapsed');
            if (stored) {
                setIsCollapsed(stored === 'true');
            }
        }
    }, [isMobile]);

    useEffect(() => {
        if (!isMobile) {
            localStorage.setItem('kanvax-sidebar-collapsed', String(isCollapsed));
        }
    }, [isCollapsed, isMobile]);

    const toggle = () => {
        if (isMobile) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const closeMobile = () => setIsMobileOpen(false);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            isMobileOpen,
            isMobile,
            setIsCollapsed,
            setIsMobileOpen,
            toggle,
            closeMobile
        }}>
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
