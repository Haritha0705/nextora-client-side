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
    LinearProgress,
    Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/hooks/useAuth';

export default function UserDashboard() {
    const { user, logout } = useAuth();

    const quickActions = [
        { icon: MenuBookIcon, title: 'My Courses', count: 6, color: '#2563EB' },
        { icon: AssignmentIcon, title: 'Assignments', count: 3, color: '#7C3AED' },
        { icon: EventIcon, title: 'Events', count: 5, color: '#059669' },
        { icon: NotificationsIcon, title: 'Notifications', count: 12, color: '#DC2626' },
    ];

    const upcomingClasses = [
        { subject: 'Data Structures', time: '9:00 AM', room: 'Room 301' },
        { subject: 'Web Development', time: '11:00 AM', room: 'Lab 2' },
        { subject: 'Database Systems', time: '2:00 PM', room: 'Room 205' },
    ];

    const assignments = [
        { title: 'Algorithm Analysis Report', due: 'Tomorrow', progress: 75 },
        { title: 'React Project', due: 'In 3 days', progress: 40 },
        { title: 'Database Design', due: 'Next week', progress: 10 },
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
                                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                            }}
                        >
                            {user?.firstName?.[0] || 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Welcome back, {user?.firstName || 'User'}!
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
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

                {/* Quick Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Grid size={{ xs: 6, md: 3 }} key={action.title}>
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
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    bgcolor: `${action.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Icon sx={{ color: action.color }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" fontWeight={700}>
                                                    {action.count}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {action.title}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Grid container spacing={3}>
                    {/* Today's Schedule */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <SchoolIcon color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Today&apos;s Classes
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    {upcomingClasses.map((cls, index) => (
                                        <Paper
                                            key={index}
                                            variant="outlined"
                                            sx={{ p: 2, borderRadius: 2 }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography fontWeight={600}>{cls.subject}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {cls.room}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={cls.time}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Assignments */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <AssignmentIcon color="secondary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Pending Assignments
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    {assignments.map((assignment, index) => (
                                        <Box key={index}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                                <Typography fontWeight={500}>{assignment.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Due: {assignment.due}
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={assignment.progress}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    bgcolor: 'grey.200',
                                                }}
                                            />
                                        </Box>
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

