// Permission Guard - Permission check helpers
import { RoleType } from '../../constants/roles';
import { PermissionType } from '../../constants/permissions';
import { roleHasPermission } from './role.config';
import { PermissionCheckResult } from './authorization.types';

export function hasPermission(userRole: RoleType, userAuthorities: PermissionType[], requiredPermission: PermissionType): boolean {
    if (userAuthorities.includes(requiredPermission)) return true;
    return roleHasPermission(userRole, requiredPermission);
}

export function hasAnyPermission(userRole: RoleType, userAuthorities: PermissionType[], requiredPermissions: PermissionType[]): boolean {
    return requiredPermissions.some(p => hasPermission(userRole, userAuthorities, p));
}

export function hasAllPermissions(userRole: RoleType, userAuthorities: PermissionType[], requiredPermissions: PermissionType[]): PermissionCheckResult {
    const missing = requiredPermissions.filter(p => !hasPermission(userRole, userAuthorities, p));
    return { hasPermission: missing.length === 0, missingPermissions: missing };
}

export function canAccessRoute(userRole: RoleType, userAuthorities: PermissionType[], allowedRoles?: RoleType[], requiredPermissions?: PermissionType[], requireAll = false): boolean {
    if (allowedRoles?.length && !allowedRoles.includes(userRole)) return false;
    if (requiredPermissions?.length) {
        return requireAll ? hasAllPermissions(userRole, userAuthorities, requiredPermissions).hasPermission : hasAnyPermission(userRole, userAuthorities, requiredPermissions);
    }
    return true;
}

export function createPermissionGuard(requiredPermissions: PermissionType[], requireAll = true) {
    return (userRole: RoleType, userAuthorities: PermissionType[]) => requireAll ? hasAllPermissions(userRole, userAuthorities, requiredPermissions).hasPermission : hasAnyPermission(userRole, userAuthorities, requiredPermissions);
}

export function createRoleGuard(allowedRoles: RoleType[]) {
    return (userRole: RoleType) => allowedRoles.includes(userRole);
}
