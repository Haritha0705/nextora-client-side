'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Typography, Card, CardContent, TextField, MenuItem,
    Chip, Stack, Grid, alpha, useTheme, Button,
    Alert, Snackbar, CircularProgress, Stepper, Step, StepLabel, Paper, Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useAppDispatch, useAppSelector } from '@/store';
import {
    submitApplicationAsync, fetchActiveApplication, cancelApplicationAsync,
    checkCanApplyAsync, checkIsKuppiStudentAsync,
    selectKuppiActiveApplication, selectKuppiCanApply, selectKuppiIsKuppiStudent,
    selectKuppiIsCreating, selectKuppiError, selectKuppiSuccessMessage,
    clearKuppiError, clearKuppiSuccessMessage,
    CreateKuppiApplicationRequest, ExperienceLevel,
} from '@/features/kuppi';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const SUBJECT_OPTIONS = [
    'Data Structures', 'Algorithms', 'Object Oriented Programming',
    'Database Management', 'Web Development', 'Mobile Development',
    'Software Engineering', 'Computer Networks', 'Operating Systems',
    'Machine Learning', 'Artificial Intelligence', 'Mathematics', 'Statistics', 'Physics',
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string; color: string }[] = [
    { value: 'BEGINNER', label: 'Beginner', description: 'For students new to the subject', color: '#10B981' },
    { value: 'INTERMEDIATE', label: 'Intermediate', description: 'For students with some knowledge', color: '#3B82F6' },
    { value: 'ADVANCED', label: 'Advanced', description: 'For students with strong foundation', color: '#8B5CF6' },
];

const STEPS = ['Basic Info', 'Experience', 'Review'];
const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: 1, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } } };

export default function HostApplicationPage() {
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const activeApplication = useAppSelector(selectKuppiActiveApplication);
    const canApply = useAppSelector(selectKuppiCanApply);
    const isKuppiStudent = useAppSelector(selectKuppiIsKuppiStudent);
    const isCreating = useAppSelector(selectKuppiIsCreating);
    const error = useAppSelector(selectKuppiError);
    const successMessage = useAppSelector(selectKuppiSuccessMessage);

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        motivation: '', relevantExperience: '', subjectsToTeach: [] as string[],
        preferredExperienceLevel: 'INTERMEDIATE' as ExperienceLevel,
        availability: '', currentGpa: '', currentSemester: '',
    });
    const [newSubject, setNewSubject] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => { dispatch(checkCanApplyAsync()); dispatch(checkIsKuppiStudentAsync()); dispatch(fetchActiveApplication()); }, [dispatch]);

    const handleChange = (field: string, value: string | string[] | ExperienceLevel) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleAddSubject = () => {
        if (newSubject && !formData.subjectsToTeach.includes(newSubject) && formData.subjectsToTeach.length < 10) {
            handleChange('subjectsToTeach', [...formData.subjectsToTeach, newSubject]); setNewSubject('');
        }
    };
    const handleRemoveSubject = (subject: string) => handleChange('subjectsToTeach', formData.subjectsToTeach.filter(s => s !== subject));

    const validateStep = (): boolean => {
        const errors: Record<string, string> = {};
        if (activeStep === 0) {
            if (!formData.currentGpa) errors.currentGpa = 'GPA is required';
            else if (parseFloat(formData.currentGpa) < 0 || parseFloat(formData.currentGpa) > 4) errors.currentGpa = 'GPA must be between 0 and 4';
            if (!formData.currentSemester) errors.currentSemester = 'Current semester is required';
            if (formData.subjectsToTeach.length === 0) errors.subjectsToTeach = 'At least one subject is required';
        } else if (activeStep === 1) {
            if (!formData.motivation || formData.motivation.length < 50) errors.motivation = 'Motivation must be at least 50 characters';
            if (formData.motivation.length > 1000) errors.motivation = 'Motivation must be less than 1000 characters';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => { if (validateStep()) setActiveStep(prev => prev + 1); };
    const handleBack = () => setActiveStep(prev => prev - 1);

    const handleSubmit = () => {
        if (!validateStep()) return;
        dispatch(submitApplicationAsync({
            motivation: formData.motivation, relevantExperience: formData.relevantExperience || undefined,
            subjectsToTeach: formData.subjectsToTeach, preferredExperienceLevel: formData.preferredExperienceLevel,
            availability: formData.availability || undefined, currentGpa: parseFloat(formData.currentGpa), currentSemester: formData.currentSemester,
        }));
    };

    const handleCancelApplication = () => { if (activeApplication) dispatch(cancelApplicationAsync(activeApplication.id)); };

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); dispatch(clearKuppiError()); }
        if (successMessage) { setSnackbar({ open: true, message: successMessage, severity: 'success' }); dispatch(clearKuppiSuccessMessage()); }
    }, [error, successMessage, dispatch]);

    /* ── Already a Kuppi Host ── */
    if (isKuppiStudent) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
                <Paper elevation={0} sx={{ p: 5, borderRadius: 1, border: '1px solid', borderColor: alpha('#10B981', 0.3), textAlign: 'center' }}>
                    <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: alpha('#10B981', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <CheckCircleIcon sx={{ fontSize: 36, color: '#10B981' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>You're a Kuppi Host!</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>You can now create sessions and upload notes.</Typography>
                    <Button variant="contained" onClick={() => router.push('/student/kuppi/create')} sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700, boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}` }}>
                        Create a Session
                    </Button>
                </Paper>
            </Box>
        );
    }

    /* ── Active Application ── */
    if (activeApplication && !activeApplication.isFinalState) {
        const sc: Record<string, string> = { PENDING: '#F59E0B', UNDER_REVIEW: '#3B82F6' };
        const color = sc[activeApplication.status] || '#6B7280';
        return (
            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ maxWidth: 700, mx: 'auto' }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/student/kuppi')} sx={{ mb: 3, textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}>Back to Sessions</Button>
                <MotionCard variants={itemVariants} initial="hidden" animate="show" elevation={0} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                    <Box sx={{ height: 4, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, color }}>
                            <HourglassEmptyIcon sx={{ fontSize: 36 }} />
                        </Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom>Application {activeApplication.statusDisplayName}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Submitted on {new Date(activeApplication.submittedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}. We'll notify you once it's reviewed.
                        </Typography>
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', textAlign: 'left', mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary" fontWeight={600}>Current GPA</Typography><Typography variant="body1" fontWeight={700}>{activeApplication.currentGpa.toFixed(2)}</Typography></Grid>
                                <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary" fontWeight={600}>Semester</Typography><Typography variant="body1" fontWeight={600}>{activeApplication.currentSemester}</Typography></Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Subjects</Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                                        {activeApplication.subjectsToTeach.map((s, idx) => (
                                            <Chip key={idx} label={s} size="small" icon={<CheckCircleIcon sx={{ fontSize: 12, color: 'primary.main !important' }} />} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06), color: 'primary.main', fontWeight: 500, fontSize: '0.65rem' }} />
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>
                        {activeApplication.canBeCancelled && (
                            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleCancelApplication} sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600 }}>Cancel Application</Button>
                        )}
                    </CardContent>
                </MotionCard>
            </MotionBox>
        );
    }

    /* ── Cannot Apply ── */
    if (!canApply) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
                <Paper elevation={0} sx={{ p: 5, borderRadius: 1, border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.3), textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(theme.palette.info.main, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <SchoolIcon sx={{ fontSize: 32, color: 'info.main' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Cannot Apply</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto' }}>You are not eligible to apply at this time. This could be because you have a pending application or have already been approved/rejected.</Typography>
                </Paper>
            </Box>
        );
    }

    /* ══════════════  APPLICATION FORM  ══════════════ */
    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ maxWidth: 800, mx: 'auto' }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/student/kuppi')} sx={{ mb: 3, textTransform: 'none', color: 'text.secondary', fontWeight: 600, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                Back to Sessions
            </Button>

            <MotionCard variants={itemVariants} initial="hidden" animate="show" elevation={0} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Box sx={{ height: 4, background: `linear-gradient(90deg, ${theme.palette.primary.main}, #6366F1)` }} />
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6366F1 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                            <SchoolIcon sx={{ fontSize: 36, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>Become a Kuppi Host</Typography>
                        <Typography variant="body2" color="text.secondary">Share your knowledge and help fellow students succeed</Typography>
                    </Box>

                    {/* Stepper */}
                    <Stepper activeStep={activeStep} sx={{ mb: 4, '& .MuiStepLabel-label': { fontWeight: 600, fontSize: '0.8125rem' }, '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' }, '& .MuiStepIcon-root.Mui-completed': { color: '#10B981' } }}>
                        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                    </Stepper>

                    {/* ── Step 0: Basic Info ── */}
                    {activeStep === 0 && (
                        <Stack spacing={3}>
                            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Box sx={{ width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#3B82F6', 0.1) }}>
                                        <BadgeIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>Academic Details</Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Current GPA" type="number" fullWidth required value={formData.currentGpa}
                                            onChange={(e) => handleChange('currentGpa', e.target.value)} error={!!formErrors.currentGpa}
                                            helperText={formErrors.currentGpa || 'Enter your GPA (0.0 - 4.0)'} slotProps={{ htmlInput: { min: 0, max: 4, step: 0.01 } }} sx={fieldSx} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Current Semester" fullWidth required value={formData.currentSemester}
                                            onChange={(e) => handleChange('currentSemester', e.target.value)} error={!!formErrors.currentSemester}
                                            helperText={formErrors.currentSemester} placeholder="e.g., Year 3 Semester 1" sx={fieldSx} />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <Box sx={{ width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#F59E0B', 0.1) }}>
                                        <EmojiEventsIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700}>Subjects & Level</Typography>
                                </Stack>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>Subjects to Teach *</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                        <TextField select size="small" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} sx={{ minWidth: 200, ...fieldSx }} placeholder="Select a subject">
                                            {SUBJECT_OPTIONS.filter(s => !formData.subjectsToTeach.includes(s)).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                        </TextField>
                                        <Button variant="outlined" onClick={handleAddSubject} disabled={!newSubject} sx={{ borderRadius: 1, minWidth: 40 }}><AddIcon /></Button>
                                    </Stack>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                        {formData.subjectsToTeach.map((s) => <Chip key={s} label={s} onDelete={() => handleRemoveSubject(s)} size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06), color: 'primary.main', fontWeight: 500 }} />)}
                                    </Stack>
                                    {formErrors.subjectsToTeach && <Typography variant="caption" color="error">{formErrors.subjectsToTeach}</Typography>}
                                </Box>
                                <TextField label="Preferred Experience Level" select fullWidth value={formData.preferredExperienceLevel}
                                    onChange={(e) => handleChange('preferredExperienceLevel', e.target.value as ExperienceLevel)} sx={fieldSx}
                                >
                                    {EXPERIENCE_LEVELS.map((level) => (
                                        <MenuItem key={level.value} value={level.value}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: level.color }} />
                                                <Box><Typography variant="body2" fontWeight={600}>{level.label}</Typography><Typography variant="caption" color="text.secondary">{level.description}</Typography></Box>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Paper>
                        </Stack>
                    )}

                    {/* ── Step 1: Experience ── */}
                    {activeStep === 1 && (
                        <Stack spacing={3}>
                            <TextField label="Motivation" multiline rows={4} fullWidth required value={formData.motivation}
                                onChange={(e) => handleChange('motivation', e.target.value)} error={!!formErrors.motivation}
                                helperText={formErrors.motivation || `${formData.motivation.length}/1000 characters (min 50)`}
                                placeholder="Why do you want to become a Kuppi host? What motivates you to help other students?" sx={fieldSx}
                            />
                            <TextField label="Relevant Experience" multiline rows={3} fullWidth value={formData.relevantExperience}
                                onChange={(e) => handleChange('relevantExperience', e.target.value)}
                                helperText="Optional — Any tutoring, teaching, or mentoring experience"
                                placeholder="e.g., Tutored junior students, conducted study groups..." sx={fieldSx}
                            />
                            <TextField label="Availability" multiline rows={2} fullWidth value={formData.availability}
                                onChange={(e) => handleChange('availability', e.target.value)}
                                helperText="Optional — When are you typically available for sessions?"
                                placeholder="e.g., Weekday evenings 6-9 PM, Weekend mornings" sx={fieldSx}
                            />
                        </Stack>
                    )}

                    {/* ── Step 2: Review ── */}
                    {activeStep === 2 && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 3, borderRadius: 1, '& .MuiAlert-icon': { color: 'info.main' } }}>
                                Please review your application before submitting. You can go back to make changes.
                            </Alert>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                <Grid container spacing={2.5}>
                                    {[
                                        { label: 'Current GPA', value: formData.currentGpa },
                                        { label: 'Semester', value: formData.currentSemester },
                                    ].map((item, idx) => (
                                        <Grid size={{ xs: 6 }} key={idx}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                                            <Typography variant="body1" fontWeight={700}>{item.value}</Typography>
                                        </Grid>
                                    ))}
                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ my: 0.5 }} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Subjects</Typography>
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                                            {formData.subjectsToTeach.map((s) => <Chip key={s} label={s} size="small" icon={<CheckCircleIcon sx={{ fontSize: 12, color: 'primary.main !important' }} />} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06), color: 'primary.main', fontWeight: 500, fontSize: '0.65rem' }} />)}
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Experience Level</Typography>
                                        <Typography variant="body1" fontWeight={600}>{formData.preferredExperienceLevel}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ my: 0.5 }} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Motivation</Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>{formData.motivation}</Typography>
                                    </Grid>
                                    {formData.relevantExperience && (
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Experience</Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>{formData.relevantExperience}</Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        </Box>
                    )}

                    {/* Actions */}
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 4 }}>
                        <Button onClick={activeStep === 0 ? () => router.push('/student/kuppi') : handleBack} disabled={isCreating} sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}>
                            {activeStep === 0 ? 'Cancel' : 'Back'}
                        </Button>
                        {activeStep < STEPS.length - 1 ? (
                            <Button variant="contained" onClick={handleNext} sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700 }}>Next</Button>
                        ) : (
                            <Button variant="contained" startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                                onClick={handleSubmit} disabled={isCreating}
                                sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 700, px: 3, boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`, '&:hover': { boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}` } }}
                            >
                                {isCreating ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        )}
                    </Stack>
                </CardContent>
            </MotionCard>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
