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
    Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '@/hooks/useAuth';

export default function SuperAdminDashboard() {
    const { user, logout } = useAuth();

    const systemStats = [
        { icon: PeopleIcon, title: 'Total Users', count: '15,847', color: '#2563EB' },
        { icon: AdminPanelSettingsIcon, title: 'Administrators', count: '24', color: '#7C3AED' },
        { icon: StorageIcon, title: 'Storage Used', count: '78%', color: '#059669' },
        { icon: SecurityIcon, title: 'Security Score', count: '95%', color: '#DC2626' },
    ];

    const systemHealth = [
        { service: 'API Server', status: 'operational', uptime: '99.9%' },
        { service: 'Database', status: 'operational', uptime: '99.8%' },
        { service: 'Auth Service', status: 'operational', uptime: '100%' },
        { service: 'File Storage', status: 'warning', uptime: '98.5%' },
    ];

    const recentAuditLogs = [
        { action: 'User role changed', admin: 'System Admin', target: 'john.doe@uni.edu', time: '10 min ago' },
        { action: 'System config updated', admin: 'Super Admin', target: 'Email Settings', time: '1 hour ago' },
        { action: 'New admin created', admin: 'Super Admin', target: 'jane.smith@uni.edu', time: '2 hours ago' },
        { action: 'Backup completed', admin: 'System', target: 'Database', time: '6 hours ago' },
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
                                background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
                            }}
                        >
                            <AdminPanelSettingsIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Super Admin Console
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Welcome, {user?.firstName || 'Super Admin'}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<SettingsIcon />}
                            sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
                            }}
                        >
                            System Settings
                        </Button>
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
                </Stack>

                {/* System Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {systemStats.map((stat) => {
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
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 3,
                                                    bgcolor: `${stat.color}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Icon sx={{ color: stat.color, fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h4" fontWeight={700}>
                                                    {stat.count}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {stat.title}
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
                    {/* System Health */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <SecurityIcon color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        System Health
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    {systemHealth.map((item, index) => (
                                        <Paper
                                            key={index}
                                            variant="outlined"
                                            sx={{ p: 2, borderRadius: 2 }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    {item.status === 'operational' ? (
                                                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                                                    ) : (
                                                        <WarningIcon sx={{ color: 'warning.main' }} />
                                                    )}
                                                    <Box>
                                                        <Typography fontWeight={500}>{item.service}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Uptime: {item.uptime}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                                <Chip
                                                    label={item.status}
                                                    size="small"
                                                    color={item.status === 'operational' ? 'success' : 'warning'}
                                                />
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Audit Logs */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <HistoryIcon color="secondary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Recent Audit Logs
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    {recentAuditLogs.map((log, index) => (
                                        <Box key={index}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Box>
                                                    <Typography fontWeight={500}>{log.action}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        by {log.admin} → {log.target}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {log.time}
                                                </Typography>
                                            </Stack>
                                            {index < recentAuditLogs.length - 1 && <Divider sx={{ mt: 2 }} />}
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

