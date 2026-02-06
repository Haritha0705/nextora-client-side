// DashboardLayout - Reusable dashboard layout wrapper
'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

export interface DashboardLayoutProps {
    children: ReactNode;
    bgcolor?: string;
    sx?: SxProps<Theme>;
}

export function DashboardLayout({
    children,
    bgcolor = 'grey.50',
    sx
}: DashboardLayoutProps) {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', ...sx }}>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    bgcolor,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

