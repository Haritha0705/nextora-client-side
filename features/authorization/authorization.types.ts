// Authorization Types
import { RoleType } from '../../constants/roles';
import { PermissionType } from '../../constants/permissions';

export interface RolePermissions {
    role: RoleType;
    permissions: PermissionType[];
}

export interface PermissionCheckResult {
    hasPermission: boolean;
    missingPermissions: PermissionType[];
}

export interface RouteGuardConfig {
    path: string;
    requiredRoles?: RoleType[];
    requiredPermissions?: PermissionType[];
    requireAll?: boolean; // If true, all permissions required; if false, any one is enough
}
