// Route Constants
export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',

    // User routes (Student/Normal user)
    USER: {
        DASHBOARD: '/user/dashboard',
        PROFILE: '/user/profile',
        EVENTS: '/user/events',
        KUPPI: '/user/kuppi',
        VOTING: '/user/voting',
        LOST_FOUND: '/user/lost-found',
        ACADEMIC: {
            ROOT: '/user/academic',
            CALENDAR: '/user/academic/calendar',
            MODULES: '/user/academic/modules',
            RESULTS: '/user/academic/results',
            TIMETABLE: '/user/academic/timetable',
        },
        BOARDING: '/user/boarding',
        INTERNSHIPS: '/user/internships',
        MAPS: '/user/maps',
        MEETINGS: '/user/meetings',
        SRU: '/user/sru',
    },

    // Admin routes
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USERS: '/admin/users',
        ROLES: '/admin/roles',
        EVENTS: '/admin/events',
        KUPPI: '/admin/kuppi',
        VOTING: '/admin/voting',
        LOST_FOUND: '/admin/lost-found',
        REPORTS: '/admin/reports',
    },

    // Super Admin routes
    SUPER_ADMIN: {
        DASHBOARD: '/super-admin/dashboard',
        SYSTEM_SETTINGS: '/super-admin/system-settings',
        AUDIT_LOGS: '/super-admin/audit-logs',
        USERS: '/super-admin/users',
        ROLES: '/super-admin/roles',
        BACKUP: '/super-admin/backup',
    },

    // API routes
    API: {
        AUTH: '/api/auth',
        HEALTH: '/api/health',
    },
} as const;

// Route groups for middleware
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.VERIFY_EMAIL,
];

export const PROTECTED_ROUTES_PREFIX = [
    '/user',
    '/admin',
    '/super-admin',
];

// Default redirect after login based on role
export const DEFAULT_REDIRECT_BY_ROLE: Record<string, string> = {
    'ROLE_STUDENT': ROUTES.USER.DASHBOARD,
    'ROLE_LECTURER': ROUTES.USER.DASHBOARD,
    'ROLE_ACADEMIC_STAFF': ROUTES.USER.DASHBOARD,
    'ROLE_NON_ACADEMIC_STAFF': ROUTES.USER.DASHBOARD,
    'ROLE_ADMIN': ROUTES.ADMIN.DASHBOARD,
    'ROLE_SUPER_ADMIN': ROUTES.SUPER_ADMIN.DASHBOARD,
};
