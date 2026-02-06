// API Endpoints Configuration
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_VERIFICATION: '/auth/resend-verification',
    },

    // User
    USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        UPLOAD_AVATAR: '/user/avatar',
    },

    // Academic
    ACADEMIC: {
        CALENDAR: '/academic/calendar',
        MODULES: '/academic/modules',
        RESULTS: '/academic/results',
        TIMETABLE: '/academic/timetable',
    },

    // Events
    EVENTS: {
        LIST: '/events',
        DETAILS: (id: string) => `/events/${id}`,
        TICKETS: '/events/tickets',
        MY_TICKETS: '/events/my-tickets',
        PURCHASE: (id: string) => `/events/${id}/purchase`,
    },

    // Kuppi Sessions
    KUPPI: {
        LIST: '/kuppi',
        DETAILS: (id: string) => `/kuppi/${id}`,
        CREATE: '/kuppi',
        NOTES: '/kuppi/notes',
        JOIN: (id: string) => `/kuppi/${id}/join`,
    },

    // Lost & Found
    LOST_FOUND: {
        LIST: '/lost-found',
        DETAILS: (id: string) => `/lost-found/${id}`,
        CREATE: '/lost-found',
        CLAIM: (id: string) => `/lost-found/${id}/claim`,
    },

    // Voting / Elections
    VOTING: {
        ELECTIONS: '/voting/elections',
        CLUBS: '/voting/clubs',
        VOTE: (id: string) => `/voting/elections/${id}/vote`,
        RESULTS: (id: string) => `/voting/elections/${id}/results`,
    },

    // Meetings
    MEETINGS: {
        LECTURERS: '/meetings/lecturers',
        BOOK: '/meetings/book',
        MY_MEETINGS: '/meetings/my-meetings',
        CANCEL: (id: string) => `/meetings/${id}/cancel`,
    },

    // Maps
    MAPS: {
        BUILDINGS: '/maps/buildings',
        BUILDING_DETAILS: (id: string) => `/maps/buildings/${id}`,
    },

    // SRU (Student Resource Unit)
    SRU: {
        MESSAGES: '/sru/messages',
        REQUESTS: '/sru/requests',
        SEND: '/sru/messages',
    },

    // Boarding Houses
    BOARDING: {
        LIST: '/boarding',
        DETAILS: (id: string) => `/boarding/${id}`,
        APPLY: '/boarding/apply',
    },

    // Internships
    INTERNSHIPS: {
        LIST: '/internships',
        DETAILS: (id: string) => `/internships/${id}`,
        APPLY: (id: string) => `/internships/${id}/apply`,
    },
};
