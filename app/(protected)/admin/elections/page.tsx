'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, TextField, InputAdornment, Autocomplete, Chip, Stack, alpha,
    useTheme, Paper, IconButton, Card, CardContent, Grid, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Stepper, Step, StepLabel, Select, MenuItem,
    FormControl, InputLabel, Tooltip, Snackbar, Alert, LinearProgress, Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BallotIcon from '@mui/icons-material/Ballot';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useElection } from '@/hooks/useElection';
import { useClub } from '@/hooks/useClub';
import type { ElectionResponse, ElectionStatus } from '@/features/election/types';
import type { ClubResponse } from '@/features/club/types';

const MotionBox = motion.create(Box);

const STATUS_CONFIG: Record<ElectionStatus, { label: string; color: string; icon: React.ReactNode }> = {
    DRAFT: { label: 'Draft', color: '#6B7280', icon: <BallotIcon sx={{ fontSize: 14 }} /> },
    NOMINATIONS_OPEN: { label: 'Nominations Open', color: '#F59E0B', icon: <AssignmentIndIcon sx={{ fontSize: 14 }} /> },
    NOMINATIONS_CLOSED: { label: 'Nominations Closed', color: '#8B5CF6', icon: <AssignmentIndIcon sx={{ fontSize: 14 }} /> },
    VOTING_OPEN: { label: 'Voting Open', color: '#10B981', icon: <HowToVoteIcon sx={{ fontSize: 14 }} /> },
    VOTING_CLOSED: { label: 'Voting Closed', color: '#3B82F6', icon: <HowToVoteIcon sx={{ fontSize: 14 }} /> },
    RESULTS_PUBLISHED: { label: 'Results Published', color: '#EC4899', icon: <EmojiEventsIcon sx={{ fontSize: 14 }} /> },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
};

function AdminElectionCard({ election, onClick }: { election: ElectionResponse; onClick: () => void }) {
    const theme = useTheme();
    const statusConf = STATUS_CONFIG[election.status] || STATUS_CONFIG.DRAFT;

    return (
        <Paper elevation={0} sx={{
            p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, cursor: 'pointer',
            transition: 'all 0.25s ease',
            '&:hover': {
                borderColor: statusConf.color, transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(statusConf.color, 0.12)}`,
            },
        }} onClick={onClick}>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={700} noWrap sx={{ mb: 0.5 }}>{election.title}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>ID: {election.id} • {election.clubName}</Typography>
                    </Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClick(); }} sx={{ flexShrink: 0 }}>
                        <SettingsIcon fontSize="small" />
                    </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip icon={statusConf.icon as React.ReactElement} label={statusConf.label} size="small"
                        sx={{ fontSize: '0.7rem', height: 22, fontWeight: 600, bgcolor: alpha(statusConf.color, 0.1), color: statusConf.color, border: `1px solid ${alpha(statusConf.color, 0.2)}`, '& .MuiChip-icon': { color: 'inherit' } }} />
                    <Chip label={election.electionType?.replace(/_/g, ' ')} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                </Stack>
            </Stack>
        </Paper>
    );
}

export default function AdminElectionsDashboard() {
    const theme = useTheme();
    const router = useRouter();
    const {
        elections, totalElections, isLoading: isElectionsLoading, isCreating, error, successMessage, statisticsSummary,
        loadElections, searchElections, createElection, clearError, clearSuccess, adminLoadStatisticsSummary,
    } = useElection();
    const { clubs, loadClubs, isClubLoading: isClubsLoading } = useClub();

    const [searchQuery, setSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const [createData, setCreateData] = useState({
        clubId: null as number | null, title: '', description: '', electionType: 'GENERAL',
        electionDate: new Date(), electionYear: new Date().getFullYear(),
        votingDaysLimit: 1, maxCandidatesPerVoter: 1,
    });

    useEffect(() => {
        loadElections({ page: 0, size: 50 });
        adminLoadStatisticsSummary();
        loadClubs();
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
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); }
        if (successMessage) {
            setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess();
            setCreateDialogOpen(false); loadElections(); adminLoadStatisticsSummary();
        }
    }, [error, successMessage]);

    const handleCreateSubmit = () => {
        if (!createData.clubId) {
            setSnackbar({ open: true, message: 'Please select a club', severity: 'error' }); return;
        }
        createElection({
            ...createData,
            clubId: createData.clubId,
            electionType: createData.electionType as any,
            electionDate: createData.electionDate.toISOString().split('T')[0],
        });
    };

    const stats = statisticsSummary ? [
        { label: 'Total Elections', value: statisticsSummary.totalElections, icon: BallotIcon, color: '#3B82F6' },
        { label: 'Active (Voting)', value: statisticsSummary.activeElections, icon: HowToVoteIcon, color: '#10B981' },
        { label: 'Total Votes Cast', value: statisticsSummary.totalVotes, icon: CheckCircleIcon, color: '#F59E0B' },
        { label: 'Total Candidates', value: statisticsSummary.totalCandidates, icon: AssignmentIndIcon, color: '#8B5CF6' },
    ] : [
        { label: 'Total Elections', value: totalElections, icon: BallotIcon, color: '#3B82F6' },
        { label: 'Active', value: '-', icon: HowToVoteIcon, color: '#10B981' },
        { label: 'Total Votes', value: '-', icon: CheckCircleIcon, color: '#F59E0B' },
        { label: 'Candidates', value: '-', icon: AssignmentIndIcon, color: '#8B5CF6' },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ maxWidth: 1400, mx: 'auto' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 4 }}>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <SettingsIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                            <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>Election Management</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">Create, configure, and manage club and university elections.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>
                        Create Election
                    </Button>
                </Stack>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon; return (
                            <Grid size={{ xs: 6, sm: 3 }} key={index}>
                                <Card elevation={0} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(stat.color, 0.1), border: `1px solid ${alpha(stat.color, 0.15)}` }}>
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
                        )
                    })}
                </Grid>

                <Card elevation={0} sx={{ mb: 4, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <TextField fullWidth placeholder="Search elections by title, ID, or club..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            size="small" slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                    </CardContent>
                </Card>

                {isElectionsLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                <Grid container spacing={2}>
                    {isElectionsLoading ? [0, 1, 2, 3, 4, 5].map(i => <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}><Skeleton variant="rounded" height={120} /></Grid>)
                        : elections.map(election => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={election.id}>
                                <AdminElectionCard election={election} onClick={() => router.push(`/admin/elections/${election.id}`)} />
                            </Grid>
                        ))}
                </Grid>

                <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>Create New Election</DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Stack spacing={2.5}>
                            <Autocomplete
                                options={clubs} getOptionLabel={(option) => option.name}
                                onChange={(_, newValue) => setCreateData({ ...createData, clubId: newValue?.id || null })}
                                loading={isClubsLoading}
                                renderInput={(params) => <TextField {...params} label="Select Club" size="small" required />}
                            />
                            <TextField fullWidth label="Election Title" size="small" required value={createData.title}
                                onChange={e => setCreateData({ ...createData, title: e.target.value })} />
                            <TextField fullWidth label="Description" size="small" multiline rows={3} value={createData.description}
                                onChange={e => setCreateData({ ...createData, description: e.target.value })} />
                            <Stack direction="row" spacing={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Election Type</InputLabel>
                                    <Select value={createData.electionType} label="Election Type"
                                        onChange={e => setCreateData({ ...createData, electionType: e.target.value })}>
                                        {['GENERAL', 'PRESIDENTIAL', 'BY_ELECTION', 'REFERENDUM'].map(type => (
                                            <MenuItem key={type} value={type}>{type.replace(/_/g, ' ')}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <DateTimePicker label="Election Date" value={createData.electionDate}
                                    onChange={(newValue) => setCreateData({ ...createData, electionDate: newValue || new Date() })}
                                    slotProps={{ textField: { size: 'small', fullWidth: true, required: true } }} />
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <TextField fullWidth type="number" label="Voting Days Limit" size="small" value={createData.votingDaysLimit}
                                    onChange={e => setCreateData({ ...createData, votingDaysLimit: parseInt(e.target.value) || 1 })} inputProps={{ min: 1 }} />
                                <TextField fullWidth type="number" label="Max Candidates/Voter" size="small" value={createData.maxCandidatesPerVoter}
                                    onChange={e => setCreateData({ ...createData, maxCandidatesPerVoter: parseInt(e.target.value) || 1 })} inputProps={{ min: 1 }} />
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button onClick={() => setCreateDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreateSubmit} disabled={isCreating || !createData.clubId || !createData.title}
                            sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>
                            {isCreating ? 'Creating...' : 'Create Election'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
                </Snackbar>
            </MotionBox>
        </LocalizationProvider>
    );
}
