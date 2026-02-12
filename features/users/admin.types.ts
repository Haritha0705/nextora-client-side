// User Types
import { RoleType } from '@/constants';
import { AdminRoleSpecificData } from "@/types/user";
import {StatusType} from "@/constants/status";

export interface AdminProfileResponse {
    success: boolean;
    message: string;
    data: AdminProfile;
    timestamp: string;
}

export interface AdminProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    profilePictureUrl: string;
    role: RoleType;
    status: StatusType;
    userType: string;
    createdAt: string;
    updatedAt: string;
    roleSpecificData: AdminRoleSpecificData;
}