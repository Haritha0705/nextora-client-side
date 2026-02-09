// ModernLoginForm - Modern dark theme login form
'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Checkbox,
    FormControlLabel,
    Link as MuiLink,
    Alert,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { validators } from '@/lib/validators/auth.validator';
import { RoleType } from '@/constants/roles';

export interface RoleOption {
    value: RoleType;
    label: string;
}

export interface LoginFormProps {
    title?: string;
    subtitle?: string;
    roleOptions?: RoleOption[];
    showRoleSelector?: boolean;
    showOAuthButtons?: boolean;
    showRememberMe?: boolean;
    showForgotPassword?: boolean;
    showSignUpLink?: boolean;
    showDemoCredentials?: boolean;
    onForgotPassword?: () => void;
    onSignUp?: () => void;
    onSubmit: (data: { email: string; password: string; role?: string }) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({
    title = 'Welcome back',
    subtitle = 'Sign in to your account',
    roleOptions = [],
    showRoleSelector = true,
    showOAuthButtons = false,
    showRememberMe = true,
    showForgotPassword = true,
    showSignUpLink = false,
    showDemoCredentials = true,
    onForgotPassword,
    onSignUp,
    onSubmit,
    isLoading = false,
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        role: '',
        email: '',
        password: '',
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (showRoleSelector && roleOptions.length > 0 && !formData.role) {
            newErrors.role = 'Please select a role';
        }

        const emailError = validators.email(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validators.password(formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await onSubmit({
                email: formData.email,
                password: formData.password,
                role: formData.role || undefined,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid credentials. Please try again.';
            setErrors({ submit: message });
        }
    };

    // Input styles for dark theme
    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& fieldset': {
                borderColor: 'divider',
            },
            '&:hover fieldset': {
                borderColor: 'text.disabled',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 1,
            },
        },
        '& .MuiInputLabel-root': {
            color: 'text.secondary',
        },
        '& .MuiInputBase-input': {
            color: 'text.primary',
            '&::placeholder': {
                color: 'text.disabled',
                opacity: 1,
            },
        },
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
                >
                    {title}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    {subtitle}
                </Typography>
            </Box>

            {/* OAuth Buttons */}
            {showOAuthButtons && (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GitHubIcon />}
                            sx={{
                                py: 1.5,
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'text.disabled',
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            Continue with GitHub
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            sx={{
                                py: 1.5,
                                borderColor: 'divider',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'text.disabled',
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            Continue with Google
                        </Button>
                    </Box>

                    <Box sx={{ position: 'relative', mb: 3 }}>
                        <Divider sx={{ borderColor: 'divider' }}>
                            <Typography variant="caption" sx={{ color: 'text.disabled', px: 2 }}>
                                Or continue with email
                            </Typography>
                        </Divider>
                    </Box>
                </>
            )}

            {/* Error Alert */}
            {errors.submit && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    icon={<ErrorOutlineIcon />}
                >
                    {errors.submit}
                </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {/* Role Selector */}
                    {showRoleSelector && roleOptions.length > 0 && (
                        <FormControl fullWidth error={!!errors.role} sx={inputStyles}>
                            <InputLabel>Select Role</InputLabel>
                            <Select
                                value={formData.role}
                                onChange={(e) => updateField('role', e.target.value)}
                                label="Select Role"
                            >
                                {roleOptions.map(role => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.role && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                    {errors.role}
                                </Typography>
                            )}
                        </FormControl>
                    )}

                    {/* Email */}
                    <TextField
                        fullWidth
                        label="Email address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        placeholder="you@example.com"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutlineIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={inputStyles}
                    />

                    {/* Password */}
                    <Box>
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            placeholder="••••••••"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: 'text.disabled' }}
                                            >
                                                {showPassword ? (
                                                    <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                                ) : (
                                                    <VisibilityIcon sx={{ fontSize: 20 }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={inputStyles}
                        />
                    </Box>

                    {/* Remember Me & Forgot Password */}
                    {(showRememberMe || showForgotPassword) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {showRememberMe && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            size="small"
                                            sx={{
                                                color: 'text.disabled',
                                                '&.Mui-checked': { color: 'primary.main' },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Remember me
                                        </Typography>
                                    }
                                />
                            )}
                            {showForgotPassword && (
                                <MuiLink
                                    component="button"
                                    type="button"
                                    variant="body2"
                                    onClick={onForgotPassword}
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': { color: 'primary.dark' },
                                    }}
                                >
                                    Forgot password?
                                </MuiLink>
                            )}
                        </Box>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            py: 1.5,
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </Box>
            </Box>

            {/* Sign Up Link */}
            {showSignUpLink && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Don't have an account?{' '}
                        <MuiLink
                            component="button"
                            type="button"
                            onClick={onSignUp}
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                                textDecoration: 'none',
                                '&:hover': { color: 'primary.dark' },
                            }}
                        >
                            Sign up
                        </MuiLink>
                    </Typography>
                </Box>
            )}

            {/* Terms */}
            <Typography
                variant="caption"
                sx={{ display: 'block', textAlign: 'center', mt: 4, color: 'text.disabled' }}
            >
                By continuing, you agree to our{' '}
                <MuiLink href="#" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Terms of Service
                </MuiLink>
                {' '}and{' '}
                <MuiLink href="#" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Privacy Policy
                </MuiLink>
            </Typography>
        </Box>
    );
}

