'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                },
                classNames: {
                    success: 'toast-success',
                    error: 'toast-error',
                    warning: 'toast-warning',
                    info: 'toast-info',
                },
            }}
            closeButton
            richColors
        />
    );
}
