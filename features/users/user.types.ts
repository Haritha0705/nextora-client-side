// User Types
import { RoleType } from '../../constants/roles';
import { PermissionType } from '../../constants/permissions';

export interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: RoleType;
    authorities: PermissionType[];
    verified: boolean;
    createdAt: string;
    updatedAt?: string;
    profile?: UserProfileData;
}

export interface UserProfileData {
    phone?: string;
    avatar?: string;
    dateOfBirth?: string;
    address?: string;
    bio?: string;
    studentId?: string;
    employeeId?: string;
    department?: string;
    faculty?: string;
    batch?: string;
    program?: string;
}

export interface UpdateUserProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    bio?: string;
}
