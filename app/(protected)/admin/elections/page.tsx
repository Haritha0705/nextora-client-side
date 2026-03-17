'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, InputAdornment, Autocomplete, Chip, Stack, alpha,
    useTheme, Paper, IconButton, Card, CardContent, Grid, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Select, MenuItem,
    FormControl, InputLabel, Snackbar, Alert, LinearProgress, Skeleton, Switch, FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BallotIcon from '@mui/icons-material/Ballot';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CancelIcon from '@mui/icons-material/Cancel';
import ArchiveIcon from '@mui/icons-material/Archive';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useElection } from '@/hooks/useElection';
import { useClub } from '@/hooks/useClub';
import type { ElectionResponse, ElectionStatus, ElectionType } from '@/features/election/types';

const MotionBox = motion.create(Box);

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

const ELECTION_TYPES: ElectionType[] = ['PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'GENERAL', 'POLL', 'REFERENDUM'];

function AdminElectionCard({ election, onClick }: { election: ElectionResponse; onClick: () => void }) {
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
                        <Typography variant="caption" color="text.secondary" noWrap>ID: {election.id} {election.clubName ? `\u2022 ${election.clubName}` : ''}</Typography>
                    </Box>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClick(); }} sx={{ flexShrink: 0 }}>
                        <SettingsIcon fontSize="small" />
                    </IconButton>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip icon={statusConf.icon as React.ReactElement} label={statusConf.label} size="small"
                        sx={{ fontSize: '0.7rem', height: 22, fontWeight: 600, bgcolor: alpha(statusConf.color, 0.1), color: statusConf.color, border: `1px solid ${alpha(statusConf.color, 0.2)}`, '& .MuiChip-icon': { color: 'inherit' } }} />
                    <Chip label={election.electionType?.replace(/_/g, ' ')} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                    {election.totalVotes !== undefined && election.totalVotes > 0 && (
                        <Chip label={`${election.totalVotes} votes`} size="small" sx={{ fontSize: '0.7rem', height: 22, bgcolor: alpha('#10B981', 0.1), color: '#10B981' }} />
                    )}
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
        adminLoadAllElections, searchElections, createElection, clearError, clearSuccess, adminLoadStatisticsSummary,
    } = useElection();
    const { clubs, loadClubs, isClubLoading: isClubsLoading } = useClub();

    const [searchQuery, setSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const [createData, setCreateData] = useState({
        clubId: null as number | null,
        title: '',
        description: '',
        electionType: 'GENERAL' as ElectionType,
        nominationStartTime: new Date(),
        nominationEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        votingStartTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        votingEndTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        maxCandidates: 10,
        winnersCount: 1,
        isAnonymousVoting: true,
        requireManifesto: true,
        eligibilityCriteria: '',
    });

    useEffect(() => {
        adminLoadAllElections({ page: 0, size: 50 });
        adminLoadStatisticsSummary();
        loadClubs();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                searchElections({ keyword: searchQuery, page: 0, size: 50 });
            } else {
                adminLoadAllElections({ page: 0, size: 50 });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); }
        if (successMessage) {
            setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess();
            setCreateDialogOpen(false); adminLoadAllElections({ page: 0, size: 50 }); adminLoadStatisticsSummary();
        }
    }, [error, successMessage]);

    const handleCreateSubmit = () => {
        if (!createData.clubId) {
            setSnackbar({ open: true, message: 'Please select a club', severity: 'error' }); return;
        }
        if (!createData.title.trim()) {
            setSnackbar({ open: true, message: 'Please enter a title', severity: 'error' }); return;
        }
        createElection({
            clubId: createData.clubId,
            title: createData.title,
            description: createData.description || undefined,
            electionType: createData.electionType,
            nominationStartTime: createData.nominationStartTime.toISOString().replace('Z', ''),
            nominationEndTime: createData.nominationEndTime.toISOString().replace('Z', ''),
            votingStartTime: createData.votingStartTime.toISOString().replace('Z', ''),
            votingEndTime: createData.votingEndTime.toISOString().replace('Z', ''),
            maxCandidates: createData.maxCandidates,
            winnersCount: createData.winnersCount,
            isAnonymousVoting: createData.isAnonymousVoting,
            requireManifesto: createData.requireManifesto,
            eligibilityCriteria: createData.eligibilityCriteria || undefined,
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
                        : elections.length === 0 ? (
                            <Grid size={12}>
                                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>No elections found</Typography>
                                    <Typography variant="body2" color="text.secondary">Create your first election to get started.</Typography>
                                </Paper>
                            </Grid>
                        ) : elections.map(election => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={election.id}>
                                <AdminElectionCard election={election} onClick={() => router.push(`/admin/elections/${election.id}`)} />
                            </Grid>
                        ))}
                </Grid>

                {/* Create Election Dialog */}
                <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>Create New Election</DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Stack spacing={2.5} sx={{ mt: 1 }}>
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

                            <FormControl fullWidth size="small">
                                <InputLabel>Election Type</InputLabel>
                                <Select value={createData.electionType} label="Election Type"
                                    onChange={e => setCreateData({ ...createData, electionType: e.target.value as ElectionType })}>
                                    {ELECTION_TYPES.map(type => (
                                        <MenuItem key={type} value={type}>{type.replace(/_/g, ' ')}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mt: 1 }}>Nomination Period</Typography>
                            <Stack direction="row" spacing={2}>
                                <DateTimePicker label="Nomination Start" value={createData.nominationStartTime}
                                    onChange={(v) => v && setCreateData({ ...createData, nominationStartTime: v })}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                                <DateTimePicker label="Nomination End" value={createData.nominationEndTime}
                                    onChange={(v) => v && setCreateData({ ...createData, nominationEndTime: v })}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                            </Stack>

                            <Typography variant="body2" fontWeight={600} color="text.secondary">Voting Period</Typography>
                            <Stack direction="row" spacing={2}>
                                <DateTimePicker label="Voting Start" value={createData.votingStartTime}
                                    onChange={(v) => v && setCreateData({ ...createData, votingStartTime: v })}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                                <DateTimePicker label="Voting End" value={createData.votingEndTime}
                                    onChange={(v) => v && setCreateData({ ...createData, votingEndTime: v })}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }} />
                            </Stack>

                            <Stack direction="row" spacing={2}>
                                <TextField fullWidth type="number" label="Max Candidates" size="small" value={createData.maxCandidates}
                                    onChange={e => setCreateData({ ...createData, maxCandidates: parseInt(e.target.value) || 10 })} inputProps={{ min: 2 }} />
                                <TextField fullWidth type="number" label="Winners Count" size="small" value={createData.winnersCount}
                                    onChange={e => setCreateData({ ...createData, winnersCount: parseInt(e.target.value) || 1 })} inputProps={{ min: 1 }} />
                            </Stack>

                            <TextField fullWidth label="Eligibility Criteria" size="small" multiline rows={2}
                                placeholder="e.g. Must be an active member for at least 3 months"
                                value={createData.eligibilityCriteria}
                                onChange={e => setCreateData({ ...createData, eligibilityCriteria: e.target.value })} />

                            <Stack direction="row" spacing={2}>
                                <FormControlLabel control={
                                    <Switch checked={createData.isAnonymousVoting}
                                        onChange={e => setCreateData({ ...createData, isAnonymousVoting: e.target.checked })} />
                                } label="Anonymous Voting" />
                                <FormControlLabel control={
                                    <Switch checked={createData.requireManifesto}
                                        onChange={e => setCreateData({ ...createData, requireManifesto: e.target.checked })} />
                                } label="Require Manifesto" />
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
