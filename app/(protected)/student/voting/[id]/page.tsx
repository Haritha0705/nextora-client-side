'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Chip, Stack, alpha, useTheme, Paper, IconButton, Card, CardContent, Grid, Avatar,
    Tooltip, Snackbar, Alert, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, TextField, Stepper, Step, StepLabel, Divider, LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BallotIcon from '@mui/icons-material/Ballot';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useElection } from '@/hooks/useElection';
import type { CandidateResponse, ElectionStatus } from '@/features/election/types';

const MotionBox = motion.create(Box);

const STATUS_STEPS: ElectionStatus[] = ['DRAFT', 'NOMINATIONS_OPEN', 'NOMINATIONS_CLOSED', 'VOTING_OPEN', 'VOTING_CLOSED', 'RESULTS_PUBLISHED'];
const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft', NOMINATIONS_OPEN: 'Nominations Open', NOMINATIONS_CLOSED: 'Nominations Closed',
    VOTING_OPEN: 'Voting Open', VOTING_CLOSED: 'Voting Closed', RESULTS_PUBLISHED: 'Results Published', CANCELLED: 'Cancelled',
};
const STATUS_COLORS: Record<string, string> = {
    DRAFT: '#6B7280', NOMINATIONS_OPEN: '#F59E0B', NOMINATIONS_CLOSED: '#8B5CF6',
    VOTING_OPEN: '#10B981', VOTING_CLOSED: '#3B82F6', RESULTS_PUBLISHED: '#EC4899', CANCELLED: '#EF4444',
};

function CandidateCard({ candidate, isVotingOpen, hasVoted, selectedId, onSelect }: {
    candidate: CandidateResponse; isVotingOpen: boolean; hasVoted: boolean;
    selectedId: number | null; onSelect: (id: number) => void;
}) {
    const theme = useTheme();
    const isSelected = selectedId === candidate.id;

    return (
        <Card elevation={0} sx={{
            border: '2px solid', borderColor: isSelected ? '#10B981' : 'divider', borderRadius: 1,
            transition: 'all 0.25s ease', cursor: isVotingOpen && !hasVoted ? 'pointer' : 'default',
            ...(isVotingOpen && !hasVoted && {
                '&:hover': { borderColor: '#10B981', transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${alpha('#10B981', 0.15)}` },
            }),
            ...(isSelected && { boxShadow: `0 0 0 1px ${alpha('#10B981', 0.3)}, 0 4px 16px ${alpha('#10B981', 0.15)}` }),
        }} onClick={() => isVotingOpen && !hasVoted && onSelect(candidate.id)}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                            src={candidate.photoUrl || undefined}
                            sx={{
                                width: 56, height: 56, bgcolor: alpha('#3B82F6', 0.1), color: '#3B82F6',
                                border: '2px solid', borderColor: alpha('#3B82F6', 0.2), fontSize: '1.2rem', fontWeight: 700,
                            }}
                        >
                            {candidate.userName?.charAt(0) || <PersonIcon />}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body1" fontWeight={700} noWrap>{candidate.userName || `Candidate #${candidate.id}`}</Typography>
                            {candidate.slogan && (
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
                                    <FormatQuoteIcon sx={{ fontSize: 14, color: '#F59E0B', transform: 'scaleX(-1)' }} />
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic" noWrap>
                                        {candidate.slogan}
                                    </Typography>
                                </Stack>
                            )}
                        </Box>
                        {isSelected && <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28 }} />}
                    </Stack>

                    {candidate.manifesto && (
                        <Typography variant="body2" color="text.secondary" sx={{
                            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                        }}>
                            {candidate.manifesto}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {candidate.qualifications && (
                            <Chip label={candidate.qualifications} size="small" variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 22, maxWidth: 200 }} />
                        )}
                        {candidate.previousExperience && (
                            <Chip label={candidate.previousExperience} size="small" variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 22, maxWidth: 200 }} />
                        )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function ElectionDetailPage() {
    const theme = useTheme();
    const router = useRouter();
    const params = useParams();
    const electionId = Number(params.id);
    const {
        selectedElection, approvedCandidates, hasVoted, verificationToken, voteVerification,
        isDetailLoading, isCandidateLoading, isVoteLoading,
        error, successMessage,
        loadElectionWithCandidates, loadApprovedCandidates, checkHasVoted,
        castVote, verifyVote,
        clearError, clearSuccess, resetVoteState,
    } = useElection();

    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
    const [verifyToken, setVerifyToken] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        if (electionId) {
            loadElectionWithCandidates(electionId);
            checkHasVoted(electionId);
        }
        return () => { resetVoteState(); };
    }, [electionId]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); }
        if (successMessage) { setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess(); }
    }, [error, successMessage]);

    const election = selectedElection;
    const isVotingOpen = election?.status === 'VOTING_OPEN';
    const isNominationsOpen = election?.status === 'NOMINATIONS_OPEN';
    const isResultsPublished = election?.status === 'RESULTS_PUBLISHED';
    const statusStep = election ? STATUS_STEPS.indexOf(election.status) : 0;
    const statusColor = election ? STATUS_COLORS[election.status] || '#6B7280' : '#6B7280';

    const handleCastVote = useCallback(() => {
        if (selectedCandidateId && electionId) {
            castVote({ electionId, candidateId: selectedCandidateId }).then(() => {
                setConfirmDialogOpen(false);
                setSelectedCandidateId(null);
                checkHasVoted(electionId);
            });
        }
    }, [selectedCandidateId, electionId, castVote, checkHasVoted]);

    const handleVerifyVote = useCallback(() => {
        if (verifyToken && electionId) {
            verifyVote(electionId, verifyToken);
        }
    }, [verifyToken, electionId, verifyVote]);

    const selectedCandidate = approvedCandidates.find(c => c.id === selectedCandidateId);

    if (isDetailLoading) {
        return (
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={200} sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {[0, 1, 2].map(i => <Grid size={{ xs: 12, md: 4 }} key={i}><Skeleton variant="rounded" height={180} /></Grid>)}
                </Grid>
            </Box>
        );
    }

    if (!election) {
        return (
            <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Election not found</Typography>
                <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} sx={{ mt: 2, textTransform: 'none' }}>Go Back</Button>
            </Paper>
        );
    }

    return (
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={{ maxWidth: 1200, mx: 'auto' }}>
            {/* Back + Title */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <IconButton onClick={() => router.back()} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>{election.title}</Typography>
            </Stack>

            {/* Election Info Card */}
            <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'visible' }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip label={STATUS_LABELS[election.status]} size="small" sx={{
                                fontWeight: 600, bgcolor: alpha(statusColor, 0.1), color: statusColor,
                                border: '1px solid', borderColor: alpha(statusColor, 0.2),
                            }} />
                            <Chip label={election.electionType?.replace(/_/g, ' ')} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                            <Chip icon={<EventIcon sx={{ fontSize: '14px !important' }} />}
                                label={new Date(election.electionDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                size="small" sx={{ '& .MuiChip-icon': { color: 'inherit' } }} />
                            <Chip icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                                label={`${election.votingDaysLimit} day${election.votingDaysLimit !== 1 ? 's' : ''} voting`}
                                size="small" sx={{ '& .MuiChip-icon': { color: 'inherit' } }} />
                        </Stack>

                        {election.description && (
                            <Typography variant="body2" color="text.secondary">{election.description}</Typography>
                        )}

                        {/* Status Stepper */}
                        {election.status !== 'CANCELLED' && (
                            <Stepper activeStep={statusStep} alternativeLabel sx={{
                                '& .MuiStepIcon-root.Mui-completed': { color: '#10B981' },
                                '& .MuiStepIcon-root.Mui-active': { color: statusColor },
                                '& .MuiStepLabel-label': { fontSize: '0.7rem', mt: 0.5 },
                            }}>
                                {STATUS_STEPS.map(step => (
                                    <Step key={step}>
                                        <StepLabel>{STATUS_LABELS[step]}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}

                        {election.status === 'CANCELLED' && election.cancellationReason && (
                            <Alert severity="error" variant="outlined" sx={{ borderRadius: 1 }}>
                                <Typography variant="body2"><strong>Cancelled:</strong> {election.cancellationReason}</Typography>
                            </Alert>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Action Bar */}
            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                {isNominationsOpen && (
                    <Button variant="contained" startIcon={<AssignmentIndIcon />}
                        onClick={() => router.push(`/student/voting/nominate/${electionId}`)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, boxShadow: `0 4px 14px ${alpha('#F59E0B', 0.4)}`, bgcolor: '#F59E0B', '&:hover': { bgcolor: '#D97706' } }}>
                        Nominate Yourself
                    </Button>
                )}
                {isVotingOpen && !hasVoted && selectedCandidateId && (
                    <Button variant="contained" startIcon={<HowToVoteIcon />} onClick={() => setConfirmDialogOpen(true)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, boxShadow: `0 4px 14px ${alpha('#10B981', 0.4)}`, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>
                        Cast Vote
                    </Button>
                )}
                {hasVoted && (
                    <Chip icon={<CheckCircleIcon />} label="You have voted" color="success" sx={{ fontWeight: 600 }} />
                )}
                {hasVoted && (
                    <Button variant="outlined" startIcon={<VerifiedUserIcon />} onClick={() => setVerifyDialogOpen(true)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 600 }}>
                        Verify Vote
                    </Button>
                )}
                {isResultsPublished && (
                    <Button variant="contained" startIcon={<EmojiEventsIcon />}
                        onClick={() => router.push(`/student/voting/results/${electionId}`)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, boxShadow: `0 4px 14px ${alpha('#EC4899', 0.4)}`, bgcolor: '#EC4899', '&:hover': { bgcolor: '#DB2777' } }}>
                        View Results
                    </Button>
                )}
            </Stack>

            {/* Verification Token Display */}
            {verificationToken && (
                <Alert severity="info" variant="outlined" sx={{ mb: 3, borderRadius: 1 }}
                    action={<Button size="small" onClick={() => { navigator.clipboard.writeText(verificationToken); setSnackbar({ open: true, message: 'Token copied!', severity: 'success' }); }}>Copy</Button>}>
                    <Typography variant="body2"><strong>Verification Token:</strong> {verificationToken}</Typography>
                    <Typography variant="caption" color="text.secondary">Save this token to verify your vote later.</Typography>
                </Alert>
            )}

            {/* Candidates */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Candidates ({approvedCandidates.length})
            </Typography>

            {isCandidateLoading ? (
                <Grid container spacing={2}>
                    {[0, 1, 2].map(i => <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}><Skeleton variant="rounded" height={200} /></Grid>)}
                </Grid>
            ) : approvedCandidates.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <GroupsIcon sx={{ fontSize: 48, color: alpha(theme.palette.primary.main, 0.3), mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>No candidates yet</Typography>
                    <Typography variant="body2" color="text.secondary">Candidates will appear here once nominations are submitted and approved.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {approvedCandidates.map(candidate => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={candidate.id}>
                            <CandidateCard
                                candidate={candidate}
                                isVotingOpen={!!isVotingOpen}
                                hasVoted={hasVoted}
                                selectedId={selectedCandidateId}
                                onSelect={setSelectedCandidateId}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Vote Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Confirm Your Vote</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        You are about to vote for <strong>{selectedCandidate?.userName || `Candidate #${selectedCandidateId}`}</strong>.
                        This action cannot be undone.
                    </DialogContentText>
                    {selectedCandidate && (
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar src={selectedCandidate.photoUrl || undefined} sx={{ width: 48, height: 48, bgcolor: alpha('#3B82F6', 0.1), color: '#3B82F6' }}>
                                    {selectedCandidate.userName?.charAt(0) || <PersonIcon />}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight={700}>{selectedCandidate.userName}</Typography>
                                    {selectedCandidate.slogan && <Typography variant="body2" color="text.secondary" fontStyle="italic">{selectedCandidate.slogan}</Typography>}
                                </Box>
                            </Stack>
                        </Paper>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmDialogOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCastVote} disabled={isVoteLoading}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>
                        {isVoteLoading ? 'Voting...' : 'Confirm Vote'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Verify Vote Dialog */}
            <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>Verify Your Vote</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Enter your verification token to confirm your vote was recorded.
                    </DialogContentText>
                    <TextField fullWidth label="Verification Token" value={verifyToken} onChange={e => setVerifyToken(e.target.value)}
                        size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                    {voteVerification && (
                        <Alert severity={voteVerification.verified ? 'success' : 'error'} sx={{ mt: 2, borderRadius: 1 }}>
                            {voteVerification.verified
                                ? `Vote verified! Cast on ${new Date(voteVerification.votedAt).toLocaleString()}`
                                : 'Vote could not be verified. Please check your token.'}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => { setVerifyDialogOpen(false); setVerifyToken(''); }} sx={{ textTransform: 'none' }}>Close</Button>
                    <Button variant="contained" onClick={handleVerifyVote} disabled={!verifyToken || isVoteLoading}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700 }}>
                        {isVoteLoading ? 'Verifying...' : 'Verify'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
