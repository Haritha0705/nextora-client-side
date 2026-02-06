// Admin Types
import { RoleType } from '../../constants/roles';

export interface AdminUserListItem {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: RoleType;
    verified: boolean;
    createdAt: string;
    lastLoginAt?: string;
    status: 'active' | 'inactive' | 'suspended';
}

export interface AdminUserFilters {
    search?: string;
    role?: RoleType;
    status?: 'active' | 'inactive' | 'suspended';
    verified?: boolean;
}

export interface CreateUserByAdminRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: RoleType;
    sendWelcomeEmail?: boolean;
}

export interface UpdateUserByAdminRequest {
    firstName?: string;
    lastName?: string;
    role?: RoleType;
    status?: 'active' | 'inactive' | 'suspended';
    verified?: boolean;
}

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    pendingVerifications: number;
}
