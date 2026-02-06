// PageHeader - Reusable page header with back button
'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    showBackButton?: boolean;
    action?: ReactNode;
}

export function PageHeader({
    title,
    subtitle,
    backHref = '/',
    showBackButton = true,
    action,
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <Box sx={{ mb: 4 }}>
            {showBackButton && (
                <IconButton onClick={() => router.push(backHref)} sx={{ mb: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action}
            </Box>
        </Box>
    );
}

