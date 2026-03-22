'use client';

import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface Stat { label: string; value: number; icon: any; color?: string }

export default function KuppiOverviewStats({ stats }: { stats: Stat[] }) {
    const MotionPaper = motion.create(Paper);
    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                        <MotionPaper initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }} sx={{ p: 2.5, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: (theme) => stat.color ? stat.color + '14' : 'transparent' }}>
                                    <Icon sx={{ color: stat.color, fontSize: 24 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                </Box>
                            </Box>
                        </MotionPaper>
                    </Grid>
                );
            })}
        </Grid>
    );
}

