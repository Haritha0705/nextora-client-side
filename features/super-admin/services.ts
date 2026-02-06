// Super Admin Services - API calls for system administration
import { api } from '../../lib/api-client';
import { PaginatedResponse, PaginationParams } from '../../types/api';
import { SystemSettings, AuditLog, SystemHealth, BackupInfo } from './super-admin.types';

const SUPER_ADMIN_ENDPOINTS = {
    SETTINGS: '/super-admin/settings',
    AUDIT_LOGS: '/super-admin/audit-logs',
    SYSTEM_HEALTH: '/super-admin/health',
    BACKUPS: '/super-admin/backups',
    BACKUP_CREATE: '/super-admin/backups/create',
};

export async function getSystemSettings(): Promise<SystemSettings> {
    return api.get<SystemSettings>(SUPER_ADMIN_ENDPOINTS.SETTINGS);
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    return api.put<SystemSettings>(SUPER_ADMIN_ENDPOINTS.SETTINGS, settings);
}

export async function getAuditLogs(params?: PaginationParams & { userId?: string; action?: string }): Promise<PaginatedResponse<AuditLog>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.action) queryParams.append('action', params.action);
    return api.get<PaginatedResponse<AuditLog>>(`${SUPER_ADMIN_ENDPOINTS.AUDIT_LOGS}?${queryParams.toString()}`);
}

export async function getSystemHealth(): Promise<SystemHealth> {
    return api.get<SystemHealth>(SUPER_ADMIN_ENDPOINTS.SYSTEM_HEALTH);
}

export async function getBackups(): Promise<BackupInfo[]> {
    return api.get<BackupInfo[]>(SUPER_ADMIN_ENDPOINTS.BACKUPS);
}

export async function createBackup(type: 'full' | 'incremental'): Promise<BackupInfo> {
    return api.post<BackupInfo>(SUPER_ADMIN_ENDPOINTS.BACKUP_CREATE, { type });
}
