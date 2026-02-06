// RoleGuard - Reusable role-based access control component
'use client';

import { ReactNode } from 'react';
import { useRole } from '../../hooks/useRole';
import { RoleType } from '../../constants/roles';
import { AccessDenied } from '../common/AccessDenied';

export interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: RoleType[];
    fallback?: ReactNode;
    accessDeniedMessage?: string;
}

/**
 * RoleGuard component - Protects content based on user roles
 * Use this to wrap layouts or pages that require specific roles
 */
export function RoleGuard({
    children,
    allowedRoles,
    fallback,
    accessDeniedMessage = "You don't have permission to access this area."
}: RoleGuardProps) {
    const { hasAnyRole } = useRole();

    if (!hasAnyRole(allowedRoles)) {
        return fallback ?? <AccessDenied message={accessDeniedMessage} />;
    }

    return <>{children}</>;
}

// Pre-configured guards for common use cases
export function AdminGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <RoleGuard
            allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}
            fallback={fallback}
            accessDeniedMessage="You need admin privileges to access this area."
        >
            {children}
        </RoleGuard>
    );
}

export function SuperAdminGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <RoleGuard
            allowedRoles={['ROLE_SUPER_ADMIN']}
            fallback={fallback}
            accessDeniedMessage="You need super admin privileges to access this area."
        >
            {children}
        </RoleGuard>
    );
}

