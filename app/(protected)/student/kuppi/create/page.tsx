'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Typography, Card, CardContent, Button, TextField, Stack,
    MenuItem, alpha, useTheme, Alert, CircularProgress, Snackbar,
    Grid, Paper, Chip, Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import SchoolIcon from '@mui/icons-material/School';
import SubjectIcon from '@mui/icons-material/Subject';
import DescriptionIcon from '@mui/icons-material/Description';

import { useAppDispatch, useAppSelector } from '@/store';
import {
    createSessionAsync,
    checkIsKuppiStudentAsync,
    selectKuppiIsKuppiStudent,
    selectKuppiIsCreating,
    selectKuppiError,
    selectKuppiSuccessMessage,
    clearKuppiError,
    clearKuppiSuccessMessage,
    CreateKuppiSessionRequest,
} from '@/features/kuppi';

const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const SUBJECT_SUGGESTIONS = [
    'Data Structures', 'Algorithms', 'Object Oriented Programming',
    'Database Management', 'Web Development', 'Mobile Development',
    'Software Engineering', 'Computer Networks', 'Operating Systems',
    'Machine Learning', 'Artificial Intelligence', 'Mathematics',
    'Statistics', 'Physics',
];

const MEETING_PLATFORMS = ['Google Meet', 'Zoom', 'Microsoft Teams', 'Discord', 'Other'];

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 1,
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1 },
    },
};

export default function CreateKuppiSessionPage() {
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const isKuppiStudent = useAppSelector(selectKuppiIsKuppiStudent);
    const isCreating = useAppSelector(selectKuppiIsCreating);
    const error = useAppSelector(selectKuppiError);
    const successMessage = useAppSelector(selectKuppiSuccessMessage);

    const [formData, setFormData] = useState({
        title: '', subject: '', description: '',
        startDate: '', startTime: '', endDate: '', endTime: '',
        liveLink: '', meetingPlatform: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => { dispatch(checkIsKuppiStudentAsync()); }, [dispatch]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (formData.title.length > 200) errors.title = 'Title must be less than 200 characters';
        if (!formData.subject.trim()) errors.subject = 'Subject is required';
        if (!formData.startDate) errors.startDate = 'Start date is required';
        if (!formData.startTime) errors.startTime = 'Start time is required';
        if (!formData.endDate) errors.endDate = 'End date is required';
        if (!formData.endTime) errors.endTime = 'End time is required';
        if (!formData.liveLink.trim()) errors.liveLink = 'Meeting link is required';
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        if (endDateTime <= startDateTime) errors.endTime = 'End time must be after start time';
        if (startDateTime <= new Date()) errors.startDate = 'Session must be scheduled for a future date/time';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        const sessionData: CreateKuppiSessionRequest = {
            title: formData.title, subject: formData.subject,
            description: formData.description || undefined,
            scheduledStartTime: `${formData.startDate}T${formData.startTime}:00`,
            scheduledEndTime: `${formData.endDate}T${formData.endTime}:00`,
            liveLink: formData.liveLink, meetingPlatform: formData.meetingPlatform || undefined,
        };
        dispatch(createSessionAsync(sessionData));
    };

    useEffect(() => {
        if (error) { setSnackbar({ open: true, message: error, severity: 'error' }); dispatch(clearKuppiError()); }
        if (successMessage) { setSnackbar({ open: true, message: successMessage, severity: 'success' }); dispatch(clearKuppiSuccessMessage()); setTimeout(() => router.push('/student/kuppi'), 1500); }
    }, [error, successMessage, dispatch, router]);

    if (!isKuppiStudent) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
                <Paper elevation={0} sx={{ p: 5, borderRadius: 1, border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.3), textAlign: 'center' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(theme.palette.warning.main, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <SchoolIcon sx={{ fontSize: 32, color: 'warning.main' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Access Denied</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>You need to be a Kuppi Student to create sessions. Apply to become a host first.</Typography>
                    <Button variant="outlined" onClick={() => router.push('/student/kuppi/hosts')} sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600 }}>
                        Apply to Become a Host
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ maxWidth: 800, mx: 'auto' }}>
            {/* ── Header ── */}
            <MotionBox variants={itemVariants} initial="hidden" animate="show" sx={{ mb: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2, textTransform: 'none', color: 'text.secondary', fontWeight: 600, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                    Back
                </Button>
                <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>Create Session</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>Schedule a new Kuppi study session for your peers</Typography>
            </MotionBox>

            {/* ══════════════  FORM CARD  ══════════════ */}
            <MotionCard variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.06 }} elevation={0} sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                {/* Gradient accent */}
                <Box sx={{ height: 4, background: `linear-gradient(90deg, ${theme.palette.primary.main}, #6366F1)` }} />

                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Stack spacing={3.5}>
                        {/* ── Session Info ── */}
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <SubjectIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                <Typography variant="subtitle1" fontWeight={700}>Session Information</Typography>
                            </Stack>
                            <Stack spacing={2.5}>
                                <TextField label="Session Title" placeholder="e.g., Data Structures - Binary Trees" fullWidth required
                                    value={formData.title} onChange={(e) => handleChange('title', e.target.value)}
                                    error={!!formErrors.title} helperText={formErrors.title || 'Max 200 characters'} sx={fieldSx}
                                />
                                <TextField label="Subject" placeholder="e.g., Data Structures" fullWidth required select
                                    value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)}
                                    error={!!formErrors.subject} helperText={formErrors.subject} sx={fieldSx}
                                >
                                    {SUBJECT_SUGGESTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </TextField>
                                <TextField label="Description" placeholder="Describe what you'll cover in this session..." fullWidth multiline rows={4}
                                    value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
                                    helperText="Optional — Max 2000 characters" sx={fieldSx}
                                />
                            </Stack>
                        </Box>

                        <Divider />

                        {/* ── Schedule ── */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#3B82F6', 0.1) }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={700}>Schedule</Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Start Date" type="date" fullWidth required value={formData.startDate}
                                        onChange={(e) => handleChange('startDate', e.target.value)} error={!!formErrors.startDate}
                                        helperText={formErrors.startDate} slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Start Time" type="time" fullWidth required value={formData.startTime}
                                        onChange={(e) => handleChange('startTime', e.target.value)} error={!!formErrors.startTime}
                                        helperText={formErrors.startTime} slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="End Date" type="date" fullWidth required value={formData.endDate}
                                        onChange={(e) => handleChange('endDate', e.target.value)} error={!!formErrors.endDate}
                                        helperText={formErrors.endDate} slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="End Time" type="time" fullWidth required value={formData.endTime}
                                        onChange={(e) => handleChange('endTime', e.target.value)} error={!!formErrors.endTime}
                                        helperText={formErrors.endTime} slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* ── Meeting Details ── */}
                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#10B981', 0.1) }}>
                                    <VideoCallIcon sx={{ fontSize: 16, color: '#10B981' }} />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={700}>Meeting Details</Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Meeting Platform" fullWidth select value={formData.meetingPlatform}
                                        onChange={(e) => handleChange('meetingPlatform', e.target.value)} sx={fieldSx}
                                    >
                                        {MEETING_PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Meeting Link" placeholder="https://meet.google.com/..." fullWidth required
                                        value={formData.liveLink} onChange={(e) => handleChange('liveLink', e.target.value)}
                                        error={!!formErrors.liveLink} helperText={formErrors.liveLink} sx={fieldSx}
                                        slotProps={{ input: { startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> } }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Divider />

                        {/* ── Actions ── */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={() => router.back()} sx={{ borderRadius: 1, textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={isCreating ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
                                onClick={handleSubmit}
                                disabled={isCreating}
                                sx={{
                                    borderRadius: 1,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    px: 3,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    '&:hover': { boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}` },
                                }}
                            >
                                {isCreating ? 'Creating...' : 'Create Session'}
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </MotionCard>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
