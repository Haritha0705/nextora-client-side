// LoginLayout - Reusable login page layout wrapper
'use client';

import { ReactNode } from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@/components/common';

export interface LoginLayoutProps {
    children: ReactNode;
    backgroundGradient?: string;
    onBack: () => void;
    backButtonColor?: string;
    footerText?: ReactNode;
    footerTextColor?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function LoginLayout({
    children,
    backgroundGradient = 'linear-gradient(135deg, #EBF5FF 0%, #FFFFFF 50%, #F5F3FF 100%)',
    onBack,
    backButtonColor,
    footerText,
    footerTextColor = 'text.secondary',
    maxWidth = 'sm',
}: LoginLayoutProps) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: backgroundGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                px: 2,
            }}
        >
            <Container maxWidth={maxWidth}>
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={onBack}
                    sx={{ mb: 4, color: backButtonColor }}
                    startIcon={<ArrowBackIcon />}
                >
                    Back
                </Button>

                {children}

                {/* Footer Text */}
                {footerText && (
                    <Typography
                        variant="caption"
                        sx={{ color: footerTextColor }}
                        align="center"
                        display="block"
                        mt={3}
                    >
                        {footerText}
                    </Typography>
                )}
            </Container>
        </Box>
    );
}

// Default footer for user login
export function UserLoginFooter() {
    return (
        <>
            By signing in, you agree to our{' '}
            <Link href="#" underline="hover">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" underline="hover">Privacy Policy</Link>
        </>
    );
}

// Default footer for admin login
export function AdminLoginFooter() {
    return <>This is a secure admin portal. Unauthorized access is prohibited.</>;
}

