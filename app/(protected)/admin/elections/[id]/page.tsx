'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Stack, alpha, useTheme, Paper, IconButton, Card, CardContent, Grid, Avatar,
    Tooltip, Snackbar, Alert, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Chip, Tabs, Tab, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PublishIcon from '@mui/icons-material/Publish';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useElection } from '@/hooks/useElection';
import type { CandidateResponse } from '@/features/election/types';

const MotionBox = motion.create(Box);

const STATUS_ORDER = ['DRAFT', 'NOMINATIONS_OPEN', 'NOMINATIONS_CLOSED', 'VOTING_OPEN', 'VOTING_CLOSED', 'RESULTS_PUBLISHED'];
const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft', NOMINATIONS_OPEN: 'Nominations Open', NOMINATIONS_CLOSED: 'Nominations Closed',
    VOTING_OPEN: 'Voting Open', VOTING_CLOSED: 'Voting Closed', RESULTS_PUBLISHED: 'Results Published', CANCELLED: 'Cancelled',
};
const STATUS_COLORS: Record<string, string> = {
    DRAFT: '#6B7280', NOMINATIONS_OPEN: '#F59E0B', NOMINATIONS_CLOSED: '#8B5CF6',
    VOTING_OPEN: '#10B981', VOTING_CLOSED: '#3B82F6', RESULTS_PUBLISHED: '#EC4899', CANCELLED: '#EF4444',
};

function AdminCandidateCard({ candidate, onReview, onDisqualify }: { candidate: CandidateResponse; onReview: (id: number, approved: boolean) => void; onDisqualify: (id: number) => void }) {
    const isPending = candidate.status === 'PENDING';
    const isApproved = candidate.status === 'APPROVED';
    const isRejected = candidate.status === 'REJECTED';
    const isDisqualified = candidate.status === 'DISQUALIFIED';

    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: isApproved ? '#10B981' : isRejected ? '#EF4444' : isDisqualified ? '#6B7280' : 'divider', borderRadius: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 2, flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar src={candidate.photoUrl || undefined} sx={{ width: 48, height: 48, bgcolor: alpha('#3B82F6', 0.1), color: '#3B82F6' }}>
                        {candidate.userName?.charAt(0) || <PersonIcon />}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={700} noWrap>{candidate.userName || `User #${candidate.userId}`}</Typography>
                        <Chip label={candidate.status} size="small" sx={{
                            mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 600,
                            bgcolor: alpha(isApproved ? '#10B981' : isRejected ? '#EF4444' : isDisqualified ? '#6B7280' : '#F59E0B', 0.1),
                            color: isApproved ? '#10B981' : isRejected ? '#EF4444' : isDisqualified ? '#6B7280' : '#F59E0B',
                        }} />
                    </Box>
                </Stack>
                {candidate.manifesto && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {candidate.manifesto}
                    </Typography>
                )}
            </CardContent>
            {(isPending || isApproved) && (
                <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0, borderTop: '1px solid', borderColor: 'divider', mt: 'auto', bgcolor: alpha('#000', 0.02) }}>
                    {isPending && (
                        <>
                            <Button fullWidth variant="contained" size="small" startIcon={<ThumbUpIcon />} onClick={() => onReview(candidate.id, true)}
                                sx={{ textTransform: 'none', bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>Approve</Button>
                            <Button fullWidth variant="outlined" size="small" color="error" startIcon={<ThumbDownIcon />} onClick={() => onReview(candidate.id, false)}
                                sx={{ textTransform: 'none' }}>Reject</Button>
                        </>
                    )}
                    {isApproved && (
                        <Button fullWidth variant="outlined" size="small" color="warning" startIcon={<WarningAmberIcon />} onClick={() => onDisqualify(candidate.id)}
                            sx={{ textTransform: 'none' }}>Disqualify Candidate</Button>
                    )}
                </Stack>
            )}
        </Card>
    );
}

export default function AdminElectionDetailPage() {
    const theme = useTheme();
    const router = useRouter();
    const params = useParams();
    const electionId = Number(params.id);
    const {
        selectedElection, candidates, liveVoteCount,
        isDetailLoading, isCandidateLoading, isLifecycleLoading, error, successMessage,
        loadElectionById, adminGetCandidates, adminGetLiveVotes,
        adminForceOpenNominations, adminForceCloseNominations, adminForceOpenVoting, adminForceCloseVoting,
        adminForcePublishResults, adminForceCancel, adminResetVotes, adminPermanentDelete,
        adminForceApproveCandidate, adminForceRejectCandidate, adminDisqualifyCandidate,
        clearError, clearSuccess, resetSelectedElection, resetCandidates,
    } = useElection();

    const [activeTab, setActiveTab] = useState(0);
    const [confirmAction, setConfirmAction] = useState<{ action: string; label: string; color: string; handler: () => void } | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        if (electionId) {
            loadElectionById(electionId);
            adminGetCandidates(electionId);
            adminGetLiveVotes(electionId);
        }
        return () => { resetSelectedElection(); resetCandidates(); };
    }, [electionId]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); setConfirmAction(null); }
        if (successMessage) { setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess(); setConfirmAction(null); }
    }, [error, successMessage]);

    const handleActionClick = (action: string, label: string, color: string, handler: () => void) => {
        setConfirmAction({ action, label, color, handler });
    };

    const executeAction = () => {
        if (confirmAction) confirmAction.handler();
    };

    if (isDetailLoading || !selectedElection) {
        return (
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} sx={{ mb: 4 }} />
            </Box>
        );
    }

    const e = selectedElection;
    const sC = STATUS_COLORS[e.status] || '#6B7280';
    const sL = STATUS_LABELS[e.status] || e.status;
    const can = (action: string) => {
        const idx = STATUS_ORDER.indexOf(e.status);
        switch (action) {
            case 'open_nom': return e.status === 'DRAFT';
            case 'close_nom': return e.status === 'NOMINATIONS_OPEN';
            case 'open_vote': return e.status === 'NOMINATIONS_CLOSED';
            case 'close_vote': return e.status === 'VOTING_OPEN';
            case 'publish': return e.status === 'VOTING_CLOSED';
            case 'cancel': return e.status !== 'CANCELLED' && e.status !== 'RESULTS_PUBLISHED';
            default: return false;
        }
    };

    const adminActions = [
        { id: 'open_nom', label: 'Open Nominations', icon: <PlayArrowIcon />, color: '#F59E0B', show: can('open_nom'), fn: () => adminForceOpenNominations(electionId) },
        { id: 'close_nom', label: 'Close Nominations', icon: <StopIcon />, color: '#8B5CF6', show: can('close_nom'), fn: () => adminForceCloseNominations(electionId) },
        { id: 'open_vote', label: 'Open Voting', icon: <PlayArrowIcon />, color: '#10B981', show: can('open_vote'), fn: () => adminForceOpenVoting(electionId) },
        { id: 'close_vote', label: 'Close Voting', icon: <StopIcon />, color: '#3B82F6', show: can('close_vote'), fn: () => adminForceCloseVoting(electionId) },
        { id: 'publish', label: 'Publish Results', icon: <PublishIcon />, color: '#EC4899', show: can('publish'), fn: () => adminForcePublishResults(electionId) },
        { id: 'cancel', label: 'Cancel Election', icon: <CancelIcon />, color: '#EF4444', show: can('cancel'), fn: () => adminForceCancel(electionId, { reason: 'Admin forced cancellation' }) },
        { id: 'reset', label: 'Reset Votes', icon: <RestartAltIcon />, color: '#F59E0B', show: true, fn: () => adminResetVotes(electionId) },
        { id: 'delete', label: 'Permanent Delete', icon: <DeleteIcon />, color: '#DC2626', show: true, fn: () => adminPermanentDelete(electionId).then(() => router.push('/admin/elections')) },
    ];

    const cPending = candidates.filter(c => c.status === 'PENDING');
    const cApproved = candidates.filter(c => c.status === 'APPROVED');
    const cOther = candidates.filter(c => c.status === 'REJECTED' || c.status === 'DISQUALIFIED' || c.status === 'WITHDRAWN');

    return (
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton onClick={() => router.push('/admin/elections')} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsIcon sx={{ color: 'text.secondary', fontSize: 24 }} /> Manage: {e.title}
                    </Typography>
                </Stack>
                <Chip label={sL} sx={{ fontWeight: 700, bgcolor: alpha(sC, 0.1), color: sC, border: `1px solid ${alpha(sC, 0.2)}` }} />
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, minHeight: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Election Details</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">CLUB</Typography>
                                    <Typography variant="body2" fontWeight={500}>{e.clubName || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">DATE & YEAR</Typography>
                                    <Typography variant="body2" fontWeight={500}>{new Date(e.electionDate).toLocaleDateString()} ({e.electionYear})</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">TYPE</Typography>
                                    <Typography variant="body2" fontWeight={500}>{e.electionType.replace(/_/g, ' ')}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">APPROVED CANDIDATES</Typography>
                                    <Typography variant="body2" fontWeight={500}>{e.totalApprovedCandidates || 0}</Typography>
                                </Grid>
                                {liveVoteCount !== null && (
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">LIVE VOTE COUNT</Typography>
                                        <Typography variant="body2" fontWeight={700} color="#10B981">{typeof liveVoteCount === 'number' ? liveVoteCount : (liveVoteCount as any).voteCount || 0} total votes</Typography>
                                    </Grid>
                                )}
                            </Grid>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mt: 2 }}>DESCRIPTION</Typography>
                            <Typography variant="body2" color="text.secondary">{e.description}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Lifecycle Actions</Typography>
                            <Stack spacing={1.5}>
                                {adminActions.filter(a => a.show).map(a => (
                                    <Button key={a.id} fullWidth variant={a.id === 'delete' || a.id === 'cancel' ? 'outlined' : 'contained'}
                                        startIcon={a.icon} color={a.id === 'delete' ? 'error' : a.id === 'cancel' ? 'error' : 'inherit'}
                                        sx={{
                                            justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600,
                                            ...(a.id !== 'delete' && a.id !== 'cancel' && { bgcolor: a.color, color: '#fff', '&:hover': { bgcolor: alpha(a.color, 0.8) } })
                                        }}
                                        onClick={() => handleActionClick(a.id, a.label, a.color, a.fn)}>
                                        {a.label}
                                    </Button>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Candidate Review Section */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Candidate Management</Typography>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ minHeight: 48, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
                        <Tab label={`Pending Review (${cPending.length})`} sx={{ color: cPending.length > 0 ? '#F59E0B' : 'inherit' }} />
                        <Tab label={`Approved (${cApproved.length})`} />
                        <Tab label={`Other (${cOther.length})`} />
                    </Tabs>
                </Box>
                <Box sx={{ p: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                    {isCandidateLoading ? (
                        <Grid container spacing={2}>{[0, 1].map(i => <Grid size={{ xs: 12, md: 6 }} key={i}><Skeleton variant="rounded" height={160} /></Grid>)}</Grid>
                    ) : (
                        <Grid container spacing={2}>
                            {activeTab === 0 && (
                                cPending.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No pending candidates.</Typography>
                                    : cPending.map(c => <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={c.id}><AdminCandidateCard candidate={c} onReview={(id, a) => a ? adminForceApproveCandidate(electionId, id) : adminForceRejectCandidate(electionId, id)} onDisqualify={(id) => adminDisqualifyCandidate(electionId, id)} /></Grid>)
                            )}
                            {activeTab === 1 && (
                                cApproved.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No approved candidates.</Typography>
                                    : cApproved.map(c => <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={c.id}><AdminCandidateCard candidate={c} onReview={() => { }} onDisqualify={(id) => adminDisqualifyCandidate(electionId, id)} /></Grid>)
                            )}
                            {activeTab === 2 && (
                                cOther.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No rejected/disqualified candidates.</Typography>
                                    : cOther.map(c => <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={c.id}><AdminCandidateCard candidate={c} onReview={() => { }} onDisqualify={() => { }} /></Grid>)
                            )}
                        </Grid>
                    )}
                </Box>
            </Paper>

            <Dialog open={!!confirmAction} onClose={() => setConfirmAction(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: confirmAction?.color }}>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to <strong>{confirmAction?.label}</strong> for this election? This action may send notifications and lock certain data.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmAction(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={executeAction} disabled={isLifecycleLoading}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, bgcolor: confirmAction?.color, '&:hover': { filter: 'brightness(0.9)' } }}>
                        {isLifecycleLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
