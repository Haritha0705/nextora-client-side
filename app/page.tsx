'use client';

import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Grid,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function LandingPage() {
    const router = useRouter();

    const onUserLogin = () => router.push('/login');
    const onAdminLogin = () => router.push('/admin/login');

    const features = [
        { icon: SchoolIcon, title: 'Academic Excellence', description: 'Access courses, assignments, and grades' },
        { icon: MenuBookIcon, title: 'Learning Resources', description: 'Comprehensive digital library and materials' },
        { icon: GroupIcon, title: 'Collaboration', description: 'Connect with peers and educators' },
        { icon: EmojiEventsIcon, title: 'Track Progress', description: 'Monitor your academic journey' }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #EBF5FF 0%, #FFFFFF 50%, #F5F3FF 100%)',
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box component="header" sx={{ py: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Nextora
                            </Typography>
                        </Stack>

                        {/* Header Login Buttons */}
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                onClick={onUserLogin}
                                sx={{
                                    borderRadius: 2,
                                    borderColor: '#2563EB',
                                    color: '#2563EB',
                                    '&:hover': {
                                        borderColor: '#1D4ED8',
                                        bgcolor: 'rgba(37, 99, 235, 0.04)',
                                    },
                                }}
                            >
                                User Login
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AdminPanelSettingsIcon />}
                                onClick={onAdminLogin}
                                sx={{
                                    borderRadius: 2,
                                    background: 'linear-gradient(90deg, #7C3AED 0%, #9333EA 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #6D28D9 0%, #7E22CE 100%)',
                                    },
                                }}
                            >
                                Admin Login
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {/* Hero Section */}
                <Box sx={{ py: { xs: 8, lg: 12 } }}>
                    <Grid container spacing={6} alignItems="center">
                        {/* Left Content */}
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        fontSize: { xs: '2.5rem', lg: '3.5rem' },
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Welcome to
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'block',
                                            background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Nextora LMS
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mb: 4, fontWeight: 400, lineHeight: 1.7 }}
                                >
                                    Your comprehensive learning management system for modern education.
                                    Access courses, collaborate with peers, and excel in your academic journey.
                                </Typography>

                                {/* Login Cards */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                border: '2px solid transparent',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 40px rgba(37, 99, 235, 0.15)',
                                                    borderColor: '#2563EB',
                                                },
                                            }}
                                            onClick={onUserLogin}
                                        >
                                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: 3,
                                                        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 2,
                                                    }}
                                                >
                                                    <PersonIcon sx={{ color: 'white', fontSize: 32 }} />
                                                </Box>
                                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                                    Student / Staff
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Access your courses, events, and campus services
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{
                                                        background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 100%)',
                                                        borderRadius: 2,
                                                        py: 1.2,
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            background: 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 100%)',
                                                        },
                                                    }}
                                                >
                                                    User Login
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                border: '2px solid transparent',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 40px rgba(124, 58, 237, 0.15)',
                                                    borderColor: '#7C3AED',
                                                },
                                            }}
                                            onClick={onAdminLogin}
                                        >
                                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: 3,
                                                        background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 2,
                                                    }}
                                                >
                                                    <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 32 }} />
                                                </Box>
                                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                                    Administrator
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Manage users, content, and system settings
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{
                                                        background: 'linear-gradient(90deg, #7C3AED 0%, #9333EA 100%)',
                                                        borderRadius: 2,
                                                        py: 1.2,
                                                        fontWeight: 600,
                                                        '&:hover': {
                                                            background: 'linear-gradient(90deg, #6D28D9 0%, #7C3AED 100%)',
                                                        },
                                                    }}
                                                >
                                                    Admin Login
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Stats */}
                                <Box sx={{ pt: 4, borderTop: 1, borderColor: 'divider' }}>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 4 }}>
                                            <Typography variant="h4" color="primary" fontWeight={700}>
                                                10K+
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Students
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }}>
                                            <Typography variant="h4" fontWeight={700} sx={{ color: '#7C3AED' }}>
                                                500+
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Courses
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }}>
                                            <Typography variant="h4" color="primary" fontWeight={700}>
                                                200+
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Educators
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Image */}
                        <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)',
                                        borderRadius: 6,
                                        transform: 'rotate(3deg)',
                                        opacity: 0.2,
                                    }}
                                />
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
                                    alt="Students collaborating"
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 6,
                                        boxShadow: 6,
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Features Section */}
                <Box sx={{ py: 8 }}>
                    <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 6 }}>
                        Why Choose Nextora?
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                    <Card sx={{ height: '100%', borderRadius: 4, textAlign: 'center', p: 2 }}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    borderRadius: 3,
                                                    background: 'linear-gradient(135deg, #EBF5FF 0%, #F5F3FF 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 2,
                                                }}
                                            >
                                                <Icon sx={{ color: '#2563EB', fontSize: 28 }} />
                                            </Box>
                                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ py: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © 2026 Nextora LMS. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
