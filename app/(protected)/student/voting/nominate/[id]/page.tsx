'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Stack, alpha, useTheme, Paper, IconButton, Card, CardContent,
    TextField, Button, Snackbar, Alert, Skeleton, Stepper, Step, StepLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useElection } from '@/hooks/useElection';

const MotionBox = motion.create(Box);

const STEPS = ['Personal Statement', 'Qualifications', 'Review & Submit'];

export default function NominationPage() {
    const theme = useTheme();
    const router = useRouter();
    const params = useParams();
    const electionId = Number(params.id);
    const {
        selectedElection, isDetailLoading, isCreating, error, successMessage,
        loadElectionById, nominateSelf, clearError, clearSuccess,
    } = useElection();

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        manifesto: '', slogan: '', qualifications: '', previousExperience: '',
    });
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { if (electionId) loadElectionById(electionId); }, [electionId]);

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); clearError(); }
        if (successMessage) { setSnackbar({ open: true, message: successMessage, severity: 'success' }); clearSuccess(); setSubmitted(true); }
    }, [error, successMessage]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onload = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        nominateSelf({
            electionId,
            manifesto: formData.manifesto,
            slogan: formData.slogan || undefined,
            qualifications: formData.qualifications || undefined,
            previousExperience: formData.previousExperience || undefined,
            photo: photo || undefined,
        });
    };

    const canProceedStep0 = formData.manifesto.trim().length >= 10;
    const canProceedStep1 = true;

    if (submitted) {
        return (
            <MotionBox initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} sx={{ maxWidth: 600, mx: 'auto', mt: 8 }}>
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: alpha('#10B981', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                        <CheckCircleIcon sx={{ fontSize: 44, color: '#10B981' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>Nomination Submitted!</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                        Your nomination has been submitted for review. You will be notified once it is approved.
                    </Typography>
                    <Button variant="contained" onClick={() => router.push(`/student/voting/${electionId}`)}
                        sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700 }}>
                        Back to Election
                    </Button>
                </Paper>
            </MotionBox>
        );
    }

    return (
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ maxWidth: 700, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <IconButton onClick={() => router.back()} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>Nominate Yourself</Typography>
                    {selectedElection && (
                        <Typography variant="body2" color="text.secondary">{selectedElection.title}</Typography>
                    )}
                </Box>
            </Stack>

            <Stepper activeStep={activeStep} sx={{
                mb: 4,
                '& .MuiStepIcon-root.Mui-completed': { color: '#10B981' },
                '& .MuiStepIcon-root.Mui-active': { color: theme.palette.primary.main },
                '& .MuiStepLabel-label': { fontSize: '0.8rem' },
            }}>
                {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <CardContent sx={{ p: 3 }}>
                    {activeStep === 0 && (
                        <Stack spacing={3}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <FormatQuoteIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                                    <Typography variant="body2" fontWeight={600}>Campaign Slogan (Optional)</Typography>
                                </Stack>
                                <TextField fullWidth placeholder="e.g. Together for a better campus" value={formData.slogan}
                                    onChange={e => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                                    size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                            </Box>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <DescriptionIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
                                    <Typography variant="body2" fontWeight={600}>Manifesto *</Typography>
                                </Stack>
                                <TextField fullWidth multiline rows={6} placeholder="Share your vision, goals, and plans..."
                                    value={formData.manifesto} onChange={e => setFormData(prev => ({ ...prev, manifesto: e.target.value }))}
                                    helperText={`${formData.manifesto.length} characters (minimum 10)`}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                            </Box>
                        </Stack>
                    )}

                    {activeStep === 1 && (
                        <Stack spacing={3}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <SchoolIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
                                    <Typography variant="body2" fontWeight={600}>Qualifications (Optional)</Typography>
                                </Stack>
                                <TextField fullWidth multiline rows={3} placeholder="Academic achievements, leadership roles..."
                                    value={formData.qualifications} onChange={e => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                            </Box>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <WorkIcon sx={{ fontSize: 18, color: '#10B981' }} />
                                    <Typography variant="body2" fontWeight={600}>Previous Experience (Optional)</Typography>
                                </Stack>
                                <TextField fullWidth multiline rows={3} placeholder="Relevant experience, past leadership..."
                                    value={formData.previousExperience} onChange={e => setFormData(prev => ({ ...prev, previousExperience: e.target.value }))}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }} />
                            </Box>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <CloudUploadIcon sx={{ fontSize: 18, color: '#EC4899' }} />
                                    <Typography variant="body2" fontWeight={600}>Campaign Photo (Optional)</Typography>
                                </Stack>
                                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}
                                    sx={{ textTransform: 'none', borderRadius: 1, borderStyle: 'dashed', py: 1.5, width: '100%' }}>
                                    {photo ? photo.name : 'Upload Photo'}
                                    <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                                </Button>
                                {photoPreview && (
                                    <Box sx={{ mt: 1, width: 80, height: 80, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                                        <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    )}

                    {activeStep === 2 && (
                        <Stack spacing={2}>
                            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                                Review Your Nomination
                            </Typography>
                            {formData.slogan && (
                                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha('#F59E0B', 0.05), border: '1px solid', borderColor: alpha('#F59E0B', 0.15), borderRadius: 1 }}>
                                    <Typography variant="caption" fontWeight={600} color="#F59E0B">SLOGAN</Typography>
                                    <Typography variant="body2" fontStyle="italic">&ldquo;{formData.slogan}&rdquo;</Typography>
                                </Paper>
                            )}
                            <Paper elevation={0} sx={{ p: 2, bgcolor: alpha('#3B82F6', 0.05), border: '1px solid', borderColor: alpha('#3B82F6', 0.15), borderRadius: 1 }}>
                                <Typography variant="caption" fontWeight={600} color="#3B82F6">MANIFESTO</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{formData.manifesto}</Typography>
                            </Paper>
                            {formData.qualifications && (
                                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha('#8B5CF6', 0.05), border: '1px solid', borderColor: alpha('#8B5CF6', 0.15), borderRadius: 1 }}>
                                    <Typography variant="caption" fontWeight={600} color="#8B5CF6">QUALIFICATIONS</Typography>
                                    <Typography variant="body2">{formData.qualifications}</Typography>
                                </Paper>
                            )}
                            {formData.previousExperience && (
                                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha('#10B981', 0.05), border: '1px solid', borderColor: alpha('#10B981', 0.15), borderRadius: 1 }}>
                                    <Typography variant="caption" fontWeight={600} color="#10B981">EXPERIENCE</Typography>
                                    <Typography variant="body2">{formData.previousExperience}</Typography>
                                </Paper>
                            )}
                        </Stack>
                    )}

                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
                        <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}
                            sx={{ textTransform: 'none', borderRadius: 1 }}>
                            Back
                        </Button>
                        {activeStep < 2 ? (
                            <Button variant="contained" onClick={() => setActiveStep(s => s + 1)}
                                disabled={activeStep === 0 && !canProceedStep0}
                                sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700 }}>
                                Next
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleSubmit} disabled={isCreating}
                                startIcon={<AssignmentIndIcon />}
                                sx={{ textTransform: 'none', borderRadius: 1, fontWeight: 700, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}>
                                {isCreating ? 'Submitting...' : 'Submit Nomination'}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
