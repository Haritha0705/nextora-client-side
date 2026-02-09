'use client';

import { useRouter } from 'next/navigation';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { ROLES, ROLE_LABELS, RoleType } from '@/constants/roles';
import { useToast } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { LoginLayout, LoginForm } from '@/components/auth';

// Only admin roles (Admin and Super Admin)
const ADMIN_ROLE_OPTIONS = [
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
    { value: ROLES.SUPER_ADMIN, label: ROLE_LABELS[ROLES.SUPER_ADMIN] },
];

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (data: { email: string; password: string; role?: string }) => {
        try {
            await login({
                email: data.email,
                password: data.password,
                role: (data.role || ROLES.ADMIN) as RoleType,
            });
            showToast('success', 'Login Successful', 'Welcome to Admin Dashboard!');
        } catch (error) {
            showToast('error', 'Login Failed', error instanceof Error ? error.message : 'Invalid credentials');
            throw error;
        }
    };

    return (
        <LoginLayout
            brandTitle="Nextora Admin"
            heroTitle={
                <>
                    Secure Admin Portal.
                    <br />
                    Full Control.
                </>
            }
            heroSubtitle="Access the administrative dashboard to manage users, settings, and system configurations."
            features={[
                {
                    icon: <AdminPanelSettingsIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
                    title: 'User Management',
                    description: 'Manage all users and their permissions',
                },
                {
                    icon: <SecurityIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
                    title: 'System Security',
                    description: 'Monitor and control system access',
                },
                {
                    icon: <VerifiedUserIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
                    title: 'Audit Logs',
                    description: 'Track all administrative actions',
                },
            ]}
            footerText="Authorized personnel only"
        >
            <LoginForm
                title="Admin Portal"
                subtitle="Sign in to access the admin dashboard"
                roleOptions={ADMIN_ROLE_OPTIONS}
                showRoleSelector={true}
                showRememberMe={false}
                showForgotPassword={true}
                showDemoCredentials={true}
                onForgotPassword={() => router.push('/forgot-password')}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </LoginLayout>
    );
}
