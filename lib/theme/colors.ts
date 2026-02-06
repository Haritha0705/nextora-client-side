'use client';

/**
 * NextOra Color Palette
 * ====================
 * Comprehensive color system for light and dark themes
 */

export const colors = {
  // Primary Blue Palette
  primary: {
    main: '#60A5FA',      // Primary Blue
    light: '#93C5FD',     // Lighter Blue
    lighter: '#BFDBFE',   // Even Lighter
    dark: '#3B82F6',      // Darker Blue
    darker: '#2563EB',    // Even Darker
  },

  // Sky Blue Accent
  sky: {
    main: '#38BDF8',      // Sky Blue
    light: '#7DD3FC',     // Light Sky
    lighter: '#BAE6FD',   // Lighter Sky
    dark: '#0EA5E9',      // Dark Sky
  },

  // Cyan Accent
  cyan: {
    main: '#22D3EE',      // Cyan
    light: '#67E8F9',     // Light Cyan
    lighter: '#A5F3FC',   // Lighter Cyan
    dark: '#06B6D4',      // Dark Cyan
  },

  // Indigo Accent
  indigo: {
    main: '#818CF8',      // Indigo
    light: '#A5B4FC',     // Light Indigo
    lighter: '#C7D2FE',   // Lighter Indigo
    dark: '#6366F1',      // Dark Indigo
  },

  // Success Green
  success: {
    main: '#34D399',      // Success Green
    light: '#6EE7B7',     // Light Green
    lighter: '#A7F3D0',   // Lighter Green
    dark: '#10B981',      // Dark Green
  },

  // Error Red
  error: {
    main: '#F87171',      // Error Red
    light: '#FCA5A5',     // Light Red
    lighter: '#FECACA',   // Lighter Red
    dark: '#EF4444',      // Dark Red
  },

  // Warning Amber
  warning: {
    main: '#FBBF24',      // Warning Yellow
    light: '#FCD34D',     // Light Yellow
    lighter: '#FDE68A',   // Lighter Yellow
    dark: '#F59E0B',      // Dark Yellow
  },

  // Grey Scale
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Text Colors
  text: {
    primary: '#1E293B',     // Dark slate for primary text
    secondary: '#64748B',   // Medium slate for secondary
    muted: '#94A3B8',       // Muted text
    disabled: '#CBD5E1',    // Disabled text
    // Dark mode text
    darkPrimary: '#F8FAFC',
    darkSecondary: '#CBD5E1',
    darkMuted: '#94A3B8',
  },

  // Background Colors
  background: '#F8FAFC',    // Light grey background
  white: '#FFFFFF',
  black: '#000000',

  // Dark Mode Backgrounds
  dark: {
    background: '#0F172A',  // Very dark blue-grey
    paper: '#1E293B',       // Dark slate for cards
    elevated: '#334155',    // Elevated surfaces
  },
};

// Gradient Definitions
export const gradients = {
  // Primary Gradients
  bluePrimary: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
  blueIndigo: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.indigo.main} 100%)`,
  skyBlue: `linear-gradient(135deg, ${colors.sky.main} 0%, ${colors.primary.main} 100%)`,

  // Accent Gradients
  indigoAccent: `linear-gradient(135deg, ${colors.indigo.main} 0%, ${colors.indigo.dark} 100%)`,
  cyanAccent: `linear-gradient(135deg, ${colors.cyan.main} 0%, ${colors.sky.main} 100%)`,
  success: `linear-gradient(135deg, ${colors.success.main} 0%, ${colors.success.dark} 100%)`,

  // Hero/Feature Gradients
  hero: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.indigo.main} 50%, ${colors.cyan.main} 100%)`,

  // Card Gradients
  card: `linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
  cardHover: `linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)`,

  // Glass Effects
  glassLight: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  glassMedium: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',

  // Dark Mode Gradients
  darkCard: `linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)`,
  darkGlass: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
};

export default colors;
