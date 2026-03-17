'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, InputAdornment, Chip, Stack, alpha,
    Card, CardContent, Grid, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Tooltip, Snackbar, Alert, LinearProgress, Skeleton,
    ToggleButton, ToggleButtonGroup, Divider, useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BallotIcon from '@mui/icons-material/Ballot';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useElection } from '@/hooks/useElection';
import type { ElectionResponse, ElectionStatus } from '@/features/election/types';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const STATUS_CONFIG: Record<ElectionStatus, { label: string; color: string; icon: React.ReactNode }> = {
    DRAFT: { label: 'Draft', color: '#6B7280', icon: <BallotIcon sx={{ fontSize: 14 }} /> },
    NOMINATION_OPEN: { label: 'Nominations Open', color: '#F59E0B', icon: <AssignmentIndIcon sx={{ fontSize: 14 }} /> },
    NOMINATION_CLOSED: { label: 'Nominations Closed', color: '#8B5CF6', icon: <AssignmentIndIcon sx={{ fontSize: 14 }} /> },
    VOTING_OPEN: { label: 'Voting Open', color: '#10B981', icon: <HowToVoteIcon sx={{ fontSize: 14 }} /> },
    VOTING_CLOSED: { label: 'Voting Closed', color: '#3B82F6', icon: <HowToVoteIcon sx={{ fontSize: 14 }} /> },
    RESULTS_PUBLISHED: { label: 'Results Published', color: '#EC4899', icon: <EmojiEventsIcon sx={{ fontSize: 14 }} /> },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
    ARCHIVED: { label: 'Archived', color: '#9CA3AF', icon: <BallotIcon sx={{ fontSize: 14 }} /> },
};

function ElectionCard({ election, onClick }: { election: ElectionResponse; onClick: () => void }) {
    const statusConf = STATUS_CONFIG[election.status] || STATUS_CONFIG.DRAFT;
    const isVotingActive = election.status === 'VOTING_OPEN';

    return (
        <MotionCard
            whileHover={{ y: -4 }}
            elevation={0}
            sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: isVotingActive ? statusConf.color : 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': isVotingActive ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: statusConf.color,
                } : {},
                '&:hover': {
                    boxShadow: `0 12px 32px ${alpha(statusConf.color, 0.15)}`,
                },
            }}
            onClick={onClick}
        >
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={700} noWrap sx={{ mb: 0.5 }}>
                            {election.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EventIcon sx={{ fontSize: 12 }} />
                            {election.clubName}
                        </Typography>
                    </Box>
                    {isVotingActive && (
                        <Tooltip title="Voting is active - You can participate now">
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: statusConf.color,
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                        '100%': { opacity: 1 },
                                    },
                                }}
                            />
                        </Tooltip>
                    )}
                </Stack>

                {election.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {election.description}
                    </Typography>
                )}

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                        icon={statusConf.icon as React.ReactElement}
                        label={statusConf.label}
                        size="small"
                        sx={{
                            fontSize: '0.75rem',
                            height: 24,
                            fontWeight: 600,
                            bgcolor: alpha(statusConf.color, 0.1),
                            color: statusConf.color,
                            border: `1px solid ${alpha(statusConf.color, 0.2)}`,
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                    <Chip
                        label={election.electionType?.replace(/_/g, ' ') || 'General'}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', height: 24 }}
                    />
                </Stack>

                {isVotingActive && (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<HowToVoteIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 1,
                            fontWeight: 600,
                            bgcolor: statusConf.color,
                            '&:hover': { bgcolor: alpha(statusConf.color, 0.8) },
                        }}
                    >
                        Vote Now
                    </Button>
                )}
            </Stack>
        </MotionCard>
    );
}

export default function NonAcademicElectionsDashboard() {
    const theme = useTheme();
    const router = useRouter();
    const {
        elections,
        isLoading: isElectionsLoading,
        error,
        successMessage,
        statisticsSummary,
        loadElections,
        searchElections,
        clearError,
        clearSuccess,
    } = useElection();

    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [selectedElection, setSelectedElection] = useState<ElectionResponse | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'all' | 'active'>('all');

    useEffect(() => {
        loadElections({ page: 0, size: 50 });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                searchElections({ keyword: searchQuery, page: 0, size: 50 });
            } else {
                loadElections({ page: 0, size: 50 });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (error) {
            setSnackbar({ open: true, message: error, severity: 'error' });
            clearError();
        }
        if (successMessage) {
            setSnackbar({ open: true, message: successMessage, severity: 'success' });
            clearSuccess();
        }
    }, [error, successMessage]);

    const filteredElections = viewMode === 'active'
        ? elections.filter(e => e.status === 'VOTING_OPEN')
        : elections;

    const stats = statisticsSummary
        ? [
            { label: 'Total Elections', value: statisticsSummary.totalElections, icon: BallotIcon, color: '#3B82F6' },
            { label: 'Active Voting', value: statisticsSummary.activeElections, icon: HowToVoteIcon, color: '#10B981' },
            { label: 'Results Available', value: statisticsSummary.totalElections - (statisticsSummary.activeElections || 0), icon: CheckCircleIcon, color: '#F59E0B' },
            { label: 'Total Candidates', value: statisticsSummary.totalCandidates, icon: AssignmentIndIcon, color: '#8B5CF6' },
        ]
        : [];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ maxWidth: 1400, mx: 'auto' }}>
                {/* Header Section */}
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <HowToVoteIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                            <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                                Elections Hub
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            View ongoing and past elections from across the university.
                        </Typography>
                    </Box>
                </Stack>

                {/* Stats Section */}
                {stats.length > 0 && (
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <Grid size={{ xs: 6, sm: 3 }} key={index}>
                                    <MotionCard
                                        whileHover={{ y: -2 }}
                                        elevation={0}
                                        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                                    >
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <Box
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 1.5,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: alpha(stat.color, 0.1),
                                                        border: `1px solid ${alpha(stat.color, 0.2)}`,
                                                    }}
                                                >
                                                    <Icon sx={{ color: stat.color, fontSize: 22 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                                        {stat.label}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* Search and Filter Section */}
                <Card elevation={0} sx={{ mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                            <TextField
                                fullWidth
                                placeholder="Search elections by title or club..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="small"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                            />
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" fontWeight={600}>
                                    View:
                                </Typography>
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                                    sx={{ borderRadius: 1 }}
                                >
                                    <ToggleButton value="all" sx={{ textTransform: 'none' }}>All</ToggleButton>
                                    <ToggleButton value="active" sx={{ textTransform: 'none' }}>Active</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {isElectionsLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                {/* Elections Grid */}
                <Grid container spacing={2.5}>
                    {isElectionsLoading
                        ? [0, 1, 2, 3, 4, 5].map((i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <Skeleton variant="rounded" height={200} />
                            </Grid>
                        ))
                        : filteredElections.length > 0
                        ? filteredElections.map((election) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={election.id}>
                                <ElectionCard
                                    election={election}
                                    onClick={() => {
                                        setSelectedElection(election);
                                        setDetailsDialogOpen(true);
                                    }}
                                />
                            </Grid>
                        ))
                        : (
                            <Grid size={{ xs: 12 }}>
                                <Card elevation={0} sx={{ borderRadius: 2, border: '1px dashed', borderColor: 'divider', p: 4 }}>
                                    <Stack alignItems="center" spacing={2}>
                                        <BallotIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                                        <Box textAlign="center">
                                            <Typography variant="h6" fontWeight={600} color="text.secondary">
                                                No elections found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {searchQuery ? 'Try adjusting your search' : 'Check back later for new elections'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Card>
                            </Grid>
                        )}
                </Grid>

                {/* Details Dialog */}
                <Dialog
                    open={detailsDialogOpen}
                    onClose={() => setDetailsDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    slotProps={{ paper: { sx: { borderRadius: 2 } } }}
                >
                    {selectedElection && (
                        <>
                            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                                {selectedElection.title}
                            </DialogTitle>
                            <DialogContent sx={{ pt: 3 }}>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            CLUB
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {selectedElection.clubName}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            DESCRIPTION
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {selectedElection.description || 'No description provided'}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Stack direction="row" spacing={2}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                TYPE
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {selectedElection.electionType?.replace(/_/g, ' ') || 'General'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                STATUS
                                            </Typography>
                                            <Box sx={{ mt: 0.5 }}>
                                                <Chip
                                                    icon={(STATUS_CONFIG[selectedElection.status] || STATUS_CONFIG.DRAFT).icon as React.ReactElement}
                                                    label={(STATUS_CONFIG[selectedElection.status] || STATUS_CONFIG.DRAFT).label}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha((STATUS_CONFIG[selectedElection.status] || STATUS_CONFIG.DRAFT).color, 0.1),
                                                        color: (STATUS_CONFIG[selectedElection.status] || STATUS_CONFIG.DRAFT).color,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Stack>

                                    {selectedElection.status === 'VOTING_OPEN' && (
                                        <>
                                            <Divider />
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                startIcon={<HowToVoteIcon />}
                                                onClick={() => {
                                                    setDetailsDialogOpen(false);
                                                    router.push(`/elections/${selectedElection.id}/vote`);
                                                }}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: 1.5,
                                                    fontWeight: 600,
                                                    bgcolor: '#10B981',
                                                    '&:hover': { bgcolor: '#059669' },
                                                }}
                                            >
                                                Participate in Voting
                                            </Button>
                                        </>
                                    )}

                                    {selectedElection.status === 'RESULTS_PUBLISHED' && (
                                        <>
                                            <Divider />
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => {
                                                    setDetailsDialogOpen(false);
                                                    router.push(`/elections/${selectedElection.id}/results`);
                                                }}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: 1.5,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                View Results
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Button onClick={() => setDetailsDialogOpen(false)} sx={{ textTransform: 'none' }}>
                                    Close
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        severity={snackbar.severity}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        variant="filled"
                        sx={{ borderRadius: 1 }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </MotionBox>
        </LocalizationProvider>
    );
}


