'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Inter } from 'next/font/google';
import { componentOverrides } from './components';

// ============================================
// Font Configuration - Using Inter for Modern Look
// ============================================
const inter = Inter({
    weight: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
});

// ============================================
// Color Palette
// ============================================
const palette = {
    primary: {
        main: '#3B82F6', // Blue
        light: '#60A5FA',
        dark: '#2563EB',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#10B981', // Green
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
    },
    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
    },
    info: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
    },
    success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
    },
    grey: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },
    background: {
        default: '#F9FAFB',
        paper: '#FFFFFF',
    },
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        disabled: '#9CA3AF',
    },
};

// ============================================
// Typography Configuration
// ============================================
const typography = {
    fontFamily: inter.style.fontFamily,
    h1: {
        fontSize: '2.5rem', // 40px
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: '-0.03em',
    },
    h2: {
        fontSize: '2rem', // 32px
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.02em',
    },
    h3: {
        fontSize: '1.75rem', // 28px
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
    },
    h4: {
        fontSize: '1.5rem', // 24px
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
    },
    h5: {
        fontSize: '1.25rem', // 20px
        fontWeight: 600,
        lineHeight: 1.5,
    },
    h6: {
        fontSize: '1.125rem', // 18px
        fontWeight: 600,
        lineHeight: 1.5,
    },
    body1: {
        fontSize: '1rem', // 16px
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.875rem', // 14px
        lineHeight: 1.6,
    },
    button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none' as const,
        letterSpacing: '0.02em',
    },
    caption: {
        fontSize: '0.75rem', // 12px
        lineHeight: 1.5,
    },
    overline: {
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
    },
};

// ============================================
// Component Overrides - Using imported componentOverrides from components.ts
// ============================================

// ============================================
// Breakpoints
// ============================================
const breakpoints = {
    values: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },
};

// ============================================
// Shape
// ============================================
const shape = {
    borderRadius: 8,
};

// ============================================
// Shadows
// ============================================
const shadows = [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(18).fill('none'),
] as any;

// ============================================
// Create Theme
// ============================================
export const theme = createTheme({
    palette,
    typography,
    components: componentOverrides,
    breakpoints,
    shape,
    shadows,
    spacing: 8, // 8px base spacing
} as ThemeOptions);

// ============================================
// Dark Theme (Optional)
// ============================================
export const darkTheme = createTheme({
    ...theme,
    palette: {
        mode: 'dark',
        primary: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
        },
        background: {
            default: '#111827',
            paper: '#1F2937',
        },
        text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
        },
    },
});

// ============================================
// Role-Based Theme Colors (Optional)
// ============================================
export const roleThemeColors = {
    ROLE_STUDENT: '#3B82F6', // Blue
    ROLE_LECTURER: '#10B981', // Green
    ROLE_ACADEMIC_STAFF: '#F59E0B', // Orange
    ROLE_NON_ACADEMIC_STAFF: '#8B5CF6', // Purple
    ROLE_ADMIN: '#EF4444', // Red
    ROLE_SUPER_ADMIN: '#374151', // Dark Gray
};

export default theme;