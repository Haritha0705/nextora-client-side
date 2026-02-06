'use client';

import { useRouter } from 'next/navigation';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ROLES, ROLE_LABELS, RoleType } from '@/constants/roles';
import { useToast } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { LoginLayout, LoginCard, LoginForm, AdminLoginFooter, RoleOption } from '@/components/auth';

// Only admin roles (Admin and Super Admin)
const ADMIN_ROLE_OPTIONS: RoleOption[] = [
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
    { value: ROLES.SUPER_ADMIN, label: ROLE_LABELS[ROLES.SUPER_ADMIN] },
];

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (data: { email: string; password: string; role: string }) => {
        try {
            await login({
                email: data.email,
                password: data.password,
                role: data.role as RoleType,
            });
            showToast('success', 'Login Successful', 'Welcome to Admin Dashboard!');
        } catch (error) {
            showToast('error', 'Login Failed', error instanceof Error ? error.message : 'Invalid credentials');
            throw error;
        }
    };

    return (
        <LoginLayout
            onBack={() => router.push('/')}
            backgroundGradient="linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)"
            backButtonColor="white"
            footerText={<AdminLoginFooter />}
            footerTextColor="rgba(255,255,255,0.6)"
        >
            <LoginCard
                title="Admin Portal"
                subtitle="Sign in to access the admin dashboard"
                headerGradient="linear-gradient(90deg, #1E293B 0%, #334155 100%)"
                headerIcon={<AdminPanelSettingsIcon sx={{ fontSize: 32, color: 'white' }} />}
                subtitleColor="rgba(255,255,255,0.7)"
                boxShadow={12}
            >
                <LoginForm
                    roleOptions={ADMIN_ROLE_OPTIONS}
                    roleLabel="Admin Type *"
                    emailLabel="Admin Email *"
                    emailPlaceholder="admin@nextora.edu"
                    submitButtonText="Sign In as Admin"
                    submitButtonGradient="linear-gradient(90deg, #1E293B 0%, #334155 100%)"
                    submitButtonHoverGradient="linear-gradient(90deg, #0F172A 0%, #1E293B 100%)"
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </LoginCard>
        </LoginLayout>
    );
}
