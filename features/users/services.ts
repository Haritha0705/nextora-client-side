// User Services - API calls for user operations
import { api } from '@/lib';
import { UserProfile, UserProfileResponse, UpdateProfileRequest } from './unified-user.types';

export const USER_ENDPOINTS = {
    PROFILE: '/user/me',
    UPDATE_PROFILE: '/user/me',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
};

export async function getProfile(): Promise<UserProfileResponse> {
    return api.get<UserProfileResponse>(USER_ENDPOINTS.PROFILE);
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return api.put<UserProfile>(USER_ENDPOINTS.UPDATE_PROFILE, data);
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post(USER_ENDPOINTS.CHANGE_PASSWORD, data);
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(USER_ENDPOINTS.UPLOAD_AVATAR, formData);
}
