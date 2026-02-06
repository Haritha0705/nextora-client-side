// LoginForm - Reusable login form component
'use client';

import { useState } from 'react';
import {
    Box,
    TextField,
    Alert,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    FormControlLabel,
    Checkbox,
    Link,
    CircularProgress,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { validators } from '@/lib/validators/auth.validator';
import { Button, PasswordField } from '@/components/common';
import { RoleType } from '@/constants/roles';

export interface RoleOption {
    value: RoleType;
    label: string;
}

export interface LoginFormProps {
    roleOptions: RoleOption[];
    roleLabel?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    submitButtonText?: string;
    submitButtonGradient?: string;
    submitButtonHoverGradient?: string;
    showRememberMe?: boolean;
    showForgotPassword?: boolean;
    onForgotPassword?: () => void;
    onSubmit: (data: { email: string; password: string; role: string }) => Promise<void>;
    isLoading?: boolean;
}

export function LoginForm({
    roleOptions,
    roleLabel = 'Select Role *',
    emailLabel = 'Email *',
    emailPlaceholder = 'your.email@example.com',
    submitButtonText = 'Sign In',
    submitButtonGradient = 'linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)',
    submitButtonHoverGradient = 'linear-gradient(90deg, #1D4ED8 0%, #6D28D9 100%)',
    showRememberMe = false,
    showForgotPassword = false,
    onForgotPassword,
    onSubmit,
    isLoading = false,
}: LoginFormProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [rememberMe, setRememberMe] = useState(false);
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

        if (!formData.role) {
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
                role: formData.role,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid credentials. Please try again.';
            setErrors({ submit: message });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {errors.submit && (
                <Alert severity="error" sx={{ mb: 3 }} icon={<ErrorOutlineIcon />}>
                    {errors.submit}
                </Alert>
            )}

            <Stack spacing={3}>
                {/* Role Selection */}
                <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>{roleLabel}</InputLabel>
                    <Select
                        value={formData.role}
                        onChange={(e) => updateField('role', e.target.value)}
                        label={roleLabel}
                        sx={{ borderRadius: 3 }}
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

                {/* Email */}
                <TextField
                    label={emailLabel}
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    placeholder={emailPlaceholder}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                {/* Password */}
                <Box>
                    {showForgotPassword && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                                Password *
                            </Typography>
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                onClick={onForgotPassword}
                                underline="hover"
                            >
                                Forgot Password?
                            </Link>
                        </Stack>
                    )}
                    <PasswordField
                        label={showForgotPassword ? undefined : 'Password *'}
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        placeholder="••••••••"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </Box>

                {/* Remember Me */}
                {showRememberMe && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Remember me"
                    />
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading}
                    sx={{
                        py: 1.5,
                        background: submitButtonGradient,
                        '&:hover': {
                            background: submitButtonHoverGradient,
                        },
                    }}
                >
                    {isLoading ? (
                        <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Signing In...
                        </>
                    ) : (
                        submitButtonText
                    )}
                </Button>
            </Stack>
        </Box>
    );
}

