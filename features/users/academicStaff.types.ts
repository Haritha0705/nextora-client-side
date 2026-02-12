// User Types
import { RoleType } from '@/constants';
import { AcademicStaffRoleSpecificData } from "@/types/user";
import {StatusType} from "@/constants/status";

export interface AcademicStaffProfileResponse {
    success: boolean;
    message: string;
    data: AcademicStaffProfile;
    timestamp: string;
}

export interface AcademicStaffProfile {
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
    roleSpecificData: AcademicStaffRoleSpecificData;
}