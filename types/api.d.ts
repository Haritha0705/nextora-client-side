// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
    timestamp: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
}

// Auth API Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserResponse;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    // Additional fields based on role
    [key: string]: unknown;
}

export interface RegisterResponse {
    message: string;
    userId: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface VerifyEmailRequest {
    token: string;
}

// User API Types
export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    authorities: string[];
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    profile?: UserProfile;
}

export interface UserProfile {
    phone?: string;
    avatar?: string;
    dateOfBirth?: string;
    address?: string;
    // Role-specific fields
    studentId?: string;
    employeeId?: string;
    department?: string;
    faculty?: string;
    batch?: string;
    program?: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    // Role-specific updates
    [key: string]: unknown;
}
