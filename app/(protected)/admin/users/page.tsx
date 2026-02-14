'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Stack, Button, TextField, IconButton,
    Avatar, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
    DialogActions, InputAdornment, Select, FormControl, InputLabel, Alert, Snackbar,
    CircularProgress, Tooltip, alpha, useTheme, Divider, useMediaQuery, Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { ROLE_LABELS, RoleType } from '@/constants/roles';
import { FACULTY, FACULTY_LABELS } from '@/constants/faculty';
import { CreateUserRequest, UpdateUserRequest, User } from '@/features/admin';
import {
    createUser,
    updateUserById,
    activateUser,
    deactivateUser,
} from '@/features/admin/services';
import { StatusType, STATUS_LABELS } from "@/constants";
import { useAppDispatch, useAppSelector } from '@/store';
import {
    fetchUsers,
    fetchUserStats,
    setSearchQuery as setSearchQueryAction,
    setRoleFilter as setRoleFilterAction,
    setStatusFilter as setStatusFilterAction,
    setCurrentPage,
    setPageSize,
    selectAdminUsers,
    selectAdminTotalUsers,
    selectAdminCurrentPage,
    selectAdminPageSize,
    selectAdminSearchQuery,
    selectAdminRoleFilter,
    selectAdminStatusFilter,
    selectAdminStats,
    selectAdminIsLoading,
    selectAdminError,
} from '@/features/admin';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const ROLE_COLORS: Record<string, string> = {
    ROLE_STUDENT: '#3B82F6',
    ROLE_ACADEMIC_STAFF: '#8B5CF6',
    ROLE_NON_ACADEMIC_STAFF: '#F59E0B',
    ROLE_ADMIN: '#EF4444',
    ROLE_SUPER_ADMIN: '#EC4899',
};

// Display item interface for table (maps from backend User)
interface UserDisplayItem {
    id: number;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string | null;
    role: RoleType;
    userType: string;
    active: boolean;
    status: StatusType
}

// Helper to map backend User to display format
const mapUserToDisplay = (user: User): UserDisplayItem => {
    const nameParts = user.fullName.split(' ');
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        profilePictureUrl: user.profilePictureUrl,
        role: user.role,
        userType: user.userType,
        active: user.active,
        status: (user as any).status || (user.active ? 'ACTIVE' : 'DEACTIVATE'),
    };
};

export default function AdminUsersPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    // Redux state
    const dispatch = useAppDispatch();
    const usersFromStore = useAppSelector(selectAdminUsers);
    const totalUsers = useAppSelector(selectAdminTotalUsers);
    const page = useAppSelector(selectAdminCurrentPage);
    const rowsPerPage = useAppSelector(selectAdminPageSize);
    const searchQuery = useAppSelector(selectAdminSearchQuery);
    const roleFilter = useAppSelector(selectAdminRoleFilter);
    const statusFilter = useAppSelector(selectAdminStatusFilter);
    const userStats = useAppSelector(selectAdminStats);
    const loading = useAppSelector(selectAdminIsLoading);
    const error = useAppSelector(selectAdminError);

    // Map users from store to display format
    const users = useMemo(() => usersFromStore.map(mapUserToDisplay), [usersFromStore]);

    // Local UI state
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedUser, setSelectedUser] = useState<UserDisplayItem | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce search query and dispatch to Redux
    useEffect(() => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }
        searchTimerRef.current = setTimeout(() => {
            if (localSearchQuery !== searchQuery) {
                dispatch(setSearchQueryAction(localSearchQuery));
            }
        }, 500);
        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
        };
    }, [localSearchQuery, searchQuery, dispatch]);

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | 'unlock' | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<CreateUserRequest & { id?: number }>>({});
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // Fetch users and stats on mount and when filters change
    useEffect(() => {
        dispatch(fetchUsers({
            page,
            size: rowsPerPage,
            searchQuery,
            roleFilter,
            statusFilter,
        }));
    }, [dispatch, searchQuery, roleFilter, statusFilter, page, rowsPerPage]);

    // Fetch stats on mount
    useEffect(() => {
        dispatch(fetchUserStats());
    }, [dispatch]);

    // Show error in snackbar
    useEffect(() => {
        if (error) {
            setSnackbar({ open: true, message: error, severity: 'error' });
        }
    }, [error]);

    // Refresh data handler
    const handleRefresh = useCallback(() => {
        dispatch(fetchUsers({
            page,
            size: rowsPerPage,
            searchQuery,
            roleFilter,
            statusFilter,
        }));
        dispatch(fetchUserStats());
    }, [dispatch, page, rowsPerPage, searchQuery, roleFilter, statusFilter]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: UserDisplayItem) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => setAnchorEl(null);
    const handleViewUser = () => { handleMenuClose(); setViewDialogOpen(true); };

const handleEditUser = () => {
        handleMenuClose();
        if (selectedUser) {
            setFormData({
                id: selectedUser.id,
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
                email: selectedUser.email,
                phone: '',
                role: selectedUser.role
            });
            setProfilePicturePreview(selectedUser.profilePictureUrl);
        }
        setEditDialogOpen(true);
    };

    const handleStatusAction = (action: 'activate' | 'deactivate' | 'unlock') => {
        handleMenuClose();
        setConfirmAction(action);
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedUser || !confirmAction) return;
        setSubmitting(true);
        try {
            let response;
            if (confirmAction === 'activate') {
                response = await activateUser(selectedUser.id);
            } else if (confirmAction === 'deactivate') {
                response = await deactivateUser(selectedUser.id);
            }

            if (response?.success) {
                setSnackbar({ open: true, message: response.message || `User ${confirmAction}d successfully`, severity: 'success' });
                setConfirmDialogOpen(false);
                dispatch(fetchUsers({ page, size: rowsPerPage, searchQuery, roleFilter, statusFilter }));
                dispatch(fetchUserStats()); // Refresh stats
            } else {
                throw new Error(response?.message || `Failed to ${confirmAction} user`);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${confirmAction} user`;
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateUser = () => {
        setFormData({ role: 'ROLE_STUDENT' as RoleType });
        setProfilePicture(null);
        setProfilePicturePreview(null);
        setFormErrors({});
        setCreateDialogOpen(true);
    };

    const validateForm = (isCreate: boolean = true): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
        if (isCreate && !formData.email?.trim()) errors.email = 'Email is required';
        if (isCreate && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
        if (!formData.role) errors.role = 'Role is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitCreate = async () => {
        if (!validateForm(true)) return;
        setSubmitting(true);
        try {
            // Build create data with all role-specific fields
            const createData: CreateUserRequest = {
                firstName: formData.firstName!,
                lastName: formData.lastName!,
                email: formData.email!,
                phone: formData.phone || '',
                role: formData.role!,
            };

            // Add role-specific fields
            if (formData.role === 'ROLE_STUDENT') {
                createData.studentId = formData.studentId;
                createData.batch = formData.batch;
                createData.program = formData.program;
                createData.faculty = formData.faculty;
                createData.dateOfBirth = formData.dateOfBirth;
                createData.address = formData.address;
            } else if (formData.role === 'ROLE_ACADEMIC_STAFF') {
                createData.employeeId = formData.employeeId;
                createData.position = formData.position;
                createData.designation = formData.designation;
                createData.department = formData.department;
                createData.faculty = formData.faculty;
            } else if (formData.role === 'ROLE_NON_ACADEMIC_STAFF') {
                createData.employeeId = formData.employeeId;
                createData.position = formData.position;
                createData.department = formData.department;
            }

            const response = await createUser(createData);

            if (response.success) {
                setSnackbar({ open: true, message: response.message || 'User created successfully', severity: 'success' });
                setCreateDialogOpen(false);
                setFormData({});
                dispatch(fetchUsers({ page, size: rowsPerPage, searchQuery, roleFilter, statusFilter }));
                dispatch(fetchUserStats()); // Refresh stats
            } else {
                throw new Error(response.message || 'Failed to create user');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create user';
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async () => {
        if (!validateForm(false) || !formData.id) return;
        setSubmitting(true);
        try {
            const updateData: UpdateUserRequest = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phone,
                role: formData.role,
                profilePicture: profilePicture || undefined,
                deleteProfilePicture: !profilePicture && !profilePicturePreview,
            };

            const response = await updateUserById(formData.id, updateData);

            if (response.success) {
                setSnackbar({ open: true, message: response.message || 'User updated successfully', severity: 'success' });
                setEditDialogOpen(false);
                setFormData({});
                setProfilePicture(null);
                setProfilePicturePreview(null);
                dispatch(fetchUsers({ page, size: rowsPerPage, searchQuery, roleFilter, statusFilter }));
            } else {
                throw new Error(response.message || 'Failed to update user');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user';
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setSnackbar({ open: true, message: 'Image must be less than 5MB', severity: 'error' });
                return;
            }
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePicturePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <CheckCircleIcon fontSize="small" />;
            case 'DEACTIVATE': return <BlockIcon fontSize="small" />;
            case 'SUSPENDED': return <LockIcon fontSize="small" />;
            case 'DELETED': return <DeleteIcon fontSize="small" />;
            case 'PASSWORD_CHANGE_REQUIRED': return <VpnKeyIcon fontSize="small" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return theme.palette.success.main;
            case 'DEACTIVATE': return theme.palette.warning.main;
            case 'SUSPENDED': return theme.palette.error.main;
            case 'DELETED': return theme.palette.grey[500];
            case 'PASSWORD_CHANGE_REQUIRED': return theme.palette.secondary.main;
            default: return theme.palette.grey[500];
        }
    };

    // Status-based stats
    const statusStats = [
        { label: 'Total Users', value: userStats?.totalUsers ?? 0, icon: GroupIcon, color: theme.palette.primary.main },
        { label: 'Active', value: userStats?.activeUsers ?? 0, icon: CheckCircleIcon, color: theme.palette.success.main },
        { label: 'Deactivated', value: userStats?.deactivatedUsers ?? 0, icon: BlockIcon, color: theme.palette.warning.main },
        { label: 'Suspended', value: userStats?.suspendedUsers ?? 0, icon: LockIcon, color: theme.palette.error.main },
        { label: 'Deleted', value: userStats?.deletedUsers ?? 0, icon: DeleteIcon, color: theme.palette.grey[600] },
        { label: 'Password Change', value: userStats?.passwordChangeRequiredUsers ?? 0, icon: VpnKeyIcon, color: theme.palette.secondary.main },
    ];

    // Role-based stats
    const roleStats = [
        { label: 'Students', value: userStats?.totalStudents ?? 0, icon: SchoolIcon, color: '#3B82F6' },
        { label: 'Academic Staff', value: userStats?.totalAcademicStaff ?? 0, icon: WorkIcon, color: '#8B5CF6' },
        { label: 'Non-Academic', value: userStats?.totalNonAcademicStaff ?? 0, icon: EngineeringIcon, color: '#F59E0B' },
    ];
    return (
        <MotionBox variants={containerVariants} initial="hidden" animate="show" sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1, sm: 2, md: 0 } }}>
            {/* Header */}
            <MotionBox variants={itemVariants} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
                    <Box>
                        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }} fontWeight={700} gutterBottom>User Management</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>Manage user accounts, roles, and permissions</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateUser}
                        sx={{ borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
                        fullWidth={isMobile}
                    >
                        Create User
                    </Button>
                </Stack>
            </MotionBox>

            {/* Status Stats Cards */}
            <MotionBox variants={itemVariants} sx={{ mb: 2 }}>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                    {statusStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={index}>
                                <MotionCard variants={itemVariants} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, height: '100%' }}>
                                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{
                                                width: { xs: 36, sm: 40 },
                                                height: { xs: 36, sm: 40 },
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: alpha(stat.color, 0.1),
                                                flexShrink: 0
                                            }}>
                                                <Icon sx={{ color: stat.color, fontSize: { xs: 18, sm: 20 } }} />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} fontWeight={700}>{stat.value}</Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, display: 'block' }}>{stat.label}</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </MotionBox>

            {/* Role Stats Cards */}
            <MotionBox variants={itemVariants} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                    {roleStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Grid size={{ xs: 6, sm: 4, md: 4 }} key={index}>
                                <MotionCard variants={itemVariants} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, height: '100%' }}>
                                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{
                                                width: { xs: 36, sm: 40 },
                                                height: { xs: 36, sm: 40 },
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: alpha(stat.color, 0.1),
                                                flexShrink: 0
                                            }}>
                                                <Icon sx={{ color: stat.color, fontSize: { xs: 18, sm: 20 } }} />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} fontWeight={700}>{stat.value}</Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, display: 'block' }}>{stat.label}</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </MotionBox>

            {/* Filters & Search */}
            <MotionCard variants={itemVariants} elevation={0} sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 2, md: 2 }}
                        alignItems={{ md: 'center' }}
                        justifyContent="space-between"
                    >
                        {/* Search Field */}
                        <TextField
                            placeholder="Search by name or email..."
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            size="small"
                            fullWidth
                            sx={{
                                maxWidth: { md: 350 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.background.default, 0.5),
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                        {/* Filters Row */}
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1.5, sm: 2 }}
                            alignItems={{ sm: 'center' }}
                            sx={{ width: { xs: '100%', md: 'auto' } }}
                        >
                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: { xs: '100%', sm: 140 },
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                }}
                            >
                                <InputLabel>Role</InputLabel>
                                <Select value={roleFilter} label="Role" onChange={(e) => dispatch(setRoleFilterAction(e.target.value as RoleType | ''))}>
                                    <MenuItem value="">All Roles</MenuItem>
                                    {Object.entries(ROLE_LABELS)
                                        .filter(([value]) => value !== 'ROLE_ADMIN' && value !== 'ROLE_SUPER_ADMIN')
                                        .map(([value, label]) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: { xs: '100%', sm: 160 },
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                }}
                            >
                                <InputLabel>Status</InputLabel>
                                <Select value={statusFilter} label="Status" onChange={(e) => dispatch(setStatusFilterAction(e.target.value as StatusType | ''))}>
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                    <MenuItem value="DEACTIVATE">Deactivate</MenuItem>
                                    <MenuItem value="SUSPENDED">Suspended</MenuItem>
                                    <MenuItem value="DELETED">Deleted</MenuItem>
                                    <MenuItem value="PASSWORD_CHANGE_REQUIRED">Password Change</MenuItem>
                                </Select>
                            </FormControl>

                            <Tooltip title="Refresh">
                                <IconButton
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    sx={{
                                        alignSelf: { xs: 'flex-end', sm: 'center' },
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                                        borderRadius: 2,
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    <RefreshIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardContent>
            </MotionCard>

            {/* Users List - Cards for Mobile, Table for Desktop */}
            <MotionCard variants={itemVariants} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : users.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                        <Typography color="text.secondary">No users found</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        {isMobile ? (
                            <Box sx={{ p: 1.5 }}>
                                <Stack spacing={1.5}>
                                    {users.map((user) => (
                                        <Paper
                                            key={user.id}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                                            }}
                                        >
                                            <Stack spacing={1.5}>
                                                {/* User Info Row */}
                                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Avatar
                                                            src={user.profilePictureUrl || undefined}
                                                            sx={{
                                                                bgcolor: ROLE_COLORS[user.role] || theme.palette.primary.main,
                                                                width: 44,
                                                                height: 44
                                                            }}
                                                        >
                                                            {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>{user.fullName}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{user.email}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Stack>

                                                {/* Chips Row */}
                                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                                                    <Chip
                                                        label={ROLE_LABELS[user.role] || user.role}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(ROLE_COLORS[user.role] || theme.palette.primary.main, 0.1),
                                                            color: ROLE_COLORS[user.role] || theme.palette.primary.main,
                                                            fontWeight: 500,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    />
                                                    <Chip
                                                        icon={getStatusIcon(user.status) || undefined}
                                                        label={STATUS_LABELS[user.status] || user.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(getStatusColor(user.status), 0.1),
                                                            color: getStatusColor(user.status),
                                                            fontWeight: 500,
                                                            fontSize: '0.7rem',
                                                            '& .MuiChip-icon': { color: 'inherit', fontSize: '0.9rem' }
                                                        }}
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                        ) : (
                            /* Desktop/Tablet Table View */
                            <TableContainer>
                                <Table size={isTablet ? 'small' : 'medium'}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                                            <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', lg: 'table-cell' } }}>User ID</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Avatar
                                                            src={user.profilePictureUrl || undefined}
                                                            sx={{
                                                                bgcolor: ROLE_COLORS[user.role] || theme.palette.primary.main,
                                                                width: { sm: 36, md: 40 },
                                                                height: { sm: 36, md: 40 }
                                                            }}
                                                        >
                                                            {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: { sm: '0.8rem', md: '0.875rem' } }}>{user.fullName}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: { md: 'none' } }}>{user.email}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>{user.userType}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                                    <Typography variant="body2" sx={{ fontSize: { md: '0.8rem', lg: '0.875rem' } }}>{user.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={ROLE_LABELS[user.role] || user.role}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(ROLE_COLORS[user.role] || theme.palette.primary.main, 0.1),
                                                            color: ROLE_COLORS[user.role] || theme.palette.primary.main,
                                                            fontWeight: 500,
                                                            fontSize: { sm: '0.7rem', md: '0.75rem' }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStatusIcon(user.status) || undefined}
                                                        label={STATUS_LABELS[user.status] || user.status}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: alpha(getStatusColor(user.status), 0.1),
                                                            color: getStatusColor(user.status),
                                                            fontWeight: 500,
                                                            fontSize: { sm: '0.7rem', md: '0.75rem' },
                                                            '& .MuiChip-icon': { color: 'inherit' }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                                                    <Typography variant="body2" color="text.secondary">ID: {user.id}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}><MoreVertIcon /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Pagination */}
                        <TablePagination
                            component="div"
                            count={totalUsers}
                            page={page}
                            onPageChange={(_, p) => dispatch(setCurrentPage(p))}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => dispatch(setPageSize(parseInt(e.target.value, 10)))}
                            rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
                            labelRowsPerPage={isMobile ? '' : 'Rows per page:'}
                            sx={{
                                '.MuiTablePagination-selectLabel': { display: { xs: 'none', sm: 'block' } },
                                '.MuiTablePagination-displayedRows': { fontSize: { xs: '0.75rem', sm: '0.875rem' } }
                            }}
                        />
                    </>
                )}
            </MotionCard>

            {/* Action Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <MenuItem onClick={handleViewUser}><VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />View Details</MenuItem>
                <MenuItem onClick={handleEditUser}><EditIcon sx={{ mr: 1.5, fontSize: 20 }} />Edit User</MenuItem>
                <Divider />
                {!selectedUser?.active && <MenuItem onClick={() => handleStatusAction('activate')} sx={{ color: 'success.main' }}><PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />Activate</MenuItem>}
                {selectedUser?.active && <MenuItem onClick={() => handleStatusAction('deactivate')} sx={{ color: 'warning.main' }}><PersonOffIcon sx={{ mr: 1.5, fontSize: 20 }} />Deactivate</MenuItem>}
            </Menu>

            {/* Create User Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 2,
                        m: isMobile ? 0 : 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: { xs: 2, sm: 1 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Create New User</Typography>
                        <IconButton onClick={() => setCreateDialogOpen(false)} size="small"><CloseIcon /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ pt: 1 }}>
                        {/* Basic Information */}
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1 }}>Basic Information</Typography>
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    size={isMobile ? 'small' : 'medium'}
                                    value={formData.firstName || ''}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    error={!!formErrors.firstName}
                                    helperText={formErrors.firstName}
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    value={formData.lastName || ''}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    error={!!formErrors.lastName}
                                    helperText={formErrors.lastName}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                    required
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={!!formErrors.role} required>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={formData.role || ''}
                                label="Role"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType })}
                            >
                                {Object.entries(ROLE_LABELS)
                                    .filter(([value]) => value !== 'ROLE_ADMIN' && value !== 'ROLE_SUPER_ADMIN')
                                    .map(([value, label]) => (
                                        <MenuItem key={value} value={value}>{label}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        {/* Role-Specific Fields */}
                        {formData.role && (
                            <>
                                <Divider />
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: -1 }}>
                                    {formData.role === 'ROLE_STUDENT' && 'Student Information'}
                                    {formData.role === 'ROLE_ACADEMIC_STAFF' && 'Academic Staff Information'}
                                    {formData.role === 'ROLE_NON_ACADEMIC_STAFF' && 'Non-Academic Staff Information'}
                                </Typography>

                                {/* Student Fields */}
                                {formData.role === 'ROLE_STUDENT' && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Student ID"
                                                    fullWidth
                                                    value={formData.studentId || ''}
                                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Batch"
                                                    fullWidth
                                                    value={formData.batch || ''}
                                                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                                    placeholder="e.g., 2024"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Program"
                                                    fullWidth
                                                    value={formData.program || ''}
                                                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                                    placeholder="e.g., BSc Computer Science"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Faculty</InputLabel>
                                                    <Select
                                                        value={formData.faculty || ''}
                                                        label="Faculty"
                                                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                                    >
                                                        {Object.entries(FACULTY).map(([key, value]) => (
                                                            <MenuItem key={key} value={value}>{FACULTY_LABELS[key]}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Date of Birth"
                                                    type="date"
                                                    fullWidth
                                                    value={formData.dateOfBirth || ''}
                                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Address"
                                                    fullWidth
                                                    value={formData.address || ''}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </Grid>
                                        </Grid>
                                    </>
                                )}

                                {/* Academic Staff Fields */}
                                {formData.role === 'ROLE_ACADEMIC_STAFF' && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Employee ID"
                                                    fullWidth
                                                    value={formData.employeeId || ''}
                                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Position"
                                                    fullWidth
                                                    value={formData.position || ''}
                                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                    placeholder="e.g., Senior Lecturer"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Designation"
                                                    fullWidth
                                                    value={formData.designation || ''}
                                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                    placeholder="e.g., Dr., Prof."
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
<TextField
                                            label="Department"
                                            fullWidth
                                            value={formData.department || ''}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            placeholder="e.g., Software Engineering"
                                        />
                                            </Grid>
                                        </Grid>
                                        <FormControl fullWidth>
                                            <InputLabel>Faculty</InputLabel>
                                            <Select
                                                value={formData.faculty || ''}
                                                label="Faculty"
                                                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                            >
                                                {Object.entries(FACULTY).map(([key, value]) => (
                                                    <MenuItem key={key} value={value}>{FACULTY_LABELS[key]}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </>
                                )}

                                {/* Non-Academic Staff Fields */}
                                {formData.role === 'ROLE_NON_ACADEMIC_STAFF' && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Employee ID"
                                                    fullWidth
                                                    value={formData.employeeId || ''}
                                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Position"
                                                    fullWidth
                                                    value={formData.position || ''}
                                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                    placeholder="e.g., Administrative Officer"
                                                />
                                            </Grid>
                                        </Grid>
                                        <TextField
                                            label="Department"
                                            fullWidth
                                            value={formData.department || ''}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            placeholder="e.g., Administration"
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmitCreate} disabled={submitting}>
                        {submitting ? <CircularProgress size={20} /> : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 2,
                        m: isMobile ? 0 : 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: { xs: 2, sm: 1 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Edit User</Typography>
                        <IconButton onClick={() => setEditDialogOpen(false)} size="small"><CloseIcon /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ pt: 1 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Avatar src={profilePicturePreview || undefined} sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, mx: 'auto', mb: 2, bgcolor: theme.palette.primary.main, fontSize: { xs: '1.5rem', sm: '2rem' } }}>{formData.firstName?.[0]}{formData.lastName?.[0]}</Avatar>
                            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} size="small">Upload<input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} /></Button>
                                {profilePicturePreview && <Button variant="outlined" color="error" startIcon={<DeleteIcon />} size="small" onClick={() => { setProfilePicture(null); setProfilePicturePreview(null); }}>Remove</Button>}
                            </Stack>
                        </Box>
                        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField label="First Name" fullWidth size={isMobile ? 'small' : 'medium'} value={formData.firstName || ''} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} error={!!formErrors.firstName} helperText={formErrors.firstName} /></Grid>
                            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Last Name" fullWidth size={isMobile ? 'small' : 'medium'} value={formData.lastName || ''} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} error={!!formErrors.lastName} helperText={formErrors.lastName} /></Grid>
                        </Grid>
                        <TextField label="Email" fullWidth size={isMobile ? 'small' : 'medium'} value={formData.email || ''} disabled helperText="Email cannot be changed" />
                        <TextField label="Phone Number" fullWidth size={isMobile ? 'small' : 'medium'} value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}><InputLabel>Role</InputLabel><Select value={formData.role || ''} label="Role" onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType })}>{Object.entries(ROLE_LABELS).map(([value, label]) => (<MenuItem key={value} value={value}>{label}</MenuItem>))}</Select></FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmitEdit} disabled={submitting}>{submitting ? <CircularProgress size={20} /> : 'Save Changes'}</Button>
                </DialogActions>
            </Dialog>

            {/* View User Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 2,
                        m: isMobile ? 0 : 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: { xs: 2, sm: 1 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>User Details</Typography>
                        <IconButton onClick={() => setViewDialogOpen(false)} size="small"><CloseIcon /></IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                    {selectedUser && (
                        <Stack spacing={{ xs: 2, sm: 3 }} sx={{ pt: 1 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Avatar src={selectedUser.profilePictureUrl || undefined} sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, mx: 'auto', mb: 2, bgcolor: ROLE_COLORS[selectedUser.role] || theme.palette.primary.main, fontSize: { xs: '1.5rem', sm: '2rem' } }}>{selectedUser.firstName?.[0] || ''}{selectedUser.lastName?.[0] || ''}</Avatar>
                                <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{selectedUser.fullName}</Typography>
                                <Chip label={ROLE_LABELS[selectedUser.role]} size="small" sx={{ mt: 1, bgcolor: alpha(ROLE_COLORS[selectedUser.role], 0.1), color: ROLE_COLORS[selectedUser.role] }} />
                            </Box>
                            <Divider />
                            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                <Grid size={{ xs: 12, sm: 6 }}><Stack direction="row" spacing={1.5} alignItems="center"><EmailIcon sx={{ color: 'text.secondary', fontSize: { xs: 20, sm: 24 } }} /><Box><Typography variant="caption" color="text.secondary">Email</Typography><Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, wordBreak: 'break-all' }}>{selectedUser.email}</Typography></Box></Stack></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><Stack direction="row" spacing={1.5} alignItems="center"><BadgeIcon sx={{ color: 'text.secondary', fontSize: { xs: 20, sm: 24 } }} /><Box><Typography variant="caption" color="text.secondary">User Type</Typography><Typography variant="body2">{selectedUser.userType}</Typography></Box></Stack></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><Stack direction="row" spacing={1.5} alignItems="center"><BadgeIcon sx={{ color: 'text.secondary', fontSize: { xs: 20, sm: 24 } }} /><Box><Typography variant="caption" color="text.secondary">Status</Typography><Chip icon={getStatusIcon(selectedUser.status) || undefined} label={STATUS_LABELS[selectedUser.status] || selectedUser.status} size="small" sx={{ bgcolor: alpha(getStatusColor(selectedUser.status), 0.1), color: getStatusColor(selectedUser.status) }} /></Box></Stack></Grid>
                                <Grid size={{ xs: 12, sm: 6 }}><Box><Typography variant="caption" color="text.secondary">User ID</Typography><Typography variant="body2">{selectedUser.id}</Typography></Box></Grid>
                            </Grid>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button onClick={() => setViewDialogOpen(false)} fullWidth={isMobile}>Close</Button>
                    <Button variant="contained" onClick={() => { setViewDialogOpen(false); handleEditUser(); }} fullWidth={isMobile}>Edit User</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Action Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2, m: { xs: 2, sm: 2 } }
                }}
            >
                <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{confirmAction === 'activate' && 'Activate User'}{confirmAction === 'deactivate' && 'Deactivate User'}</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {confirmAction === 'activate' && `Are you sure you want to activate ${selectedUser?.fullName}'s account?`}
                        {confirmAction === 'deactivate' && `Are you sure you want to deactivate ${selectedUser?.fullName}'s account? They will no longer be able to log in.`}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button onClick={() => setConfirmDialogOpen(false)} fullWidth={isMobile}>Cancel</Button>
                    <Button variant="contained" color={confirmAction === 'deactivate' ? 'warning' : 'success'} onClick={handleConfirmAction} disabled={submitting} fullWidth={isMobile}>{submitting ? <CircularProgress size={20} /> : 'Confirm'}</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
                sx={{ bottom: { xs: 16, sm: 24 } }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} variant="filled" sx={{ borderRadius: 2, width: { xs: '90vw', sm: 'auto' } }}>{snackbar.message}</Alert>
            </Snackbar>
        </MotionBox>
    );
}
