'use client';

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout';

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}

