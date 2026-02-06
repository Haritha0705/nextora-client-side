// StatCard - Reusable statistics card component
'use client';

import { Box, Card, CardContent, Stack, Typography, SxProps, Theme } from '@mui/material';
import { ElementType } from 'react';

export interface StatCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    color: string;
    sx?: SxProps<Theme>;
}

export function StatCard({ title, value, icon: Icon, color, sx }: StatCardProps) {
    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', ...sx }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15` }}>
                        <Icon sx={{ color, fontSize: 28 }} />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

