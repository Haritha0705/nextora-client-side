// User Types
import { RoleType } from '@/constants';
import { StudentRoleSpecificData } from "@/types/user";
import {StatusType} from "@/constants/status";

export interface StudentProfileResponse {
    success: boolean;
    message: string;
    data: StudentProfile;
    timestamp: string;
}

export interface StudentProfile {
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
    roleSpecificData: StudentRoleSpecificData;
}