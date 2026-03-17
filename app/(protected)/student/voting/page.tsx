

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, TextField, InputAdornment, Tabs, Tab, Chip, Stack, alpha,
    useTheme, Paper, IconButton, Card, CardContent, Grid, Tooltip,
    Snackbar, Alert, Skeleton, LinearProgress, Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BallotIcon from '@mui/icons-material/Ballot';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import ArchiveIcon from '@mui/icons-material/Archive';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useElection } from '@/hooks/useElection';
import type { ElectionResponse, ElectionStatus } from '@/features/election/types';

const MotionBox = motion.create(Box);

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const STATUS_CONFIG: Record<ElectionStatus, { label: string; color: string; icon: React.ReactNode }> = {
    DRAFT: { label: 'Draft', color: '#6B7280', icon: <BallotIcon sx={{ fontSize: 14 }} /> },
    NOMINATION_OPEN: { label: 'Nominations Open', color: '#F59E0B', icon: <AssignmentIndIcon sx={{ fontSize: 14 }} /> },
    NOMINATION_CLOSED: { label: 'Nominations Closed', color: '#8B5CF6', icon: <AssignmentIndIcon sx={{ fontSize: 14 }} /> },
    VOTING_OPEN: { label: 'Voting Open', color: '#10B981', icon: <HowToVoteIcon sx={{ fontSize: 14 }} /> },
    VOTING_CLOSED: { label: 'Voting Closed', color: '#3B82F6', icon: <HowToVoteIcon sx={{ fontSize: 14 }} /> },
    RESULTS_PUBLISHED: { label: 'Results Published', color: '#EC4899', icon: <EmojiEventsIcon sx={{ fontSize: 14 }} /> },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
    ARCHIVED: { label: 'Archived', color: '#9CA3AF', icon: <ArchiveIcon sx={{ fontSize: 14 }} /> },
};

const TYPE_COLORS: Record<string, string> = {
    PRESIDENT: '#F59E0B',
    VICE_PRESIDENT: '#D97706',
    SECRETARY: '#8B5CF6',
    TREASURER: '#10B981',
    GENERAL: '#3B82F6',
    POLL: '#EC4899',
    REFERENDUM: '#EF4444',
};

function formatElectionDate(election: ElectionResponse): string {
    const start = new Date(election.votingStartTime);
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTimeRemaining(election: ElectionResponse): string | null {
    const now = new Date();
    if (election.status === 'VOTING_OPEN') {
        const end = new Date(election.votingEndTime);
        const diff = end.getTime() - now.getTime();
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (days > 0) return `${days}d ${hours}h remaining`;
            return `${hours}h remaining`;
        }
    }
    if (election.status === 'NOMINATION_OPEN') {
        const end = new Date(election.nominationEndTime);
        const diff = end.getTime() - now.getTime();
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (days > 0) return `${days}d ${hours}h left to nominate`;
            return `${hours}h left to nominate`;
        }
    }
    return null;
}

function ElectionCard({ election, onClick }: { election: ElectionResponse; onClick: () => void }) {
    const statusConf = STATUS_CONFIG[election.status] || STATUS_CONFIG.DRAFT;
    const typeColor = TYPE_COLORS[election.electionType] || '#6B7280';
    const timeRemaining = getTimeRemaining(election);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, cursor: 'pointer',
                transition: 'all 0.25s ease',
                '&:hover': {
                    borderColor: statusConf.color,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha(statusConf.color, 0.12)}`,
                },
            }}
            onClick={onClick}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={700} noWrap sx={{ mb: 0.5 }}>
                            {election.title}
                        </Typography>
                        {election.description && (
                            <Typography variant="body2" color="text.secondary" sx={{
                                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>
                                {election.description}
                            </Typography>
                        )}
                    </Box>
                    <ArrowForwardIosIcon sx={{ fontSize: 14, color: 'text.disabled', ml: 1, mt: 0.5 }} />
                </Stack>

                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    <Chip
                        icon={statusConf.icon as React.ReactElement}
                        label={statusConf.label}
                        size="small"
                        sx={{
                            fontSize: '0.7rem', height: 22, fontWeight: 600,
                            bgcolor: alpha(statusConf.color, 0.1), color: statusConf.color,
                            border: '1px solid', borderColor: alpha(statusConf.color, 0.2),
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                    <Chip
                        label={election.electionType?.replace(/_/g, ' ')}
                        size="small"
                        sx={{
                            fontSize: '0.7rem', height: 22, fontWeight: 600,
                            bgcolor: alpha(typeColor, 0.1), color: typeColor,
                            border: '1px solid', borderColor: alpha(typeColor, 0.2),
                        }}
                    />
                    <Chip
                        icon={<EventIcon sx={{ fontSize: '14px !important' }} />}
                        label={formatElectionDate(election)}
                        size="small"
                        sx={{
                            fontSize: '0.7rem', height: 22,
                            bgcolor: alpha('#3B82F6', 0.08),
                            color: '#3B82F6',
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ pt: 0.5 }}>
                    {election.totalApprovedCandidates !== undefined && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <GroupsIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                                {election.totalApprovedCandidates} candidate{election.totalApprovedCandidates !== 1 ? 's' : ''}
                            </Typography>
                        </Stack>
                    )}
                    {timeRemaining && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: 14, color: statusConf.color }} />
                            <Typography variant="caption" fontWeight={600} sx={{ color: statusConf.color }}>
                                {timeRemaining}
                            </Typography>
                        </Stack>
                    )}
                    {election.clubName && (
                        <Typography variant="caption" color="text.disabled" noWrap>
                            {election.clubName}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}

function ElectionSkeleton() {
    return (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="90%" height={18} sx={{ mt: 0.5 }} />
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Skeleton variant="rounded" width={100} height={22} />
                <Skeleton variant="rounded" width={80} height={22} />
                <Skeleton variant="rounded" width={110} height={22} />
            </Stack>
        </Paper>
    );
}

export default function ElectionsPage() {
    const theme = useTheme();
    const router = useRouter();
    const {
        elections, totalElections, myCandidacies,
        isLoading, error, successMessage,
        loadElections, loadVotableElections, loadUpcomingElections, searchElections,
        loadMyCandidacies, clearError, clearSuccess,
    } = useElection();

    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const loadTabData = useCallback((tab: number) => {
        const params = { page: 0, size: 20 };
        switch (tab) {
            case 0: loadElections(params); break;
            case 1: loadVotableElections(params); break;
            case 2: loadUpcomingElections(params); break;
            case 3: loadElections({ ...params, status: 'RESULTS_PUBLISHED' as ElectionStatus }); break;
        }
    }, [loadElections, loadVotableElections, loadUpcomingElections]);

    useEffect(() => {
        loadTabData(activeTab);
        loadMyCandidacies({ page: 0, size: 50 });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                searchElections({ keyword: searchQuery, page: 0, size: 20 });
            } else {
                loadTabData(activeTab);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, activeTab]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); }
        if (successMessage) { setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess(); }
    }, [error, successMessage, clearError, clearSuccess]);

    const votingOpenCount = elections.filter(e => e.status === 'VOTING_OPEN').length;
    const upcomingCount = elections.filter(e => ['DRAFT', 'NOMINATION_OPEN', 'NOMINATION_CLOSED'].includes(e.status)).length;

    const stats = [
        { label: 'Total Elections', value: totalElections, icon: BallotIcon, color: '#3B82F6' },
        { label: 'Voting Open', value: votingOpenCount, icon: HowToVoteIcon, color: '#10B981' },
        { label: 'Upcoming', value: upcomingCount, icon: EventIcon, color: '#F59E0B' },
        { label: 'My Candidacies', value: myCandidacies.length, icon: AssignmentIndIcon, color: '#8B5CF6' },
    ];

    const handleRefresh = () => {
        loadTabData(activeTab);
        loadMyCandidacies({ page: 0, size: 50 });
    };

    return (
        <MotionBox variants={containerVariants} initial="hidden" animate="show" sx={{ maxWidth: 1400, mx: 'auto' }}>
            {/* Page Header */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                            Elections
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Participate in university elections — vote for student representatives and club leadership
                        </Typography>
                    </Box>
                    {myCandidacies.length > 0 && (
                        <Chip
                            icon={<AssignmentIndIcon sx={{ fontSize: '16px !important' }} />}
                            label={`${myCandidacies.length} Candidac${myCandidacies.length !== 1 ? 'ies' : 'y'}`}
                            size="small"
                            sx={{
                                fontWeight: 600, bgcolor: alpha('#8B5CF6', 0.1), color: '#8B5CF6',
                                border: '1px solid', borderColor: alpha('#8B5CF6', 0.2),
                                '& .MuiChip-icon': { color: 'inherit' },
                            }}
                        />
                    )}
                </Stack>
            </MotionBox>

            {/* Stats Grid */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Grid size={{ xs: 6, sm: 3 }} key={index}>
                                <Card elevation={0} sx={{
                                    borderRadius: 1, border: '1px solid', borderColor: 'divider', transition: 'all 0.2s',
                                    '&:hover': { borderColor: stat.color, boxShadow: `0 4px 16px ${alpha(stat.color, 0.15)}` },
                                }}>
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{
                                                width: 44, height: 44, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                bgcolor: alpha(stat.color, 0.1), border: '1px solid', borderColor: alpha(stat.color, 0.15),
                                            }}>
                                                <Icon sx={{ color: stat.color, fontSize: 22 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.1 }}>{stat.value}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{stat.label}</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Filters */}
            <Card elevation={0} sx={{
                mb: 4, borderRadius: 1, border: '1px solid', borderColor: 'divider',
                bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(12px)',
            }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
                        <TextField
                            placeholder="Search elections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            sx={{
                                maxWidth: { sm: 320 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1 },
                                },
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery ? (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={() => setSearchQuery('')}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                        />
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Tabs
                                value={activeTab}
                                onChange={(_, v) => setActiveTab(v)}
                                sx={{
                                    minHeight: 36,
                                    '& .MuiTab-root': {
                                        minHeight: 36, textTransform: 'none', fontWeight: 600,
                                        fontSize: '0.8125rem', borderRadius: 1, px: 2,
                                    },
                                    '& .MuiTabs-indicator': { borderRadius: 1, height: 2 },
                                }}
                            >
                                <Tab label="All" />
                                <Tab label={
                                    <Badge badgeContent={votingOpenCount} color="success"
                                        sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                                        <span>Voting</span>
                                    </Badge>
                                } />
                                <Tab label="Upcoming" />
                                <Tab label="Results" />
                            </Tabs>
                            <Tooltip title="Refresh">
                                <IconButton onClick={handleRefresh} disabled={isLoading} size="small" sx={{
                                    border: '1px solid', borderColor: 'divider', borderRadius: 1,
                                    '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                }}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

            {/* Election List */}
            <AnimatePresence mode="wait">
                <MotionBox key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {isLoading ? (
                        <Stack spacing={1.5}>
                            {[0, 1, 2, 3].map(i => <ElectionSkeleton key={i} />)}
                        </Stack>
                    ) : elections.length === 0 ? (
                        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{
                                width: 80, height: 80, borderRadius: '50%',
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5,
                            }}>
                                <HowToVoteIcon sx={{ fontSize: 40, color: alpha(theme.palette.primary.main, 0.4) }} />
                            </Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>No elections found</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: 'auto' }}>
                                {activeTab === 1 ? 'No elections are currently open for voting.' :
                                    activeTab === 2 ? 'No upcoming elections at this time.' :
                                        activeTab === 3 ? 'No election results have been published yet.' :
                                            'There are no elections to display.'}
                            </Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={1.5}>
                            {elections.map(election => (
                                <ElectionCard
                                    key={election.id}
                                    election={election}
                                    onClick={() => router.push(`/student/voting/${election.id}`)}
                                />
                            ))}
                        </Stack>
                    )}
                </MotionBox>
            </AnimatePresence>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
