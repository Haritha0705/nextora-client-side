// Status enum values (matches backend)
export const STATUS = {
    ACTIVE: 'ACTIVE',
    DEACTIVATE: 'DEACTIVATE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED',
    PASSWORD_CHANGE_REQUIRED: 'PASSWORD_CHANGE_REQUIRED'
} as const;

// Status display labels
export const STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Active',
    DEACTIVATE: 'Deactivate',
    SUSPENDED: 'Suspended',
    DELETED: 'Deleted',
    PASSWORD_CHANGE_REQUIRED: 'Password Change Required'
};

export type StatusType = typeof STATUS[keyof typeof STATUS];