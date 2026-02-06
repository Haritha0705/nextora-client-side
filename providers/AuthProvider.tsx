'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

// Re-export types from the centralized location
export type { AuthUser as User } from '@/features/auth/auth.types';
export type { RoleType as UserRole } from '@/constants/roles';
export type { RegisterData as RegistrationData } from '@/features/auth/auth.types';

// Legacy StudentSubRole type for backward compatibility
export type StudentSubRole = 'normal' | 'club-member' | 'kuppi-mentor' | 'batch-rep';

/**
 * AuthProvider - Wrapper component that initializes auth state from stored tokens
 * Uses zustand store as the single source of truth
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const initializeFromToken = useAuthStore((state) => state.initializeFromToken);
    const isHydrated = useAuthStore((state) => state.isHydrated);

    useEffect(() => {
        if (isHydrated) {
            initializeFromToken();
        }
    }, [isHydrated, initializeFromToken]);

    return <>{children}</>;
}

/**
 * useAuth hook - Re-export from hooks for backward compatibility
 * @deprecated Use `import { useAuth } from '@/hooks'` instead
 */
export { useAuth } from '@/hooks/useAuth';
