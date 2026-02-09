// LoginLayout - Modern split-screen login layout
'use client';

import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export interface LoginLayoutProps {
    children: ReactNode;
    brandTitle?: string;
    heroTitle?: ReactNode;
    heroSubtitle?: string;
    features?: Array<{
        icon: ReactNode;
        title: string;
        description: string;
    }>;
    footerText?: string;
    showBackButton?: boolean;
    onBack?: () => void;
}

// Default features for the left panel
const defaultFeatures = [
    {
        icon: <SchoolIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
        title: 'Campus Management',
        description: 'Complete university management system',
    },
    {
        icon: <SecurityIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
        title: 'Secure Authentication',
        description: 'Role-based access control for all users',
    },
    {
        icon: <NotificationsActiveIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
        title: 'Real-time Notifications',
        description: 'Stay updated with push notifications',
    },
];

export function LoginLayout({
    children,
    brandTitle = 'Nextora',
    heroTitle = (
        <>
            Empowering Education.
            <br />
            Simplifying Management.
        </>
    ),
    heroSubtitle = 'A comprehensive campus management platform designed for students, staff, and administrators.',
    features = defaultFeatures,
    footerText = 'Trusted by universities worldwide',
    showBackButton = true,
    onBack,
}: LoginLayoutProps) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
            {/* Left Side - Branding (Hidden on mobile) */}
            <Box
                sx={{
                    display: { xs: 'none', lg: 'flex' },
                    width: '50%',
                    p: 6,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Image
                    src="/assets/images/Hue_Saturation.png"
                    alt="login background"
                    fill
                />
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.1)',
                        zIndex: 1,
                    }}
                />

                {/* Logo */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    src="/assets/logos/nextora.png"
                                    alt="Nextora Logo"
                                    width={30}
                                    height={30}
                                    style={{ objectFit: 'contain' }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
                                {brandTitle}
                            </Typography>
                        </Box>
                    </Link>
                </Box>

                {/* Hero Content */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 3,
                            fontSize: { lg: '2rem', xl: '2.5rem' },
                            lineHeight: 1.3,
                        }}
                    >
                        {heroTitle}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1.125rem',
                            color: 'text.secondary',
                            mb: 4,
                            lineHeight: 1.6,
                        }}
                    >
                        {heroSubtitle}
                    </Typography>

                    {/* Features List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {features.map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid',
                                        borderColor: 'rgba(59, 130, 246, 0.3)',
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Box>
                                    <Typography sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                        {footerText}
                    </Typography>
                </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box
                sx={{
                    width: { xs: '100%', lg: '50%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, sm: 6 },
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 440 }}>
                    {/* Mobile Back Button */}
                    {showBackButton && (
                        <Box
                            component={onBack ? 'button' : Link}
                            href="/"
                            onClick={onBack}
                            sx={{
                                display: { xs: 'inline-flex', lg: 'none' },
                                alignItems: 'center',
                                gap: 1,
                                color: 'text.secondary',
                                fontSize: '0.875rem',
                                mb: 4,
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                textDecoration: 'none',
                                '&:hover': { color: 'text.primary' },
                            }}
                        >
                            <ArrowBackIcon sx={{ fontSize: 18 }} />
                            Back to home
                        </Box>
                    )}

                    {/* Mobile Logo */}
                    <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                src="/assets/logos/nextora.png"
                                alt="Nextora Logo"
                                width={28}
                                height={28}
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
                            {brandTitle}
                        </Typography>
                    </Box>

                    {children}
                </Box>
            </Box>
        </Box>
    );
}

