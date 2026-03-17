'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Stack, alpha, useTheme, Paper, IconButton, Card, CardContent, Grid, Avatar,
    Snackbar, Alert, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Chip, Tabs, Tab, CircularProgress, TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PublishIcon from '@mui/icons-material/Publish';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useElection } from '@/hooks/useElection';
import type { CandidateResponse } from '@/features/election/types';

const MotionBox = motion.create(Box);

const STATUS_ORDER = ['DRAFT', 'NOMINATION_OPEN', 'NOMINATION_CLOSED', 'VOTING_OPEN', 'VOTING_CLOSED', 'RESULTS_PUBLISHED'];
const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft', NOMINATION_OPEN: 'Nominations Open', NOMINATION_CLOSED: 'Nominations Closed',
    VOTING_OPEN: 'Voting Open', VOTING_CLOSED: 'Voting Closed', RESULTS_PUBLISHED: 'Results Published',
    CANCELLED: 'Cancelled', ARCHIVED: 'Archived',
};
const STATUS_COLORS: Record<string, string> = {
    DRAFT: '#6B7280', NOMINATION_OPEN: '#F59E0B', NOMINATION_CLOSED: '#8B5CF6',
    VOTING_OPEN: '#10B981', VOTING_CLOSED: '#3B82F6', RESULTS_PUBLISHED: '#EC4899',
    CANCELLED: '#EF4444', ARCHIVED: '#9CA3AF',
};

function AdminCandidateCard({ candidate, onApprove, onReject, onDisqualify }: {
    candidate: CandidateResponse;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onDisqualify: (id: number) => void;
}) {
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
                {candidate.slogan && (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mb: 1 }}>
                        &ldquo;{candidate.slogan}&rdquo;
                    </Typography>
                )}
                {candidate.manifesto && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {candidate.manifesto}
                    </Typography>
                )}
                {candidate.rejectionReason && (
                    <Alert severity="error" variant="outlined" sx={{ mt: 1, borderRadius: 1, py: 0 }}>
                        <Typography variant="caption">{candidate.rejectionReason}</Typography>
                    </Alert>
                )}
            </CardContent>
            {(isPending || isApproved) && (
                <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0, borderTop: '1px solid', borderColor: 'divider', mt: 'auto', bgcolor: alpha('#000', 0.02) }}>
                    {isPending && (
                        <>
                            <Button fullWidth variant="contained" size="small" startIcon={<ThumbUpIcon />} onClick={() => onApprove(candidate.id)}
                                sx={{ textTransform: 'none', bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>Approve</Button>
                            <Button fullWidth variant="outlined" size="small" color="error" startIcon={<ThumbDownIcon />} onClick={() => onReject(candidate.id)}
                                sx={{ textTransform: 'none' }}>Reject</Button>
                        </>
                    )}
                    {isApproved && (
                        <Button fullWidth variant="outlined" size="small" color="warning" startIcon={<WarningAmberIcon />} onClick={() => onDisqualify(candidate.id)}
                            sx={{ textTransform: 'none' }}>Disqualify</Button>
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
    const [cancelReason, setCancelReason] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [rejectDialog, setRejectDialog] = useState<{ candidateId: number } | null>(null);
    const [disqualifyReason, setDisqualifyReason] = useState('');
    const [disqualifyDialog, setDisqualifyDialog] = useState<{ candidateId: number } | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const refreshData = () => {
        loadElectionById(electionId);
        adminGetCandidates(electionId);
        adminGetLiveVotes(electionId);
    };

    useEffect(() => {
        if (electionId) refreshData();
        return () => { resetSelectedElection(); resetCandidates(); };
    }, [electionId]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); setConfirmAction(null); }
        if (successMessage) {
            setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess(); setConfirmAction(null);
            refreshData();
        }
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
        switch (action) {
            case 'open_nom': return e.status === 'DRAFT';
            case 'close_nom': return e.status === 'NOMINATION_OPEN';
            case 'open_vote': return e.status === 'NOMINATION_CLOSED';
            case 'close_vote': return e.status === 'VOTING_OPEN';
            case 'publish': return e.status === 'VOTING_CLOSED';
            case 'cancel': return e.status !== 'CANCELLED' && e.status !== 'RESULTS_PUBLISHED' && e.status !== 'ARCHIVED';
            default: return false;
        }
    };

    const adminActions = [
        { id: 'open_nom', label: 'Open Nominations', icon: <PlayArrowIcon />, color: '#F59E0B', show: can('open_nom'), fn: () => adminForceOpenNominations(electionId) },
        { id: 'close_nom', label: 'Close Nominations', icon: <StopIcon />, color: '#8B5CF6', show: can('close_nom'), fn: () => adminForceCloseNominations(electionId) },
        { id: 'open_vote', label: 'Open Voting', icon: <PlayArrowIcon />, color: '#10B981', show: can('open_vote'), fn: () => adminForceOpenVoting(electionId) },
        { id: 'close_vote', label: 'Close Voting', icon: <StopIcon />, color: '#3B82F6', show: can('close_vote'), fn: () => adminForceCloseVoting(electionId) },
        { id: 'publish', label: 'Publish Results', icon: <PublishIcon />, color: '#EC4899', show: can('publish'), fn: () => adminForcePublishResults(electionId) },
        {
            id: 'cancel', label: 'Cancel Election', icon: <CancelIcon />, color: '#EF4444', show: can('cancel'),
            fn: () => adminForceCancel(electionId, cancelReason || 'Admin forced cancellation')
        },
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
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">TYPE</Typography>
                                    <Typography variant="body2" fontWeight={500}>{e.electionType.replace(/_/g, ' ')}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">APPROVED CANDIDATES</Typography>
                                    <Typography variant="body2" fontWeight={500}>{e.totalApprovedCandidates || 0} / {e.maxCandidates}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">NOMINATION PERIOD</Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {new Date(e.nominationStartTime).toLocaleDateString()} - {new Date(e.nominationEndTime).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">VOTING PERIOD</Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {new Date(e.votingStartTime).toLocaleDateString()} - {new Date(e.votingEndTime).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">WINNERS</Typography>
                                    <Typography variant="body2" fontWeight={500}>{e.winnersCount}</Typography>
                                </Grid>
                                {liveVoteCount && (
                                    <Grid size={{ xs: 6, sm: 4 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">LIVE VOTE COUNT</Typography>
                                        <Typography variant="body2" fontWeight={700} color="#10B981">{liveVoteCount.totalVotes} total votes</Typography>
                                    </Grid>
                                )}
                                <Grid size={{ xs: 6, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">SETTINGS</Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                        {e.isAnonymousVoting && <Chip label="Anonymous" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                        {e.requireManifesto && <Chip label="Manifesto Required" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                    </Stack>
                                </Grid>
                            </Grid>
                            {e.description && (
                                <>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mt: 2 }}>DESCRIPTION</Typography>
                                    <Typography variant="body2" color="text.secondary">{e.description}</Typography>
                                </>
                            )}
                            {e.eligibilityCriteria && (
                                <>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mt: 2 }}>ELIGIBILITY CRITERIA</Typography>
                                    <Typography variant="body2" color="text.secondary">{e.eligibilityCriteria}</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Lifecycle Actions</Typography>
                            <Stack spacing={1.5}>
                                {adminActions.filter(a => a.show).map(a => (
                                    <Box key={a.id}>
                                        {a.id === 'cancel' ? (
                                            <Stack spacing={1}>
                                                <TextField size="small" fullWidth placeholder="Cancellation reason..." value={cancelReason}
                                                    onChange={e => setCancelReason(e.target.value)}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                                                <Button fullWidth variant="outlined" color="error" startIcon={a.icon}
                                                    sx={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600 }}
                                                    onClick={() => handleActionClick(a.id, a.label, a.color, a.fn)}>
                                                    {a.label}
                                                </Button>
                                            </Stack>
                                        ) : (
                                            <Button fullWidth variant={a.id === 'delete' ? 'outlined' : 'contained'}
                                                startIcon={a.icon} color={a.id === 'delete' ? 'error' : 'inherit'}
                                                sx={{
                                                    justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600,
                                                    ...(a.id !== 'delete' && { bgcolor: a.color, color: '#fff', '&:hover': { bgcolor: alpha(a.color, 0.8) } })
                                                }}
                                                onClick={() => handleActionClick(a.id, a.label, a.color, a.fn)}>
                                                {a.label}
                                            </Button>
                                        )}
                                    </Box>
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
                                    : cPending.map(c => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={c.id}>
                                            <AdminCandidateCard candidate={c}
                                                onApprove={(id) => adminForceApproveCandidate(electionId, id)}
                                                onReject={(id) => { setRejectDialog({ candidateId: id }); setRejectReason(''); }}
                                                onDisqualify={(id) => { setDisqualifyDialog({ candidateId: id }); setDisqualifyReason(''); }}
                                            />
                                        </Grid>
                                    ))
                            )}
                            {activeTab === 1 && (
                                cApproved.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No approved candidates.</Typography>
                                    : cApproved.map(c => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={c.id}>
                                            <AdminCandidateCard candidate={c}
                                                onApprove={() => {}}
                                                onReject={() => {}}
                                                onDisqualify={(id) => { setDisqualifyDialog({ candidateId: id }); setDisqualifyReason(''); }}
                                            />
                                        </Grid>
                                    ))
                            )}
                            {activeTab === 2 && (
                                cOther.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No rejected/disqualified candidates.</Typography>
                                    : cOther.map(c => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={c.id}>
                                            <AdminCandidateCard candidate={c}
                                                onApprove={() => {}}
                                                onReject={() => {}}
                                                onDisqualify={() => {}}
                                            />
                                        </Grid>
                                    ))
                            )}
                        </Grid>
                    )}
                </Box>
            </Paper>

            {/* Confirm Action Dialog */}
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

            {/* Reject Candidate Dialog */}
            <Dialog open={!!rejectDialog} onClose={() => setRejectDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#EF4444' }}>Reject Candidate</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Provide a reason for rejecting this candidate.
                    </DialogContentText>
                    <TextField fullWidth label="Rejection Reason" value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)} size="small" multiline rows={2}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setRejectDialog(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={() => {
                        if (rejectDialog) {
                            adminForceRejectCandidate(electionId, rejectDialog.candidateId, rejectReason || undefined);
                            setRejectDialog(null);
                        }
                    }} sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700 }}>
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Disqualify Candidate Dialog */}
            <Dialog open={!!disqualifyDialog} onClose={() => setDisqualifyDialog(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#F59E0B' }}>Disqualify Candidate</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Provide a reason for disqualifying this candidate.
                    </DialogContentText>
                    <TextField fullWidth label="Disqualification Reason" value={disqualifyReason}
                        onChange={e => setDisqualifyReason(e.target.value)} size="small" multiline rows={2}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDisqualifyDialog(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" color="warning" onClick={() => {
                        if (disqualifyDialog) {
                            adminDisqualifyCandidate(electionId, disqualifyDialog.candidateId, disqualifyReason || undefined);
                            setDisqualifyDialog(null);
                        }
                    }} sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700 }}>
                        Disqualify
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
