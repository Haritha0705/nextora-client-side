'use client';

import { ToastProvider } from '@/components/common';
import { AuthProvider } from '@/providers/AuthProvider';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ToastProvider>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {children}
                </div>
            </ToastProvider>
        </AuthProvider>
    );
}