// ForgotPasswordModal - Modern modal-based forgot password flow
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    LinearProgress,
    Fade,
    Slide,
    Stack,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyIcon from '@mui/icons-material/Key';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import RefreshIcon from '@mui/icons-material/Refresh';
import { forwardRef } from 'react';
import { validators } from '@/lib/validators/auth.validator';
import { Button, PasswordField } from '@/components/common';
import { OtpInput } from '../OtpInput';

// ============================================================================
// Types
// ============================================================================

type Step = 'email' | 'otp' | 'password' | 'success';

export interface ForgotPasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSendEmail: (email: string) => Promise<void>;
    onVerifyOtp: (email: string, otp: string) => Promise<{ token: string }>;
    onResendOtp: (email: string) => Promise<void>;
    onResetPassword: (token: string, password: string) => Promise<void>;
    onComplete?: () => void;
    otpLength?: number;
    otpExpirySeconds?: number;
}

// ============================================================================
// Slide Transition
// ============================================================================

const SlideTransition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ============================================================================
// Step Indicator Component
// ============================================================================

interface StepIndicatorProps {
    currentStep: Step;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps: Step[] = ['email', 'otp', 'password', 'success'];
    const currentIndex = steps.indexOf(currentStep);

    return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
            {steps.slice(0, -1).map((step, index) => (
                <Box
                    key={step}
                    sx={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: index <= currentIndex ? 'primary.main' : 'grey.300',
                        transition: 'all 0.3s ease',
                    }}
                />
            ))}
        </Box>
    );
}

// ============================================================================
// Email Step Component
// ============================================================================

interface EmailStepProps {
    onSubmit: (email: string) => Promise<void>;
    isLoading: boolean;
    error: string;
}

function EmailStep({ onSubmit, isLoading, error }: EmailStepProps) {
    const [email, setEmail] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailError = validators.email(email);
        if (emailError) {
            setLocalError(emailError);
            return;
        }
        setLocalError('');
        await onSubmit(email);
    };

    return (
        <Fade in timeout={300}>
            <Box component="form" onSubmit={handleSubmit}>
                {/* Icon */}
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>

                {/* Title */}
                <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Forgot Password?
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                    No worries! Enter your email and we'll send you a verification code.
                </Typography>

                {/* Email Input */}
                <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setLocalError('');
                    }}
                    error={!!(localError || error)}
                    helperText={localError || error}
                    fullWidth
                    placeholder="your.email@university.edu"
                    autoFocus
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'grey.50',
                            '&:hover': { bgcolor: 'grey.100' },
                            '&.Mui-focused': { bgcolor: 'background.paper' },
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading || !email}
                    sx={{
                        py: 1.75,
                        background: 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
                        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #1D4ED8 0%, #6D28D9 100%)',
                            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                        },
                    }}
                >
                    Send Verification Code
                </Button>

                {/* Security Note */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha('#2563EB', 0.05),
                        border: '1px solid',
                        borderColor: alpha('#2563EB', 0.1),
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                    }}
                >
                    <ShieldIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.2 }} />
                    <Typography variant="caption" color="text.secondary">
                        For security, we'll only send reset instructions to registered email addresses.
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
}

// ============================================================================
// OTP Step Component
// ============================================================================

interface OtpStepProps {
    email: string;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    isLoading: boolean;
    error: string;
    otpLength: number;
    expirySeconds: number;
}

function OtpStep({ email, onVerify, onResend, isLoading, error, otpLength, expirySeconds }: OtpStepProps) {
    const theme = useTheme();
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(expirySeconds);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (value: string) => {
        setOtp(value);
    };

    const handleOtpComplete = useCallback(async (completedOtp: string) => {
        if (completedOtp.length === otpLength && !isLoading) {
            await onVerify(completedOtp);
        }
    }, [otpLength, isLoading, onVerify]);

    const handleResend = async () => {
        setIsResending(true);
        try {
            await onResend();
            setTimeLeft(expirySeconds);
            setCanResend(false);
            setOtp('');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Fade in timeout={300}>
            <Box>
                {/* Icon */}
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
                    }}
                >
                    <KeyIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>

                {/* Title */}
                <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Verify Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 1 }}>
                    We've sent a {otpLength}-digit code to
                </Typography>
                <Typography
                    variant="body2"
                    fontWeight={600}
                    color="primary.main"
                    textAlign="center"
                    sx={{ mb: 4 }}
                >
                    {email}
                </Typography>

                {/* OTP Input */}
                <Box sx={{ mb: 3 }}>
                    <OtpInput
                        length={otpLength}
                        value={otp}
                        onChange={handleOtpChange}
                        onComplete={handleOtpComplete}
                        error={error}
                        disabled={isLoading}
                    />
                </Box>

                {/* Timer */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    {timeLeft > 0 ? (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 0.75,
                                borderRadius: 2,
                                bgcolor: timeLeft < 60 ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.primary.main, 0.1),
                            }}
                        >
                            <Typography
                                variant="body2"
                                color={timeLeft < 60 ? 'error.main' : 'primary.main'}
                                fontWeight={600}
                            >
                                {formatTime(timeLeft)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                remaining
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="error.main" fontWeight={500}>
                            Code expired. Please request a new one.
                        </Typography>
                    )}
                </Box>

                {/* Verify Button */}
                <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading || otp.length !== otpLength || timeLeft === 0}
                    onClick={() => onVerify(otp)}
                    sx={{
                        py: 1.75,
                        background: 'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #6D28D9 0%, #1D4ED8 100%)',
                        },
                    }}
                >
                    Verify Code
                </Button>

                <Divider sx={{ my: 3 }} />

                {/* Resend Section */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Didn't receive the code?
                    </Typography>
                    <Button
                        variant="ghost"
                        onClick={handleResend}
                        disabled={!canResend || isResending}
                        loading={isResending}
                        startIcon={<RefreshIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
                    </Button>
                </Box>
            </Box>
        </Fade>
    );
}

// ============================================================================
// Password Step Component
// ============================================================================

interface PasswordStepProps {
    onSubmit: (password: string) => Promise<void>;
    isLoading: boolean;
    error: string;
}

function PasswordStep({ onSubmit, isLoading, error }: PasswordStepProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const passwordStrength = checkPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        const passwordError = validators.password(password);
        if (passwordError) newErrors.password = passwordError;

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (passwordStrength.score < 50) {
            newErrors.password = 'Password is too weak';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await onSubmit(password);
    };

    return (
        <Fade in timeout={300}>
            <Box component="form" onSubmit={handleSubmit}>
                {/* Icon */}
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>

                {/* Title */}
                <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(90deg, #2563EB 0%, #10B981 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Create New Password
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                    Your new password must be different from previously used passwords.
                </Typography>

                <Stack spacing={3}>
                    {/* New Password */}
                    <Box>
                        <PasswordField
                            label="New Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prev) => ({ ...prev, password: '' }));
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            placeholder="Enter new password"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: 'grey.50',
                                    '&:hover': { bgcolor: 'grey.100' },
                                    '&.Mui-focused': { bgcolor: 'background.paper' },
                                },
                            }}
                        />

                        {/* Password Strength Indicator */}
                        {password && (
                            <Box sx={{ mt: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Password strength
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: passwordStrength.color, fontWeight: 600 }}
                                    >
                                        {passwordStrength.label}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={passwordStrength.score}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: passwordStrength.color,
                                            borderRadius: 3,
                                            transition: 'transform 0.4s ease, background-color 0.4s ease',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Confirm Password */}
                    <PasswordField
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        fullWidth
                        placeholder="Confirm new password"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: 'grey.50',
                                '&:hover': { bgcolor: 'grey.100' },
                                '&.Mui-focused': { bgcolor: 'background.paper' },
                            },
                        }}
                    />

                    {/* Password Requirements */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'grey.50',
                            border: '1px solid',
                            borderColor: 'grey.200',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Password Requirements:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
                            {[
                                'At least 8 characters long',
                                'Contains uppercase and lowercase letters',
                                'Contains at least one number',
                                'Contains at least one special character',
                            ].map((req, i) => (
                                <Typography key={i} component="li" variant="caption" color="text.secondary">
                                    {req}
                                </Typography>
                            ))}
                        </Box>
                    </Box>

                    {error && (
                        <Typography variant="body2" color="error.main" textAlign="center">
                            {error}
                        </Typography>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading || !password || !confirmPassword}
                        sx={{
                            py: 1.75,
                            background: 'linear-gradient(90deg, #2563EB 0%, #10B981 100%)',
                            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #1D4ED8 0%, #059669 100%)',
                            },
                        }}
                    >
                        Reset Password
                    </Button>
                </Stack>
            </Box>
        </Fade>
    );
}

// ============================================================================
// Success Step Component
// ============================================================================

interface SuccessStepProps {
    onComplete: () => void;
}

function SuccessStep({ onComplete }: SuccessStepProps) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [countdown, onComplete]);

    return (
        <Fade in timeout={300}>
            <Box textAlign="center">
                {/* Success Animation */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
                            '70%': { boxShadow: '0 0 0 20px rgba(16, 185, 129, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
                        },
                    }}
                >
                    <CheckCircleIcon sx={{ fontSize: 56, color: 'white' }} />
                </Box>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Password Reset Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Your password has been changed successfully.
                    <br />
                    You can now sign in with your new password.
                </Typography>

                {/* Countdown */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Redirecting in <strong>{countdown}</strong> seconds...
                </Typography>

                <Button
                    variant="primary"
                    fullWidth
                    onClick={onComplete}
                    sx={{
                        py: 1.75,
                        background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
                        },
                    }}
                >
                    Continue to Sign In
                </Button>

                {/* Security Info */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha('#10B981', 0.05),
                        border: '1px solid',
                        borderColor: alpha('#10B981', 0.1),
                        textAlign: 'left',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        <strong>Security:</strong> For your protection, you've been logged out of all other devices.
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
}

// ============================================================================
// Helper Functions
// ============================================================================

function checkPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 25, label: 'Weak', color: '#f44336' };
    if (score <= 3) return { score: 50, label: 'Fair', color: '#ff9800' };
    if (score <= 4) return { score: 75, label: 'Good', color: '#2196f3' };
    return { score: 100, label: 'Strong', color: '#4caf50' };
}

// ============================================================================
// Main Component
// ============================================================================

export function ForgotPasswordModal({
    open,
    onClose,
    onSendEmail,
    onVerifyOtp,
    onResendOtp,
    onResetPassword,
    onComplete,
    otpLength = 6,
    otpExpirySeconds = 300,
}: ForgotPasswordModalProps) {
    const theme = useTheme();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep('email');
                setEmail('');
                setResetToken('');
                setError('');
                setIsLoading(false);
            }, 300);
        }
    }, [open]);

    const handleSendEmail = async (emailValue: string) => {
        setIsLoading(true);
        setError('');
        try {
            await onSendEmail(emailValue);
            setEmail(emailValue);
            setStep('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        setIsLoading(true);
        setError('');
        try {
            const result = await onVerifyOtp(email, otp);
            setResetToken(result.token);
            setStep('password');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            await onResendOtp(email);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend code');
        }
    };

    const handleResetPassword = async (password: string) => {
        setIsLoading(true);
        setError('');
        try {
            await onResetPassword(resetToken, password);
            setStep('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = () => {
        onClose();
        onComplete?.();
    };

    const handleBack = () => {
        setError('');
        if (step === 'otp') setStep('email');
        if (step === 'password') setStep('otp');
    };

    const canGoBack = step === 'otp' || step === 'password';

    return (
        <Dialog
            open={open}
            onClose={step === 'success' ? undefined : onClose}
            TransitionComponent={SlideTransition}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    maxWidth: 480,
                    m: 2,
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {canGoBack ? (
                    <IconButton onClick={handleBack} size="small">
                        <ArrowBackIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ width: 40 }} />
                )}
                <StepIndicator currentStep={step} />
                {step !== 'success' ? (
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ width: 40 }} />
                )}
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 4 }}>
                {step === 'email' && (
                    <EmailStep
                        onSubmit={handleSendEmail}
                        isLoading={isLoading}
                        error={error}
                    />
                )}
                {step === 'otp' && (
                    <OtpStep
                        email={email}
                        onVerify={handleVerifyOtp}
                        onResend={handleResendOtp}
                        isLoading={isLoading}
                        error={error}
                        otpLength={otpLength}
                        expirySeconds={otpExpirySeconds}
                    />
                )}
                {step === 'password' && (
                    <PasswordStep
                        onSubmit={handleResetPassword}
                        isLoading={isLoading}
                        error={error}
                    />
                )}
                {step === 'success' && <SuccessStep onComplete={handleComplete} />}
            </DialogContent>
        </Dialog>
    );
}

