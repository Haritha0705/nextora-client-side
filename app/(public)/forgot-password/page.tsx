'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';
import { useToast } from '@/components/common';
import { ForgotPasswordModal } from '@/components/auth';
import { forgotPassword, verifyOtp, resendOtp, resetPassword } from '@/features/auth/services';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [modalOpen, setModalOpen] = useState(true);

    // Redirect to login when modal closes
    useEffect(() => {
        if (!modalOpen) {
            router.push('/login');
        }
    }, [modalOpen, router]);

    // Forgot password modal handlers
    const handleSendEmail = async (email: string) => {
        const response = await forgotPassword({ email });
        if (!response.success) {
            throw new Error(response.message || 'Failed to send email');
        }
        showToast('success', 'Email Sent', 'Verification code sent to your email');
    };

    const handleVerifyOtp = async (email: string, otp: string) => {
        const response = await verifyOtp({ email, otp });
        if (!response.verified) {
            throw new Error(response.message || 'Invalid verification code');
        }
        return { token: response.token };
    };

    const handleResendOtp = async (email: string) => {
        const response = await resendOtp({ email });
        showToast('success', 'Code Sent', response.message);
    };

    const handleResetPassword = async (token: string, password: string) => {
        const response = await resetPassword({ token, password, confirmPassword: password });
        if (!response.success) {
            throw new Error(response.message || 'Failed to reset password');
        }
    };

    const handleComplete = () => {
        showToast('success', 'Password Reset', 'Your password has been reset successfully');
        router.push('/login');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #EBF5FF 0%, #FFFFFF 50%, #F5F3FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" color="text.secondary" sx={{ opacity: 0.7 }}>
                        Password Recovery
                    </Typography>
                </Box>
            </Container>

            <ForgotPasswordModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSendEmail={handleSendEmail}
                onVerifyOtp={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                onResetPassword={handleResetPassword}
                onComplete={handleComplete}
            />
        </Box>
    );
}
