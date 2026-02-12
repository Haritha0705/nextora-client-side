// User Types
import { RoleType } from '@/constants';
import { NonAcademicStaffRoleSpecificData } from "@/types/user";
import {StatusType} from "@/constants/status";

export interface  NonAcademicStaffProfileResponse {
    success: boolean;
    message: string;
    data: NonAcademicStaffProfile;
    timestamp: string;
}

export interface NonAcademicStaffProfile {
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
    roleSpecificData: NonAcademicStaffRoleSpecificData;
}