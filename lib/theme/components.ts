'use client';

import { Components, Theme } from '@mui/material/styles';

/**
 * Custom MUI Component Overrides
 * Professional styling for all MUI components
 */
export const componentOverrides: Components<Theme> = {
    // ===================================
    // Button Component
    // ===================================
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 10,
                padding: '10px 24px',
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 'none',
                textTransform: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    boxShadow: 'none',
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
            },
            sizeLarge: {
                padding: '14px 32px',
                fontSize: '1rem',
                borderRadius: 12,
            },
            sizeSmall: {
                padding: '6px 16px',
                fontSize: '0.8125rem',
                borderRadius: 8,
            },
            contained: {
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
            },
            containedPrimary: {
                background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                },
            },
            containedSecondary: {
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
            },
            outlined: {
                borderWidth: 2,
                '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(59, 130, 246, 0.04)',
                },
            },
            outlinedPrimary: {
                borderColor: '#60A5FA',
                '&:hover': {
                    borderColor: '#2563EB',
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
                    borderRadius: 12,
                    backgroundColor: '#F9FAFB',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                    },
                    '&:hover fieldset': {
                        borderColor: '#D1D5DB',
                    },
                    '&.Mui-focused': {
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                            borderWidth: 2,
                            borderColor: '#60A5FA',
                        },
                    },
                },
                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: '#60A5FA',
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
                borderRadius: 16,
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
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
                padding: 24,
                '&:last-child': {
                    paddingBottom: 24,
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
                borderRadius: 16,
                backgroundImage: 'none',
            },
            elevation0: {
                boxShadow: 'none',
            },
            elevation1: {
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
            elevation2: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            elevation3: {
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            elevation4: {
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
        },
    },

    // ===================================
    // Chip Component
    // ===================================
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 8,
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
                color: '#10B981',
            },
            colorSuccess: {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
            },
            colorError: {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
            },
            colorWarning: {
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#F59E0B',
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
                backgroundColor: '#E5E7EB',
                color: '#6B7280',
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
                height: 3,
                borderRadius: '3px 3px 0 0',
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
                '&.Mui-selected': {
                    fontWeight: 600,
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
                borderRadius: 12,
                alignItems: 'center',
            },
            standardSuccess: {
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                '& .MuiAlert-icon': {
                    color: '#10B981',
                },
            },
            standardError: {
                backgroundColor: '#FEF2F2',
                color: '#991B1B',
                '& .MuiAlert-icon': {
                    color: '#EF4444',
                },
            },
            standardWarning: {
                backgroundColor: '#FFFBEB',
                color: '#92400E',
                '& .MuiAlert-icon': {
                    color: '#F59E0B',
                },
            },
            standardInfo: {
                backgroundColor: '#EFF6FF',
                color: '#1E40AF',
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
                borderRadius: 20,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            },
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontWeight: 700,
                fontSize: '1.25rem',
                padding: '24px 24px 16px',
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
                borderRadius: 12,
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                border: '1px solid #E5E7EB',
                minWidth: 180,
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                padding: '10px 16px',
                fontSize: '0.875rem',
                borderRadius: 8,
                margin: '2px 8px',
                '&:hover': {
                    backgroundColor: '#F3F4F6',
                },
                '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
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
                borderRadius: 12,
                border: '1px solid #E5E7EB',
            },
        },
    },
    MuiTableHead: {
        styleOverrides: {
            root: {
                '& .MuiTableCell-head': {
                    fontWeight: 600,
                    backgroundColor: '#F9FAFB',
                    color: '#374151',
                    borderBottom: '2px solid #E5E7EB',
                },
            },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottom: '1px solid #E5E7EB',
                padding: '16px',
            },
        },
    },
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: '#F9FAFB',
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
                backgroundColor: '#1F2937',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderRadius: 8,
                padding: '8px 12px',
            },
            arrow: {
                color: '#1F2937',
            },
        },
    },

    // ===================================
    // LinearProgress Component
    // ===================================
    MuiLinearProgress: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                height: 8,
                backgroundColor: '#E5E7EB',
            },
            bar: {
                borderRadius: 8,
            },
        },
    },

    // ===================================
    // CircularProgress Component
    // ===================================
    MuiCircularProgress: {
        styleOverrides: {
            colorPrimary: {
                color: '#60A5FA',
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
        },
    },

    // ===================================
    // IconButton Component
    // ===================================
    MuiIconButton: {
        styleOverrides: {
            root: {
                borderRadius: 10,
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: '#F3F4F6',
                },
            },
        },
    },

    // ===================================
    // List Components
    // ===================================
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: 10,
                margin: '2px 8px',
                '&.Mui-selected': {
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
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
                borderRadius: 8,
            },
            rectangular: {
                borderRadius: 12,
            },
        },
    },

    // ===================================
    // Drawer Component
    // ===================================
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRight: '1px solid #E5E7EB',
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
                borderBottom: '1px solid #E5E7EB',
            },
        },
    },

    // ===================================
    // Divider Component
    // ===================================
    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: '#E5E7EB',
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
                        backgroundColor: '#60A5FA',
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
                backgroundColor: '#E5E7EB',
                opacity: 1,
            },
        },
    },

    // ===================================
    // Accordion Component
    // ===================================
    MuiAccordion: {
        styleOverrides: {
            root: {
                borderRadius: 12,
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
};
