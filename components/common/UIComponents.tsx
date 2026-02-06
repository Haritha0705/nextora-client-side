// Shared UI Components
'use client';

import React from 'react';
import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    TextField,
    TextFieldProps,
    CircularProgress,
} from '@mui/material';

// ============ Button Component ============
interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    fullWidth?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    fullWidth = false,
    loading = false,
    children,
    disabled,
    sx,
    ...props
}: ButtonProps) {
    const getVariantProps = (): { variant: MuiButtonProps['variant']; color?: MuiButtonProps['color'] } => {
        switch (variant) {
            case 'primary':
                return { variant: 'contained', color: 'primary' };
            case 'secondary':
                return { variant: 'contained', color: 'secondary' };
            case 'outline':
                return { variant: 'outlined', color: 'primary' };
            case 'ghost':
                return { variant: 'text', color: 'primary' };
            case 'danger':
                return { variant: 'contained', color: 'error' };
            default:
                return { variant: 'contained', color: 'primary' };
        }
    };

    const variantProps = getVariantProps();

    return (
        <MuiButton
            {...variantProps}
            fullWidth={fullWidth}
            disabled={disabled || loading}
            sx={{
                borderRadius: 3,
                py: 1.5,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                ...sx,
            }}
            {...props}
        >
            {loading && <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />}
            {children}
        </MuiButton>
    );
}

// ============ Input Component ============
interface InputProps extends Omit<TextFieldProps, 'error'> {
    error?: boolean;
}

export function Input({
    error = false,
    fullWidth = true,
    ...props
}: InputProps) {
    return (
        <TextField
            error={error}
            fullWidth={fullWidth}
            variant="outlined"
            size="medium"
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                },
            }}
            {...props}
        />
    );
}

// ============ Textarea Component ============
interface TextareaProps extends Omit<TextFieldProps, 'error'> {
    error?: boolean;
}

export function Textarea({
    error = false,
    fullWidth = true,
    rows = 4,
    ...props
}: TextareaProps) {
    return (
        <TextField
            error={error}
            fullWidth={fullWidth}
            variant="outlined"
            multiline
            rows={rows}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                },
            }}
            {...props}
        />
    );
}

