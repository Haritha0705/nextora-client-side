// Auth Services - API calls for authentication
import { api } from '@/lib';
import { tokenStorage, authEvents } from '@/lib';
import { getUserFromToken } from '@/lib';
import { mapLegacyRole } from '@/constants';
import { PermissionType } from '@/constants';
import {
    AuthUser,
    AuthResponse,
    LoginCredentials,
    RegisterData,
    ForgotPasswordData,
    ResetPasswordData,
    VerifyEmailData,
} from './auth.types';

const AUTH_ENDPOINTS = {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    REFRESH: '/v1/auth/refresh',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    RESEND_VERIFICATION: '/v1/auth/resend-verification',
    ME: '/v1/auth/me',
};

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
    // Ensure a role is present for backends that require it (default to normal student)
    const payload = { ...credentials, role: credentials.role ?? 'ROLE_STUDENT' };

    // Debug/log payload (avoid logging passwords in production)
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('Auth.login payload', { ...payload, password: payload.password ? '***' : undefined });
    }

    try {
        // Backend returns { success, message, data: any }
        const resp = await api.post<{ success?: boolean; message?: string; data?: any }>(AUTH_ENDPOINTS.LOGIN, payload);

        // Normalize response shapes: some backends return { success, message, data: {...} }
        // while api client already returns res.data, so resp might itself be the body.
        // We want to unwrap to the inner object that contains tokens and user fields.
        // Examples handled:
        // 1) resp = { accessToken, refreshToken, ... }
        // 2) resp = { success, message, data: { accessToken, ... } }
        // 3) resp = { success, message, data: { data: { accessToken, ... } } }
        const level1 = (resp && typeof resp === 'object') ? (resp as any) : {};
        const level2 = (level1.data && typeof level1.data === 'object') ? level1.data : level1;
        const data = (level2.data && typeof level2.data === 'object') ? level2.data : level2;

        // Debug
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.debug('Auth.login response normalized', { level1, level2, data });
        }

        const accessToken = data?.accessToken || data?.access_token || '';
        const refreshToken = data?.refreshToken || data?.refresh_token || '';

        if (accessToken) tokenStorage.setTokens(accessToken, refreshToken || '');

        // Map user fields returned in data back into AuthUser
        const userObj = {
            id: String(data?.userId ?? data?.id ?? ''),
            email: data?.email || data?.user?.email || '',
            firstName: data?.firstName || data?.user?.firstName || '',
            lastName: data?.lastName || data?.user?.lastName || '',
            role: mapLegacyRole((data?.role || data?.user?.role || '') as string),
            authorities: data?.authorities || data?.user?.authorities || [],
            verified: true,
        } as AuthUser;

        authEvents.emit(userObj);
        return userObj;
    } catch (err: unknown) {
        // Surface backend validation messages for the UI and console
        // The API client already converts axios errors into a structured ApiError when possible
        // eslint-disable-next-line no-console
        console.error('Login failed:', err);
        throw err;
    }
}

export async function register(data: RegisterData): Promise<{ message: string; userId: string }> {
    return api.post<{ message: string; userId: string }>(AUTH_ENDPOINTS.REGISTER, data);
}

export async function logout(): Promise<void> {
    try {
        await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
        tokenStorage.clearTokens();
        authEvents.emit(null);
    }
}

export async function refreshToken(): Promise<string> {
    const currentRefreshToken = tokenStorage.getRefreshToken();
    if (!currentRefreshToken) throw new Error('No refresh token available');
    const response = await api.post<{ accessToken: string; refreshToken: string }>(
        AUTH_ENDPOINTS.REFRESH,
        { refreshToken: currentRefreshToken }
    );
    tokenStorage.setTokens(response.accessToken, response.refreshToken);
    return response.accessToken;
}

export async function getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<AuthUser>(AUTH_ENDPOINTS.ME);
    return { ...response, role: mapLegacyRole(response.role as unknown as string) };
}

export function getUserFromStoredToken(): AuthUser | null {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;
    const tokenUser = getUserFromToken(token);
    if (!tokenUser) return null;
    return {
        id: tokenUser.id,
        email: tokenUser.email,
        firstName: tokenUser.firstName,
        lastName: tokenUser.lastName,
        role: mapLegacyRole(tokenUser.role),
        authorities: tokenUser.authorities as PermissionType[],
        verified: true,
    };
}

export async function forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
}

export async function resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
}

export async function verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    return api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, data);
}

export async function resendVerification(email: string): Promise<{ message: string }> {
    return api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email });
}
