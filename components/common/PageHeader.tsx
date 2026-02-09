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
        <Box sx={{ mb: { xs: 3, lg: 4 } }}>
            {showBackButton && (
                <IconButton
                    onClick={() => router.push(backHref)}
                    sx={{
                        mb: 2,
                        color: 'text.secondary',
                        '&:hover': { bgcolor: 'action.hover' },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h1"
                        sx={{
                            mb: subtitle ? 1 : 0,
                            fontSize: { xs: '1.5rem', sm: '1.875rem', lg: '2rem' },
                            fontWeight: 700,
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                {action && (
                    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                        {action}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

