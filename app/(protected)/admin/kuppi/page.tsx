'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Stack,
    Button,
    TextField,
    IconButton,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
    Tooltip,
    alpha,
    useTheme,
    Divider,
    useMediaQuery,
    Tabs,
    Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CloseIcon from '@mui/icons-material/Close';
import PendingIcon from '@mui/icons-material/Pending';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import DeleteIcon from '@mui/icons-material/Delete';

import { useAppDispatch, useAppSelector } from '@/store';
import {
    adminFetchApplications,
    adminFetchApplicationById,
    adminFetchApplicationStats,
    adminApproveApplicationAsync,
    adminRejectApplicationAsync,
    adminFetchPlatformStats,
    fetchSessions,
    fetchSessionById,
    fetchNoteById,
    fetchNotes,
    setKuppiCurrentPage,
    setKuppiPageSize,
    clearKuppiError,
    clearKuppiSuccessMessage,
    selectKuppiAllApplications,
    selectKuppiTotalApplications,
    selectKuppiApplicationStats,
    selectKuppiSelectedApplication,
    selectKuppiPlatformStats,
    selectKuppiSessions,
    selectKuppiNotes,
    selectKuppiTotalSessions,
    selectKuppiTotalNotes,
    selectKuppiCurrentPage,
    selectKuppiPageSize,
    selectKuppiIsApplicationLoading,
    selectKuppiIsSessionLoading,
    selectKuppiIsNoteLoading,
    selectKuppiIsLoading,
    selectKuppiError,
    selectKuppiSuccessMessage,
    selectKuppiIsCreating,
    selectKuppiIsUpdating,
    adminSoftDeleteSessionAsync,
    deleteNoteAsync,
    KuppiApplicationResponse,
    KuppiSessionResponse,
    KuppiNoteResponse,
    ApplicationStatus,
    SessionStatus,
} from '@/features/kuppi';
import * as kuppiServices from '@/features/kuppi/services';

// New component imports
import SessionSearchPanel from '@/components/kuppi/SessionSearchPanel';
import DownloadIcon from "@mui/icons-material/Download";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// Status colors
const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
    PENDING: '#F59E0B',
    UNDER_REVIEW: '#3B82F6',
    APPROVED: '#10B981',
    REJECTED: '#EF4444',
    CANCELLED: '#6B7280',
};

const SESSION_STATUS_COLORS: Record<SessionStatus, string> = {
    SCHEDULED: '#3B82F6',
    IN_PROGRESS: '#10B981',
    COMPLETED: '#6B7280',
    CANCELLED: '#EF4444',
};

// Get status icon
const getApplicationStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
        case 'PENDING': return <PendingIcon fontSize="small" />;
        case 'UNDER_REVIEW': return <HourglassEmptyIcon fontSize="small" />;
        case 'APPROVED': return <CheckCircleIcon fontSize="small" />;
        case 'REJECTED': return <CancelIcon fontSize="small" />;
        case 'CANCELLED': return <CancelIcon fontSize="small" />;
        default: return undefined;
    }
};

const getSessionStatusIcon = (status: SessionStatus) => {
    switch (status) {
        case 'SCHEDULED': return <EventIcon fontSize="small" />;
        case 'IN_PROGRESS': return <VideoCallIcon fontSize="small" />;
        case 'COMPLETED': return <CheckCircleIcon fontSize="small" />;
        case 'CANCELLED': return <CancelIcon fontSize="small" />;
        default: return undefined;
    }
};

export default function AdminKuppiDashboard() {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Selectors
    const applications = useAppSelector(selectKuppiAllApplications);
    const totalApplications = useAppSelector(selectKuppiTotalApplications);
    const applicationStats = useAppSelector(selectKuppiApplicationStats);
    const platformStats = useAppSelector(selectKuppiPlatformStats);
    const selectedApplication = useAppSelector(selectKuppiSelectedApplication);
    const sessions = useAppSelector(selectKuppiSessions);
    const notes = useAppSelector(selectKuppiNotes);
    const totalSessions = useAppSelector(selectKuppiTotalSessions);
    const totalNotes = useAppSelector(selectKuppiTotalNotes);
    const page = useAppSelector(selectKuppiCurrentPage);
    const pageSize = useAppSelector(selectKuppiPageSize);
    const isLoading = useAppSelector(selectKuppiIsLoading);
    const isApplicationLoading = useAppSelector(selectKuppiIsApplicationLoading);
    const isApproving = useAppSelector(selectKuppiIsCreating);
    const isRejecting = useAppSelector(selectKuppiIsUpdating);
    const error = useAppSelector(selectKuppiError);
    const successMessage = useAppSelector(selectKuppiSuccessMessage);

    // Local state
    // mainTab: 0 = Applications, 1 = Sessions, 2 = Notes
    const [mainTab, setMainTab] = useState(0);
    const [applicationStatusFilter, setApplicationStatusFilter] = useState<ApplicationStatus | ''>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedApp, setSelectedApp] = useState<KuppiApplicationResponse | null>(null);
    const [selectedSession, setSelectedSession] = useState<KuppiSessionResponse | null>(null);
    const [selectedNote, setSelectedNote] = useState<KuppiNoteResponse | null>(null);
    // viewMode determines which panel to show in the View dialog. Use explicit mode to avoid racey flashes when async fetches resolve.
    const [viewMode, setViewMode] = useState<'application' | 'session' | 'note' | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [actionLoading, setActionLoading] = useState(false);

    // New anchors for session & note action menus (3-dots)
    const [sessionAnchorEl, setSessionAnchorEl] = useState<null | HTMLElement>(null);
    const [sessionActionTarget, setSessionActionTarget] = useState<KuppiSessionResponse | null>(null);
    const [noteAnchorEl, setNoteAnchorEl] = useState<null | HTMLElement>(null);
    const [noteActionTarget, setNoteActionTarget] = useState<KuppiNoteResponse | null>(null);

    // New local state for session search/filter and modals
    const [filteredSessions, setFilteredSessions] = useState<KuppiSessionResponse[] | null>(null);

    // Fetch data on mount
    useEffect(() => {
        dispatch(adminFetchApplicationStats());
        dispatch(adminFetchPlatformStats());
        dispatch(adminFetchApplications({ page: 0, size: pageSize }));
        dispatch(fetchSessions({ page: 0, size: pageSize }));
        dispatch(fetchNotes({ page: 0, size: pageSize }));
    }, [dispatch, pageSize]);

    // Handle tab change
    const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setMainTab(newValue);
        // reset paging in slice
        dispatch(setKuppiCurrentPage(0));
        // fetch appropriate data for each tab immediately
        if (newValue === 0) {
            dispatch(adminFetchApplications({ page: 0, size: pageSize, status: applicationStatusFilter || undefined }));
        } else if (newValue === 1) {
            dispatch(fetchSessions({ page: 0, size: pageSize }));
        } else if (newValue === 2) {
            dispatch(fetchNotes({ page: 0, size: pageSize }));
        }
    };

    // Handle refresh
    const handleRefresh = useCallback(() => {
        dispatch(adminFetchApplicationStats());
        dispatch(adminFetchPlatformStats());
        // Note: mainTab mapping -> 0=Applications, 1=Sessions, 2=Notes
        if (mainTab === 0) {
            dispatch(adminFetchApplications({ page, size: pageSize, status: applicationStatusFilter || undefined }));
        } else if (mainTab === 1) {
            dispatch(fetchSessions({ page, size: pageSize }));
        } else if (mainTab === 2) {
            dispatch(fetchNotes({ page, size: pageSize }));
        }
        // clear filters when refreshing
        setFilteredSessions(null);
    }, [dispatch, mainTab, page, pageSize, applicationStatusFilter]);

    // Application handlers
    const handleApplicationMenuOpen = (event: React.MouseEvent<HTMLElement>, app: KuppiApplicationResponse) => {
        setAnchorEl(event.currentTarget);
        setSelectedApp(app);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewApplication = () => {
        handleMenuClose();
        if (selectedApp) {
            // clear other selections to avoid stale UI flashing
            setSelectedSession(null);
            setSelectedNote(null);
            // fetch application details and open dialog
            setViewMode('application');
            dispatch(adminFetchApplicationById(selectedApp.id));
            setViewDialogOpen(true);
        }
    };

    const handleApprove = () => {
        if (selectedApp) {
            dispatch(adminApproveApplicationAsync({ id: selectedApp.id, data: reviewNotes ? { reviewNotes } : undefined }));
            setApproveDialogOpen(false);
            setReviewNotes('');
        }
    };

    const handleReject = () => {
        if (selectedApp && rejectionReason) {
            dispatch(adminRejectApplicationAsync({ id: selectedApp.id, data: { rejectionReason, reviewNotes } }));
            setRejectDialogOpen(false);
            setRejectionReason('');
            setReviewNotes('');
        }
    };

    const handleMarkUnderReview = async () => {
        handleMenuClose();
        if (selectedApp) {
            try {
                await kuppiServices.adminMarkUnderReview(selectedApp.id);
                handleRefresh();
                setSnackbar({ open: true, message: 'Marked as under review', severity: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Failed to update', severity: 'error' });
            }
        }
    };

    // Session handlers
    const handleDeleteSession = async () => {
        if (selectedSession) {
            setActionLoading(true);
            try {
                // dispatch slice thunk and wait for result
                await dispatch(adminSoftDeleteSessionAsync(selectedSession.id)).unwrap();
                setDeleteDialogOpen(false);
                handleRefresh();
                setSnackbar({ open: true, message: 'Session deleted', severity: 'success' });
            } catch (err: unknown) {
                const message = (err as any)?.message || String(err) || 'Failed to delete session';
                setSnackbar({ open: true, message, severity: 'error' });
            } finally {
                setActionLoading(false);
            }
        }
    };

    // Session action menu (3-dot) handlers
    const handleSessionMenuOpen = (event: React.MouseEvent<HTMLElement>, session: KuppiSessionResponse) => {
        setSessionAnchorEl(event.currentTarget);
        setSessionActionTarget(session);
    };
    const handleSessionMenuClose = () => {
        setSessionAnchorEl(null);
        setSessionActionTarget(null);
    };

    const handleSessionView = async () => {
        handleSessionMenuClose();
        if (sessionActionTarget) {
            // clear other selections to avoid stale UI flashing
            setSelectedNote(null);
            setSelectedApp(null);
            // clear local selectedSession while loading
            setSelectedSession(null);
            setViewMode('session');
            setViewDialogOpen(true);
            try {
                const session = await dispatch(fetchSessionById(sessionActionTarget.id)).unwrap();
                // payload is the session detail
                setSelectedSession(session as KuppiSessionResponse);
            } catch (err: unknown) {
                const message = (err as any)?.message || String(err) || 'Failed to fetch session';
                setSnackbar({ open: true, message, severity: 'error' });
                // keep view closed on failure
                setViewDialogOpen(false);
                setViewMode(null);
            }
        }
    };

    const handleSessionDeleteConfirm = () => {
        handleSessionMenuClose();
        if (sessionActionTarget) {
            setSelectedSession(sessionActionTarget);
            setDeleteDialogOpen(true);
        }
    };

    // Note action menu (3-dot) handlers
    const handleNoteMenuOpen = (event: React.MouseEvent<HTMLElement>, note: KuppiNoteResponse) => {
        setNoteAnchorEl(event.currentTarget);
        setNoteActionTarget(note);
    };
    const handleNoteMenuClose = () => {
        setNoteAnchorEl(null);
        setNoteActionTarget(null);
    };

    const handleNoteView = async () => {
        handleNoteMenuClose();
        if (noteActionTarget) {
            // clear other selections to avoid stale UI flashing
            setSelectedSession(null);
            setSelectedApp(null);
            // clear local selectedNote while loading
            setSelectedNote(null);
            setViewMode('note');
            setViewDialogOpen(true);
            try {
                const note = await dispatch(fetchNoteById(noteActionTarget.id)).unwrap();
                setSelectedNote(note as KuppiNoteResponse);
            } catch (err: unknown) {
                const message = (err as any)?.message || String(err) || 'Failed to fetch note';
                setSnackbar({ open: true, message, severity: 'error' });
                setViewDialogOpen(false);
                setViewMode(null);
            }
        }
    };

    const handleNoteDeleteConfirm = () => {
        handleNoteMenuClose();
        if (noteActionTarget) {
            setSelectedNote(noteActionTarget);
            setDeleteDialogOpen(true);
        }
    };

    // Note delete handler (soft delete / delete note)
    const handleDeleteNote = async () => {
        if (selectedNote) {
            setActionLoading(true);
            try {
                await dispatch(deleteNoteAsync(selectedNote.id)).unwrap();
                setDeleteDialogOpen(false);
                handleRefresh();
                setSnackbar({ open: true, message: 'Note deleted', severity: 'success' });
            } catch (err: unknown) {
                const message = (err as any)?.message || String(err) || 'Failed to delete note';
                setSnackbar({ open: true, message, severity: 'error' });
            } finally {
                setActionLoading(false);
            }
        }
    };

    // Open a session by id and show the session view in the dialog.
    const openSessionById = async (sessionId?: number | string | null, prevNoteToRestore?: KuppiNoteResponse | null) => {
        if (sessionId === null || sessionId === undefined) {
            setSnackbar({ open: true, message: 'Session not available for this note', severity: 'error' });
            return;
        }
        // preserve prevNote to restore on error (when invoked from note view)
        const prevNote = prevNoteToRestore ?? null;
        // clear other selections
        setSelectedNote(null);
        setSelectedApp(null);
        setSelectedSession(null);
        setViewMode('session');
        setViewDialogOpen(true);
        try {
            const session = await dispatch(fetchSessionById(Number(sessionId))).unwrap();
            setSelectedSession(session as KuppiSessionResponse);
        } catch (err: unknown) {
            const message = (err as any)?.message || String(err) || 'Failed to open session';
            setSnackbar({ open: true, message, severity: 'error' });
            setViewDialogOpen(false);
            setViewMode(null);
            if (prevNote) {
                // restore note view if we were inside a note
                setSelectedNote(prevNote);
                setViewMode('note');
                setViewDialogOpen(true);
            }
        }
    };

    // Handle messages
    useEffect(() => {
        if (error) {
            setSnackbar({ open: true, message: error, severity: 'error' });
            dispatch(clearKuppiError());
        }
        if (successMessage) {
            setSnackbar({ open: true, message: successMessage, severity: 'success' });
            dispatch(clearKuppiSuccessMessage());
            handleRefresh();
        }
    }, [error, successMessage, dispatch, handleRefresh]);

    // session & note loading flags from store
    const isSessionLoading = useAppSelector(selectKuppiIsSessionLoading);
    const isNoteLoading = useAppSelector(selectKuppiIsNoteLoading);

    // Helper to render uploader which might be a string or an object
    const renderUploader = (note: KuppiNoteResponse) => {
        const u: any = (note as any).uploader;
        if (!u) return note.uploaderName ?? '';
        if (typeof u === 'string') return u;
        // try common fields
        return u.uploaderName ?? u.name ?? u.fullName ?? u.studentName ?? '';
    };

    // Overview stats
    const overviewStats = [
        { label: 'Total Sessions', value: platformStats?.totalSessions ?? 0, icon: EventIcon, color: '#3B82F6' },
        { label: 'Total Notes', value: platformStats?.totalNotes ?? 0, icon: DescriptionIcon, color: '#10B981' },
        { label: 'Kuppi Students', value: platformStats?.totalKuppiStudents ?? applicationStats?.totalKuppiStudents ?? 0, icon: SchoolIcon, color: '#8B5CF6' },
        { label: 'Total Views', value: platformStats?.totalViews ?? 0, icon: VisibilityIcon, color: '#F59E0B' },
        { label: 'Total Downloads', value: platformStats?.totalDownloads ?? 0, icon: DownloadIcon, color: '#EF4444' },
        { label: 'Pending Apps', value: applicationStats?.pendingApplications ?? 0, icon: PendingIcon, color: '#EC4899' },
    ];

    return (
        <MotionBox variants={containerVariants} initial="hidden" animate="show" sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1, sm: 2, md: 0 } }}>
            {/* Header */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>Kuppi Management</Typography>
                        <Typography variant="body2" color="text.secondary">Manage sessions, notes, and applications</Typography>
                    </Box>
                    <Tooltip title="Refresh">
                        <IconButton onClick={handleRefresh} disabled={isLoading} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </MotionBox>

            {/* Overview Stats */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    {overviewStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={index}>
                                <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, height: '100%' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(stat.color, 0.1) }}>
                                                <Icon sx={{ color: stat.color, fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>{stat.value}</Typography>
                                                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </MotionBox>

            {/* Main Tabs */}
            <MotionCard variants={itemVariants} elevation={0} sx={{ mb: 3, borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <CardContent sx={{ p: 2 }}>
                    <Tabs value={mainTab} onChange={handleMainTabChange} variant="scrollable" scrollButtons="auto">
                        <Tab label="Applications" icon={<AssignmentIcon />} iconPosition="start" />
                        <Tab label="Sessions" icon={<EventIcon />} iconPosition="start" />
                        <Tab label="Notes" icon={<DescriptionIcon />} iconPosition="start" />
                    </Tabs>
                </CardContent>
            </MotionCard>

            {/* Applications Tab (mounted always, hidden when inactive) */}
            <Box role="tabpanel" hidden={mainTab !== 0} sx={{ display: mainTab === 0 ? 'block' : 'none' }}>
                <MotionCard variants={itemVariants} elevation={0} sx={{ borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <CardContent sx={{ p: 2 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
                            <Tabs
                                value={applicationStatusFilter === '' ? 0 : applicationStatusFilter === 'PENDING' ? 1 : applicationStatusFilter === 'UNDER_REVIEW' ? 2 : 3}
                                onChange={(_, v) => {
                                    const statuses: (ApplicationStatus | '')[] = ['', 'PENDING', 'UNDER_REVIEW', 'APPROVED'];
                                    setApplicationStatusFilter(statuses[v]);
                                    dispatch(adminFetchApplications({ page: 0, size: pageSize, status: statuses[v] || undefined }));
                                }}
                                sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0 } }}
                            >
                                <Tab label="All" />
                                <Tab label="Pending" />
                                <Tab label="Under Review" />
                                <Tab label="Approved" />
                            </Tabs>
                        </Stack>
                    </CardContent>

                    {isApplicationLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
                    ) : applications.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                            <Typography color="text.secondary">No applications found</Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table size={isTablet ? 'small' : 'medium'}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Subjects</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>GPA</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {applications.map((app) => {
                                            const appColor = APPLICATION_STATUS_COLORS[(app.status as ApplicationStatus)] ?? '#6B7280';
                                            return (
                                                <TableRow key={app.id} hover>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                                            <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}>{app.studentName?.[0]}</Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>{app.studentName}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{app.studentEmail}</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                                                            {app.subjectsToTeach.slice(0, 2).map((s, i) => <Chip key={i} label={s} size="small" />)}
                                                            {app.subjectsToTeach.length > 2 && <Chip label={`+${app.subjectsToTeach.length - 2}`} size="small" />}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                                            <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
                                                            <Typography variant="body2" fontWeight={600}>{app.currentGpa.toFixed(2)}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getApplicationStatusIcon(app.status)}
                                                            label={app.statusDisplayName}
                                                            size="small"
                                                            sx={{ bgcolor: alpha(appColor, 0.1), color: appColor, '& .MuiChip-icon': { color: 'inherit' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small" onClick={(e) => handleApplicationMenuOpen(e, app)}><MoreVertIcon /></IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={totalApplications}
                                page={page}
                                onPageChange={(_, p) => { dispatch(setKuppiCurrentPage(p)); dispatch(adminFetchApplications({ page: p, size: pageSize, status: applicationStatusFilter || undefined })); }}
                                rowsPerPage={pageSize}
                                onRowsPerPageChange={(e) => { dispatch(setKuppiPageSize(parseInt(e.target.value, 10))); dispatch(setKuppiCurrentPage(0)); }}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </>
                    )}
                </MotionCard>
            </Box>

            {/* Sessions Tab (mounted always, hidden when inactive) */}
            <Box role="tabpanel" hidden={mainTab !== 1} sx={{ display: mainTab === 1 ? 'block' : 'none' }}>
                <MotionCard variants={itemVariants} elevation={0} sx={{ borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    {/* Search Panel - Always visible */}
                    <Box sx={{ mb: 2, p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <SessionSearchPanel onResults={(results) => setFilteredSessions(results)} />
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
                    ) : (
                        (() => {
                            const sessionsToShow = filteredSessions ?? sessions;
                            if (sessionsToShow.length === 0) {
                                return (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">No sessions found</Typography>
                                    </Box>
                                );
                            }
                            return (
                                <>
                                    <TableContainer>
                                        <Table size={isTablet ? 'small' : 'medium'}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Session</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Host</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Views</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sessionsToShow.map((session) => {
                                                    const sessionColor = SESSION_STATUS_COLORS[(session.status as SessionStatus)] ?? '#6B7280';
                                                    return (
                                                        <TableRow key={session.id} hover>
                                                            <TableCell>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight={600}>{session.title}</Typography>
                                                                    <Chip label={session.subject} size="small" sx={{ mt: 0.5 }} />
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                                <Typography variant="body2">{session.host?.fullName ?? ''}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    icon={getSessionStatusIcon(session.status)}
                                                                    label={session.status ?? '—'}
                                                                    size="small"
                                                                    sx={{ bgcolor: alpha(sessionColor, 0.1), color: sessionColor, '& .MuiChip-icon': { color: 'inherit' } }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                                <Typography variant="caption">{session.scheduledStartTime ? new Date(session.scheduledStartTime).toLocaleDateString() : ''}</Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">{session.viewCount}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <IconButton size="small" onClick={(e) => handleSessionMenuOpen(e, session)}><MoreVertIcon fontSize="small" /></IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={totalSessions}
                                        page={page}
                                        onPageChange={(_, p) => { dispatch(setKuppiCurrentPage(p)); dispatch(fetchSessions({ page: p, size: pageSize })); }}
                                        rowsPerPage={pageSize}
                                        onRowsPerPageChange={(e) => { dispatch(setKuppiPageSize(parseInt(e.target.value, 10))); dispatch(setKuppiCurrentPage(0)); }}
                                        rowsPerPageOptions={[5, 10, 25]}
                                    />
                                </>
                            );
                        })()
                    )}
                </MotionCard>
            </Box>

            {/* Session Action Menu (3-dot) */}
            <Menu anchorEl={sessionAnchorEl} open={Boolean(sessionAnchorEl)} onClose={handleSessionMenuClose}>
                <MenuItem onClick={handleSessionView}><VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />View</MenuItem>
                <MenuItem onClick={handleSessionDeleteConfirm} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />Delete</MenuItem>
            </Menu>

            {/* Note Action Menu (3-dot) */}
            <Menu anchorEl={noteAnchorEl} open={Boolean(noteAnchorEl)} onClose={handleNoteMenuClose}>
                <MenuItem onClick={handleNoteView}><VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />View</MenuItem>
                <MenuItem onClick={handleNoteDeleteConfirm} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />Delete</MenuItem>
            </Menu>

            {/* Application Action Menu (3-dot) */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleViewApplication}><VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />View</MenuItem>
                {selectedApp?.status === 'PENDING' && <MenuItem onClick={handleMarkUnderReview} sx={{ color: 'info.main' }}><HourglassEmptyIcon sx={{ mr: 1.5, fontSize: 20 }} />Mark Under Review</MenuItem>}
                {selectedApp?.canBeApproved && <MenuItem onClick={() => { handleMenuClose(); setApproveDialogOpen(true); }} sx={{ color: 'success.main' }}><ThumbUpIcon sx={{ mr: 1.5, fontSize: 20 }} />Approve</MenuItem>}
                {selectedApp?.canBeRejected && <MenuItem onClick={() => { handleMenuClose(); setRejectDialogOpen(true); }} sx={{ color: 'error.main' }}><ThumbDownIcon sx={{ mr: 1.5, fontSize: 20 }} />Reject</MenuItem>}
            </Menu>

            {/* Notes Tab (mounted always, hidden when inactive) */}
            <Box role="tabpanel" hidden={mainTab !== 2} sx={{ display: mainTab === 2 ? 'block' : 'none' }}>
                <MotionCard variants={itemVariants} elevation={0} sx={{ borderRadius: 1, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
                    ) : (
                        (() => {
                            if (!notes || notes.length === 0) {
                                return (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary">No notes found</Typography>
                                    </Box>
                                );
                            }
                            return (
                                <>
                                    <TableContainer>
                                        <Table size={isTablet ? 'small' : 'medium'}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Session</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Uploaded By</TableCell>
                                                    <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {notes.map((note) => (
                                                    <TableRow key={note.id} hover>
                                                        <TableCell>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>{note.title}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{note.description?.slice(0, 120)}</Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                            <Typography variant="body2" color={note.sessionId ? 'primary' : 'text.primary'} sx={{ cursor: note.sessionId ? 'pointer' : 'default' }} onClick={() => note.sessionId && openSessionById(note.sessionId)}>{note.sessionTitle ?? note.sessionId}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">{renderUploader(note)}</Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                            <Typography variant="caption">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}</Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton size="small" onClick={(e) => handleNoteMenuOpen(e, note)}><MoreVertIcon fontSize="small" /></IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        component="div"
                                        count={totalNotes}
                                        page={page}
                                        onPageChange={(_, p) => { dispatch(setKuppiCurrentPage(p)); dispatch(fetchNotes({ page: p, size: pageSize })); }}
                                        rowsPerPage={pageSize}
                                        onRowsPerPageChange={(e) => { dispatch(setKuppiPageSize(parseInt(e.target.value, 10))); dispatch(setKuppiCurrentPage(0)); }}
                                        rowsPerPageOptions={[5, 10, 25]}
                                    />
                                </>
                            );
                        })()
                    )}
                </MotionCard>
            </Box>

            {/* View Application Dialog */}
            <Dialog open={viewDialogOpen} onClose={() => {
                // clear selections when closing
                setViewDialogOpen(false);
                setSelectedNote(null);
                setSelectedSession(null);
                setSelectedApp(null);
            }} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600}>{viewMode === 'application' ? 'Application Details' : viewMode === 'session' ? 'Session Details' : viewMode === 'note' ? 'Note Details' : 'Details'}</Typography>
                        <IconButton onClick={() => {
                            // clear selections when closing
                            setViewDialogOpen(false);
                            setSelectedNote(null);
                            setSelectedSession(null);
                            setSelectedApp(null);
                            setViewMode(null);
                        }} size="small"><CloseIcon /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {/* show spinner while application detail loads, or while session detail is being fetched */}
                    {(isApplicationLoading && selectedApplication) || (isSessionLoading && !selectedSession) || (isNoteLoading && !selectedNote) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : viewMode === 'application' && selectedApplication ? (
                        // Application view (unchanged)
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.main }}>{selectedApplication.studentName?.[0]}</Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>{selectedApplication.studentName}</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedApplication.studentEmail}</Typography>
                                </Box>
                            </Stack>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">GPA</Typography><Typography variant="body1" fontWeight={600}>{selectedApplication.currentGpa.toFixed(2)}</Typography></Grid>
                                <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Semester</Typography><Typography variant="body1">{selectedApplication.currentSemester}</Typography></Grid>
                                <Grid size={{ xs: 6 }}><Typography variant="caption" color="text.secondary">Level</Typography><Typography variant="body1">{selectedApplication.preferredExperienceLevel}</Typography></Grid>
                                {(() => {
                                    const appColor = APPLICATION_STATUS_COLORS[(selectedApplication.status as ApplicationStatus)] ?? '#6B7280';
                                    return (<Grid size={{ xs: 6 }}>
                                        <Typography variant="caption" color="text.secondary">Status</Typography>
                                        <Chip icon={getApplicationStatusIcon(selectedApplication.status)} label={selectedApplication.statusDisplayName} size="small" sx={{ bgcolor: alpha(appColor, 0.1), color: appColor, '& .MuiChip-icon': { color: 'inherit' } }} />
                                    </Grid>);
                                })()}
                            </Grid>
                            <Box><Typography variant="caption" color="text.secondary">Subjects</Typography><Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5, gap: 0.5 }}>{selectedApplication.subjectsToTeach.map((s, i) => <Chip key={i} label={s} size="small" />)}</Stack></Box>
                            <Box><Typography variant="caption" color="text.secondary">Motivation</Typography><Typography variant="body2">{selectedApplication.motivation}</Typography></Box>
                            {selectedApplication.relevantExperience && <Box><Typography variant="caption" color="text.secondary">Experience</Typography><Typography variant="body2">{selectedApplication.relevantExperience}</Typography></Box>}
                        </Stack>
                    ) : viewMode === 'session' && selectedSession ? (
                        // Session view (expanded for admin)
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>{selectedSession.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedSession.subject} — Hosted by {selectedSession.host?.fullName ?? selectedSession.host?.name}</Typography>
                                </Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label={selectedSession.isActive ? 'Active' : 'Inactive'} color={selectedSession.isActive ? 'success' : 'default'} size="small" />
                                    <Chip label={selectedSession.canJoin ? 'Joinable' : 'Not Joinable'} color={selectedSession.canJoin ? 'success' : 'error'} size="small" />
                                </Stack>
                            </Stack>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Description</Typography>
                                    <Typography variant="body2">{selectedSession.description ?? '—'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Platform / Link</Typography>
                                    <Typography variant="body1">{selectedSession.meetingPlatform ?? selectedSession.sessionType ?? '—'}</Typography>
                                    {selectedSession.liveLink && (
                                        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.open(selectedSession.liveLink, '_blank')}>{selectedSession.liveLink}</Typography>
                                    )}
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="caption" color="text.secondary">Scheduled Start</Typography>
                                    <Typography variant="body1">{selectedSession.scheduledStartTime ? new Date(selectedSession.scheduledStartTime).toLocaleString() : '—'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="caption" color="text.secondary">Scheduled End</Typography>
                                    <Typography variant="body1">{selectedSession.scheduledEndTime ? new Date(selectedSession.scheduledEndTime).toLocaleString() : '—'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="caption" color="text.secondary">Duration</Typography>
                                    <Typography variant="body1">{selectedSession.scheduledStartTime && selectedSession.scheduledEndTime ? `${Math.round((new Date(selectedSession.scheduledEndTime).getTime() - new Date(selectedSession.scheduledStartTime).getTime())/60000)} mins` : '—'}</Typography>
                                </Grid>

                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Views</Typography>
                                    <Typography variant="body1">{selectedSession.viewCount ?? 0}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Notes</Typography>
                                    <Typography variant="body1">{selectedSession.notes ? selectedSession.notes.length : '—'}</Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                    ) : viewMode === 'note' && selectedNote ? (
                        // Note view styled like Session view (title + chips on top, description/file left, uploader right, metrics row)
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>{selectedNote.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedNote.sessionId ? (
                                            <span style={{ cursor: 'pointer', color: theme.palette.primary.main }} onClick={() => openSessionById(selectedNote.sessionId, selectedNote)}>{selectedNote.sessionTitle ?? selectedNote.sessionId}</span>
                                        ) : (
                                            (selectedNote.sessionTitle ? `${selectedNote.sessionTitle} • Note` : 'Note details')
                                        )}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label={selectedNote.isActive ? 'Active' : 'Inactive'} color={selectedNote.isActive ? 'success' : 'default'} size="small" />
                                    <Chip label={selectedNote.allowDownload ? 'Downloadable' : 'No Download'} color={selectedNote.allowDownload ? 'success' : 'default'} size="small" />
                                </Stack>
                            </Stack>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Description</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>{selectedNote.description ?? '—'}</Typography>

                                    <Typography variant="caption" color="text.secondary">File</Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Typography variant="body2" fontWeight={600}>{selectedNote.fileName ?? '—'}</Typography>
                                        {selectedNote.fileUrl && (
                                            <Typography variant="caption" color="primary" sx={{ display: 'block' }}><a href={selectedNote.fileUrl} target="_blank" rel="noreferrer">Open file URL</a></Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{selectedNote.fileType ?? ''}{selectedNote.formattedFileSize ? ` • ${selectedNote.formattedFileSize}` : selectedNote.fileSize ? ` • ${selectedNote.fileSize} bytes` : ''}</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="caption" color="text.secondary">Uploaded By</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={600}>{(selectedNote as any).uploader?.fullName ?? (selectedNote as any).uploaderName ?? renderUploader(selectedNote)}</Typography>
                                            <Typography variant="caption" color="text.secondary">{(selectedNote as any).uploader?.email ?? ''}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Downloads</Typography>
                                    <Typography variant="body1">{selectedNote.downloadCount ?? 0}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Views</Typography>
                                    <Typography variant="body1">{selectedNote.viewCount ?? 0}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Note ID</Typography>
                                    <Typography variant="body1">{selectedNote.id}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="caption" color="text.secondary">Created</Typography>
                                    <Typography variant="body1">{selectedNote.createdAt ? new Date(selectedNote.createdAt).toLocaleString() : '—'}</Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                    ) : null}
                </DialogContent>
            </Dialog>

            {/* Approve Application Dialog */}
            <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Approve Application</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Are you sure you want to approve this application? The student will be notified.
                    </Typography>
                    <TextField
                        label="Review Notes (optional)"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApproveDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleApprove} variant="contained" color="primary" disabled={isApproving}>
                        {isApproving ? <CircularProgress size={24} color="inherit" /> : 'Approve'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Application Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Application</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Are you sure you want to reject this application? The student will be notified.
                    </Typography>
                    <TextField
                        label="Rejection Reason"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Review Notes (optional)"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleReject} variant="contained" color="error" disabled={isRejecting}>
                        {isRejecting ? <CircularProgress size={24} color="inherit" /> : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button
                        onClick={selectedSession ? handleDeleteSession : handleDeleteNote}
                        variant="contained"
                        color="error"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbar.open}
                onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })}
                autoHideDuration={6000}
            >
                <Alert onClose={() => setSnackbar({ open: false, message: '', severity: 'success' })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MotionBox>
    );
}

