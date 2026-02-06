// Middleware - JWT + Role Guard for Next.js Edge Runtime
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Constants (Note: Can't import from constants/ in Edge runtime, so defined inline)
const PUBLIC_ROUTES = ['/', '/admin/login', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
const PROTECTED_PREFIXES = ['/user', '/admin', '/super-admin'];

// Role-based route access configuration
const ROUTE_ROLE_MAP: Record<string, string[]> = {
    '/user': ['ROLE_STUDENT', 'ROLE_ACADEMIC_STAFF', 'ROLE_NON_ACADEMIC_STAFF', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    '/admin': ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    '/super-admin': ['ROLE_SUPER_ADMIN'],
} as const;

// Default dashboard paths by role
const DEFAULT_DASHBOARD: Record<string, string> = {
    'ROLE_SUPER_ADMIN': '/super-admin/dashboard',
    'ROLE_ADMIN': '/admin/dashboard',
} as const;

const DEFAULT_USER_DASHBOARD = '/user/dashboard';

interface JWTPayload {
    role?: string;
    exp?: number;
}

/**
 * Decode JWT for edge runtime (no verification - backend handles that)
 */
function decodeJWT(token: string): JWTPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload;
    } catch {
        return null;
    }
}

function isTokenExpired(exp?: number): boolean {
    if (!exp) return true;
    return exp * 1000 < Date.now();
}

function getTokenFromRequest(request: NextRequest): string | undefined {
    return request.cookies.get('accessToken')?.value ||
           request.headers.get('authorization')?.replace('Bearer ', '');
}

function createLoginRedirect(request: NextRequest, params?: Record<string, string>): NextResponse {
    const loginUrl = new URL('/login', request.url);
    if (params) {
        Object.entries(params).forEach(([key, value]) => loginUrl.searchParams.set(key, value));
    }
    return NextResponse.redirect(loginUrl);
}

function getDefaultRedirect(role?: string): string {
    return role && DEFAULT_DASHBOARD[role] ? DEFAULT_DASHBOARD[role] : DEFAULT_USER_DASHBOARD;
}

function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.includes(pathname);
}

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isStaticOrApiRoute(pathname: string): boolean {
    return pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.');
}

function checkRoleAccess(pathname: string, userRole?: string): boolean {
    for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ROLE_MAP)) {
        if (pathname.startsWith(routePrefix)) {
            return !!userRole && allowedRoles.includes(userRole);
        }
    }
    return true;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Allow static files and API routes
    if (isStaticOrApiRoute(pathname)) {
        return NextResponse.next();
    }

    // Check if route is protected
    if (!isProtectedRoute(pathname)) {
        return NextResponse.next();
    }

    // Get token
    const token = getTokenFromRequest(request);
    if (!token) {
        return createLoginRedirect(request, { redirect: pathname });
    }

    // Decode and validate token
    const payload = decodeJWT(token);
    if (!payload || isTokenExpired(payload.exp)) {
        return createLoginRedirect(request, { session: 'expired', redirect: pathname });
    }

    // Check role-based access
    if (!checkRoleAccess(pathname, payload.role)) {
        return NextResponse.redirect(new URL(getDefaultRedirect(payload.role), request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
