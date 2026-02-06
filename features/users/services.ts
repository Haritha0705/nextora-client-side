// User Services - API calls for user operations
import { api } from '../../lib/api-client';
import { UserData, UpdateUserProfileRequest } from './user.types';

const USER_ENDPOINTS = {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
};

export async function getProfile(): Promise<UserData> {
    return api.get<UserData>(USER_ENDPOINTS.PROFILE);
}

export async function updateProfile(data: UpdateUserProfileRequest): Promise<UserData> {
    return api.put<UserData>(USER_ENDPOINTS.UPDATE_PROFILE, data);
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post(USER_ENDPOINTS.CHANGE_PASSWORD, data);
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(USER_ENDPOINTS.UPLOAD_AVATAR, formData);
}
