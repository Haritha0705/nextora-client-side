'use client';

import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Stack,
    Avatar,
    Button,
    Paper,
    Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    const stats = [
        { icon: PeopleIcon, title: 'Total Users', count: '2,547', trend: '+12%', color: '#2563EB' },
        { icon: SchoolIcon, title: 'Active Courses', count: '156', trend: '+8%', color: '#7C3AED' },
        { icon: EventIcon, title: 'Upcoming Events', count: '23', trend: '+5%', color: '#059669' },
        { icon: AssessmentIcon, title: 'Reports', count: '89', trend: '+15%', color: '#DC2626' },
    ];

    const recentActivities = [
        { action: 'New user registered', user: 'John Doe', time: '5 minutes ago', type: 'user' },
        { action: 'Course updated', user: 'Dr. Smith', time: '1 hour ago', type: 'course' },
        { action: 'Event created', user: 'Admin Team', time: '2 hours ago', type: 'event' },
        { action: 'Report generated', user: 'System', time: '3 hours ago', type: 'report' },
    ];

    const pendingApprovals = [
        { title: 'Event: Tech Summit 2026', type: 'Event', status: 'pending' },
        { title: 'Course: Advanced AI', type: 'Course', status: 'pending' },
        { title: 'User: Faculty Request', type: 'User', status: 'pending' },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                background: 'linear-gradient(135deg, #DC2626 0%, #7C3AED 100%)',
                            }}
                        >
                            {user?.firstName?.[0] || 'A'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Admin Dashboard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Welcome back, {user?.firstName || 'Admin'}
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={logout}
                        sx={{ borderRadius: 2 }}
                    >
                        Logout
                    </Button>
                </Stack>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Grid size={{ xs: 6, md: 3 }} key={stat.title}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {stat.title}
                                                </Typography>
                                                <Typography variant="h4" fontWeight={700}>
                                                    {stat.count}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                                                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                    <Typography variant="caption" color="success.main">
                                                        {stat.trend}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    bgcolor: `${stat.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Icon sx={{ color: stat.color }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Grid container spacing={3}>
                    {/* Recent Activity */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                    Recent Activity
                                </Typography>
                                <Stack spacing={2}>
                                    {recentActivities.map((activity, index) => (
                                        <Paper
                                            key={index}
                                            variant="outlined"
                                            sx={{ p: 2, borderRadius: 2 }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography fontWeight={500}>{activity.action}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        by {activity.user}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {activity.time}
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Pending Approvals */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                    Pending Approvals
                                </Typography>
                                <Stack spacing={2}>
                                    {pendingApprovals.map((item, index) => (
                                        <Paper
                                            key={index}
                                            variant="outlined"
                                            sx={{ p: 2, borderRadius: 2 }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography fontWeight={500}>{item.title}</Typography>
                                                    <Chip
                                                        label={item.type}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                                <Stack direction="row" spacing={1}>
                                                    <Button size="small" variant="contained" color="success">
                                                        Approve
                                                    </Button>
                                                    <Button size="small" variant="outlined" color="error">
                                                        Reject
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

