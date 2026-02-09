// StatCard - Reusable statistics card component
'use client';

import { Box, Card, CardContent, Typography, SxProps, Theme } from '@mui/material';
import { ElementType } from 'react';

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    color?: string;
    change?: string;
    trend?: 'up' | 'down';
    sx?: SxProps<Theme>;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    color = 'primary.main',
    change,
    trend,
    sx
}: StatCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                transition: 'border-color 0.2s ease-in-out',
                ...sx
            }}
        >
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            color="text.primary"
                            sx={{
                                fontWeight: 600,
                                mb: change ? 1 : 0,
                                fontSize: { xs: '1.5rem', sm: '1.875rem' },
                            }}
                        >
                            {value}
                        </Typography>
                        {change && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary',
                                        fontWeight: 500,
                                    }}
                                >
                                    {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {change}
                                </Typography>
                                <Typography
                                    component="span"
                                    color="text.disabled"
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    vs last month
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            borderRadius: 1,
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Icon sx={{ fontSize: { xs: 20, sm: 24 }, color }} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

