// Toast Notification System
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * useToast hook - Access toast notifications
 * Returns a fallback console logger if used outside ToastProvider
 */
export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (!context) {
        // Provide a fallback for components outside the provider
        return {
            showToast: (type: ToastType, title: string, message: string) => {
                console.log(`Toast [${type}]: ${title} - ${message}`);
            }
        };
    }
    return context;
}

/**
 * ToastProvider - Provides toast notification context to children
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, title: string, message: string) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setToasts(prev => [...prev, { id, type, title, message }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((toast, index) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    autoHideDuration={5000}
                    onClose={() => removeToast(toast.id)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ mt: index * 10 }}
                >
                    <Alert
                        severity={toast.type}
                        variant="filled"
                        sx={{ width: '100%', minWidth: 300 }}
                        action={
                            <IconButton
                                size="small"
                                color="inherit"
                                onClick={() => removeToast(toast.id)}
                                aria-label="Close notification"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    >
                        <AlertTitle>{toast.title}</AlertTitle>
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
}

