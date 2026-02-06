// Super Admin Types
export interface SystemSettings {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    passwordMinLength: number;
    allowedDomains: string[];
}

export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    details?: Record<string, unknown>;
}

export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    database: { status: string; latency: number };
    cache: { status: string; hitRate: number };
    storage: { status: string; usedSpace: number; totalSpace: number };
    uptime: number;
    version: string;
}

export interface BackupInfo {
    id: string;
    type: 'full' | 'incremental';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    size: number;
    createdAt: string;
    completedAt?: string;
}
