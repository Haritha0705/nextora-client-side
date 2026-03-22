'use client';

import { Components, Theme } from '@mui/material/styles';

/**
 * SaaS Dashboard Design System - MUI Component Overrides
 * Dark mode-first with professional styling
 */
export const componentOverrides: Components<Theme> = {
    // ===================================
    // CssBaseline - Global Styles
    // ===================================
    MuiCssBaseline: {
        styleOverrides: {
            html: {
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
            },
            body: {
                scrollbarColor: '#30363D #0D1117',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                    width: 8,
                    height: 8,
                    backgroundColor: '#0D1117',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                    borderRadius: 4,
                    backgroundColor: '#30363D',
                    minHeight: 24,
                    '&:hover': {
                        backgroundColor: '#484F58',
                    },
                },
                '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                    backgroundColor: '#0D1117',
                },
            },
        },
    },

    // ===================================
    // Button Component
    // ===================================
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                padding: '10px 24px',
                fontSize: '0.875rem',
                fontWeight: 500,
                boxShadow: 'none',
                textTransform: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    boxShadow: 'none',
                },
                '&:active': {
                    transform: 'scale(0.98)',
                },
            },
            sizeLarge: {
                padding: '14px 32px',
                fontSize: '1rem',
                borderRadius: 6,
            },
            sizeSmall: {
                padding: '6px 16px',
                fontSize: '0.8125rem',
                borderRadius: 4,
            },
            contained: {
                '&:hover': {
                    boxShadow: 'none',
                },
            },
            containedPrimary: {
                backgroundColor: '#3B82F6',
                '&:hover': {
                    backgroundColor: '#2563EB',
                },
            },
            containedSecondary: {
                backgroundColor: '#10B981',
                '&:hover': {
                    backgroundColor: '#059669',
                },
            },
            outlined: {
                borderWidth: 1,
                borderColor: '#30363D',
                '&:hover': {
                    borderWidth: 1,
                    borderColor: '#484F58',
                    backgroundColor: 'rgba(240, 246, 252, 0.04)',
                },
            },
            outlinedPrimary: {
                borderColor: '#3B82F6',
                color: '#3B82F6',
                '&:hover': {
                    borderColor: '#60A5FA',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                },
            },
            text: {
                '&:hover': {
                    backgroundColor: 'rgba(240, 246, 252, 0.08)',
                },
            },
        },
    },

    // ===================================
    // TextField Component
    // ===================================
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    backgroundColor: '#161B22',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                        borderColor: '#30363D',
                        borderWidth: 1,
                    },
                    '&:hover fieldset': {
                        borderColor: '#484F58',
                    },
                    '&.Mui-focused': {
                        backgroundColor: '#161B22',
                        '& fieldset': {
                            borderWidth: 1,
                            borderColor: '#3B82F6',
                            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                        },
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#8B949E',
                    '&.Mui-focused': {
                        color: '#3B82F6',
                    },
                },
                '& .MuiInputBase-input': {
                    color: '#F0F6FC',
                    '&::placeholder': {
                        color: '#484F58',
                        opacity: 1,
                    },
                },
            },
        },
        defaultProps: {
            variant: 'outlined',
        },
    },

    // ===================================
    // Card Component
    // ===================================
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                border: '1px solid #30363D',
                backgroundColor: '#161B22',
                boxShadow: 'none',
                backgroundImage: 'none',
                transition: 'border-color 0.2s ease-in-out',
                overflow: 'hidden',
                '&:hover': {
                    borderColor: '#3B82F6',
                },
            },
        },
    },

    // ===================================
    // CardContent Component
    // ===================================
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: '16px',
                '@media (min-width:600px)': {
                    padding: '24px',
                },
                '&:last-child': {
                    paddingBottom: '16px',
                    '@media (min-width:600px)': {
                        paddingBottom: '24px',
                    },
                },
            },
        },
    },

    // ===================================
    // Paper Component
    // ===================================
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 6,
                backgroundImage: 'none',
                backgroundColor: '#161B22',
            },
            elevation0: {
                boxShadow: 'none',
            },
            elevation1: {
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
            },
            elevation2: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
            },
            elevation3: {
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
            },
            elevation4: {
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
            },
        },
    },

    // ===================================
    // Chip Component
    // ===================================
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                fontWeight: 500,
                height: 28,
            },
            sizeSmall: {
                height: 24,
                fontSize: '0.75rem',
            },
            colorPrimary: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#60A5FA',
            },
            colorSecondary: {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#34D399',
            },
            colorSuccess: {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#34D399',
            },
            colorError: {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#F87171',
            },
            colorWarning: {
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#FBBF24',
            },
            colorInfo: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#60A5FA',
            },
        },
    },

    // ===================================
    // Avatar Component
    // ===================================
    MuiAvatar: {
        styleOverrides: {
            root: {
                fontWeight: 600,
                fontSize: '0.875rem',
            },
            colorDefault: {
                backgroundColor: '#30363D',
                color: '#8B949E',
            },
        },
    },

    // ===================================
    // Tab Components
    // ===================================
    MuiTabs: {
        styleOverrides: {
            root: {
                minHeight: 44,
            },
            indicator: {
                height: 2,
                borderRadius: '2px 2px 0 0',
                backgroundColor: '#3B82F6',
            },
        },
    },
    MuiTab: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: 44,
                padding: '12px 16px',
                color: '#8B949E',
                '&:hover': {
                    color: '#F0F6FC',
                },
                '&.Mui-selected': {
                    fontWeight: 600,
                    color: '#F0F6FC',
                },
            },
        },
    },

    // ===================================
    // Alert Component
    // ===================================
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                alignItems: 'center',
                border: '1px solid',
            },
            standardSuccess: {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#34D399',
                '& .MuiAlert-icon': {
                    color: '#34D399',
                },
            },
            standardError: {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#F87171',
                '& .MuiAlert-icon': {
                    color: '#F87171',
                },
            },
            standardWarning: {
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                color: '#FBBF24',
                '& .MuiAlert-icon': {
                    color: '#FBBF24',
                },
            },
            standardInfo: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: '#60A5FA',
                '& .MuiAlert-icon': {
                    color: '#60A5FA',
                },
            },
        },
    },

    // ===================================
    // Dialog Component
    // ===================================
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 6,
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            },
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontWeight: 600,
                fontSize: '1.25rem',
                padding: '24px 24px 16px',
                color: '#F0F6FC',
            },
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: {
                padding: '16px 24px',
            },
        },
    },
    MuiDialogActions: {
        styleOverrides: {
            root: {
                padding: '16px 24px 24px',
                gap: 12,
            },
        },
    },

    // ===================================
    // Menu Component
    // ===================================
    MuiMenu: {
        styleOverrides: {
            paper: {
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                border: '1px solid #30363D',
                backgroundColor: '#161B22',
                minWidth: 180,
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                padding: '10px 16px',
                fontSize: '0.875rem',
                borderRadius: 4,
                margin: '2px 8px',
                '&:hover': {
                    backgroundColor: 'rgba(240, 246, 252, 0.08)',
                },
                '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.16)',
                    },
                },
            },
        },
    },

    // ===================================
    // Table Components
    // ===================================
    MuiTableContainer: {
        styleOverrides: {
            root: {
                borderRadius: 0,
                border: 'none',
                overflowX: 'auto',
            },
        },
    },
    MuiTableHead: {
        styleOverrides: {
            root: {
                '& .MuiTableCell-head': {
                    fontWeight: 500,
                    backgroundColor: 'transparent',
                    color: '#8B949E',
                    borderBottom: '1px solid #30363D',
                },
            },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottom: '1px solid #30363D',
                padding: '16px',
                color: '#F0F6FC',
            },
        },
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                transition: 'background-color 0.15s ease',
                '&:hover': {
                    backgroundColor: 'rgba(240, 246, 252, 0.04)',
                },
                '&:last-child td': {
                    borderBottom: 0,
                },
            },
        },
    },

    // ===================================
    // Tooltip Component
    // ===================================
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: '#30363D',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderRadius: 4,
                padding: '8px 12px',
                color: '#F0F6FC',
            },
            arrow: {
                color: '#30363D',
            },
        },
    },

    // ===================================
    // LinearProgress Component
    // ===================================
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                borderRadius: 2,
                height: 6,
                backgroundColor: '#30363D',
            },
            bar: {
                borderRadius: 2,
            },
        },
    },

    // ===================================
    // CircularProgress Component
    // ===================================
    MuiCircularProgress: {
        styleOverrides: {
            colorPrimary: {
                color: '#3B82F6',
            },
        },
    },

    // ===================================
    // Badge Component
    // ===================================
    MuiBadge: {
        styleOverrides: {
            badge: {
                fontWeight: 600,
                fontSize: '0.7rem',
            },
            colorPrimary: {
                backgroundColor: '#3B82F6',
            },
        },
    },

    // ===================================
    // IconButton Component
    // ===================================
    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                transition: 'all 0.2s ease',
                color: '#8B949E',
                '&:hover': {
                    backgroundColor: 'rgba(240, 246, 252, 0.08)',
                    color: '#F0F6FC',
                },
            },
        },
    },

    // ===================================
    // List Components
    // ===================================
    MuiList: {
        styleOverrides: {
            root: {
                padding: '8px',
            },
        },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                minHeight: 44,
                marginBottom: 4,
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: 'rgba(240, 246, 252, 0.08)',
                },
                '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    },
                    '& .MuiListItemIcon-root': {
                        color: '#3B82F6',
                    },
                    '& .MuiListItemText-primary': {
                        color: '#3B82F6',
                    },
                },
            },
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                minWidth: 40,
                color: '#8B949E',
            },
        },
    },

    // ===================================
    // Drawer Component
    // ===================================
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: '#161B22',
                borderRight: '1px solid #30363D',
            },
        },
    },

    // ===================================
    // AppBar Component
    // ===================================
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: 'none',
                backgroundColor: '#161B22',
                borderBottom: '1px solid #30363D',
            },
        },
    },

    // ===================================
    // Divider Component
    // ===================================
    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: '#30363D',
            },
        },
    },

    // ===================================
    // Switch Component
    // ===================================
    MuiSwitch: {
        styleOverrides: {
            root: {
                width: 48,
                height: 26,
                padding: 0,
            },
            switchBase: {
                padding: 2,
                '&.Mui-checked': {
                    transform: 'translateX(22px)',
                    color: '#FFFFFF',
                    '& + .MuiSwitch-track': {
                        backgroundColor: '#3B82F6',
                        opacity: 1,
                    },
                },
            },
            thumb: {
                width: 22,
                height: 22,
            },
            track: {
                borderRadius: 13,
                backgroundColor: '#30363D',
                opacity: 1,
            },
        },
    },

    // ===================================
    // Pagination Component
    // ===================================
    MuiPagination: {
        styleOverrides: {
            root: {
                '& .MuiPaginationItem-root': {
                    borderRadius: 4,
                    border: '1px solid #30363D',
                    color: '#8B949E',
                    '&:hover': {
                        backgroundColor: 'rgba(240, 246, 252, 0.08)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF',
                        borderColor: '#3B82F6',
                        '&:hover': {
                            backgroundColor: '#2563EB',
                        },
                    },
                },
            },
        },
    },

    // ===================================
    // Skeleton Component
    // ===================================
    MuiSkeleton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                backgroundColor: '#30363D',
            },
            rectangular: {
                borderRadius: 4,
            },
        },
    },

    // ===================================
    // Accordion Component
    // ===================================
    MuiAccordion: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                '&:before': {
                    display: 'none',
                },
                '&.Mui-expanded': {
                    margin: '8px 0',
                },
            },
        },
    },
    MuiAccordionSummary: {
        styleOverrides: {
            root: {
                minHeight: 56,
                '&.Mui-expanded': {
                    minHeight: 56,
                },
            },
        },
    },

    // ===================================
    // InputBase Component
    // ===================================
    MuiInputBase: {
        styleOverrides: {
            root: {
                color: '#F0F6FC',
            },
            input: {
                '&::placeholder': {
                    color: '#484F58',
                    opacity: 1,
                },
            },
        },
    },
};
