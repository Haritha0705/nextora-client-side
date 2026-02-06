/**
 * @deprecated This service is deprecated. Use `@/features/auth/services` instead.
 * This file is kept for backward compatibility only.
 */
import { api } from '@/lib';
import { tokenStorage } from '@/lib';
import type { RoleType } from '@/constants/roles';
import type { RegisterData, AuthUser } from '@/features/auth/auth.types';

const AUTH_ENDPOINTS = {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    REFRESH: '/v1/auth/refresh',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    RESEND_VERIFICATION: '/v1/auth/resend-verification',
};

export interface LoginRequest {
    email: string;
    password: string;
    role: RoleType;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface RegisterResponse {
    message: string;
    userId: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface VerifyEmailRequest {
    token: string;
}

class AuthService {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);

        if (response.accessToken) {
            tokenStorage.setTokens(response.accessToken, response.refreshToken);
        }

        return response;
    }

    async register(data: RegisterData): Promise<RegisterResponse> {
        return api.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, data);
    }

    async logout(): Promise<void> {
        try {
            await api.post(AUTH_ENDPOINTS.LOGOUT);
        } finally {
            tokenStorage.clearTokens();
        }
    }

    async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
        return api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
    }

    async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
        return api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    }

    async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
        return api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, data);
    }

    async resendVerification(email: string): Promise<{ message: string }> {
        return api.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email });
    }

    isAuthenticated(): boolean {
        return !!tokenStorage.getAccessToken();
    }

    getAccessToken(): string | null {
        return tokenStorage.getAccessToken();
    }
}

export const authService = new AuthService();
export default authService;
