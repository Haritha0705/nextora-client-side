'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Stack, alpha, useTheme, Paper, IconButton, Card, CardContent, Grid, Avatar,
    Tooltip, Snackbar, Alert, Skeleton, LinearProgress, TextField, Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useElection } from '@/hooks/useElection';
import type { CandidateResultResponse } from '@/features/election/types';

const MotionBox = motion.create(Box);

function CandidateResultCard({ result, totalVotes, maxVotes }: { result: CandidateResultResponse; totalVotes: number; maxVotes: number }) {
    const theme = useTheme();
    const isWinner = result.isWinner;
    const barWidth = maxVotes > 0 ? (result.voteCount / maxVotes) * 100 : 0;

    return (
        <Paper elevation={0} sx={{
            p: 2.5, border: '1px solid', borderColor: isWinner ? '#F59E0B' : 'divider', borderRadius: 1,
            bgcolor: isWinner ? alpha('#F59E0B', 0.05) : 'background.paper', mb: 2,
            position: 'relative', overflow: 'hidden',
        }}>
            {isWinner && (
                <Box sx={{
                    position: 'absolute', top: 0, right: 0,
                    bgcolor: '#F59E0B', color: 'white', px: 2, py: 0.5,
                    borderBottomLeftRadius: 8, fontSize: '0.75rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 0.5,
                }}>
                    <EmojiEventsIcon sx={{ fontSize: 14 }} /> WINNER
                </Box>
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0, width: { xs: '100%', sm: 200 } }}>
                    <Avatar src={result.photoUrl || undefined} sx={{
                        width: 56, height: 56,
                        bgcolor: alpha(isWinner ? '#F59E0B' : '#3B82F6', 0.1),
                        color: isWinner ? '#F59E0B' : '#3B82F6',
                        border: '2px solid', borderColor: alpha(isWinner ? '#F59E0B' : '#3B82F6', 0.2),
                    }}>
                        {result.candidateName.charAt(0) || <PersonIcon />}
                    </Avatar>
                    <Box>
                        <Typography variant="body1" fontWeight={700} noWrap>{result.candidateName}</Typography>
                        {result.slogan && <Typography variant="caption" color="text.secondary" fontStyle="italic" noWrap sx={{ display: 'block' }}>{result.slogan}</Typography>}
                    </Box>
                </Stack>

                <Box sx={{ flex: 1, width: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color={isWinner ? '#F59E0B' : 'text.primary'}>
                            {result.voteCount} vote{result.voteCount !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color={isWinner ? '#F59E0B' : 'text.secondary'}>
                            {result.votePercentage.toFixed(1)}%
                        </Typography>
                    </Stack>
                    <Box sx={{ width: '100%', height: 12, bgcolor: alpha(theme.palette.text.primary, 0.08), borderRadius: 6, overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{ height: '100%', backgroundColor: isWinner ? '#F59E0B' : '#3B82F6', borderRadius: 6 }}
                        />
                    </Box>
                </Box>
            </Stack>
        </Paper>
    );
}

export default function ElectionResultsPage() {
    const theme = useTheme();
    const router = useRouter();
    const params = useParams();
    const electionId = Number(params.id);
    const {
        electionResults, isResultsLoading, isVoteLoading, voteVerification, error,
        loadResults, verifyVote, clearError, resetVoteState,
    } = useElection();

    const [verifyToken, setVerifyToken] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        if (electionId) loadResults(electionId);
        return () => { resetVoteState(); };
    }, [electionId]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); }
    }, [error]);

    const handleVerifyVote = () => {
        if (verifyToken && electionId) {
            verifyVote(electionId, verifyToken);
        }
    };

    if (isResultsLoading) {
        return (
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Skeleton variant="text" width={250} height={40} sx={{ mb: 4 }} />
                <Skeleton variant="rounded" height={120} sx={{ mb: 4 }} />
                {[0, 1, 2].map(i => <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />)}
            </Box>
        );
    }

    if (!electionResults) {
        return (
            <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Results not available</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    The results for this election are either not yet published or the election does not exist.
                </Typography>
                <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />} sx={{ textTransform: 'none' }}>Go Back</Button>
            </Paper>
        );
    }

    // Sort results by vote count descending
    const sortedResults = [...(electionResults.results || [])].sort((a, b) => b.voteCount - a.voteCount);
    const maxVotes = Math.max(...sortedResults.map(r => r.voteCount), 1);
    const totalVotes = electionResults.totalVotes;

    return (
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ maxWidth: 900, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
                <IconButton onClick={() => router.back()} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEventsIcon sx={{ color: '#F59E0B', fontSize: 32 }} /> Election Results
                    </Typography>
                    <Typography variant="body1" color="text.secondary">{electionResults.electionTitle}</Typography>
                </Box>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Official Tally</Typography>
                            {sortedResults.length === 0 ? (
                                <Typography color="text.secondary">No candidate results available.</Typography>
                            ) : (
                                sortedResults.map(result => (
                                    <CandidateResultCard
                                        key={result.candidateId}
                                        result={result}
                                        totalVotes={totalVotes}
                                        maxVotes={maxVotes}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: alpha('#3B82F6', 0.05) }}>
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                <TrendingUpIcon sx={{ fontSize: 40, color: '#3B82F6', mb: 1 }} />
                                <Typography variant="h3" fontWeight={800} color="#3B82F6">{totalVotes}</Typography>
                                <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Total Votes Cast</Typography>
                            </CardContent>
                        </Card>

                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                    <VerifiedUserIcon sx={{ color: '#10B981', fontSize: 24 }} />
                                    <Typography variant="h6" fontWeight={700}>Verify Your Vote</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    If you cast a vote in this election, enter your verification token to confirm it was counted.
                                </Typography>
                                <TextField fullWidth placeholder="Enter verification token" value={verifyToken}
                                    onChange={e => setVerifyToken(e.target.value)} size="small"
                                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                                <Button fullWidth variant="contained" onClick={handleVerifyVote} disabled={!verifyToken || isVoteLoading}
                                    sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700 }}>
                                    {isVoteLoading ? 'Verifying...' : 'Verify Vote'}
                                </Button>

                                <AnimatePresence>
                                    {voteVerification && (
                                        <MotionBox initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} sx={{ mt: 2 }}>
                                            <Alert severity={voteVerification.verified ? 'success' : 'error'} variant="outlined" sx={{ borderRadius: 1, '& .MuiAlert-message': { width: '100%' } }}>
                                                {voteVerification.verified ? (
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body2" fontWeight={700}>✅ Vote Verified Successfully</Typography>
                                                        <Typography variant="caption" color="text.secondary">Recorded at: {new Date(voteVerification.votedAt).toLocaleString()}</Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                            Your anonymously encrypted vote is officially included in the tally above.
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2">Token not found. Your vote could not be verified.</Typography>
                                                )}
                                            </Alert>
                                        </MotionBox>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
