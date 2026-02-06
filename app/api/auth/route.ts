// Auth API Route - Placeholder for BFF proxy
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Auth API endpoint',
        status: 'ok'
    });
}

export async function POST() {
    return NextResponse.json({
        message: 'Auth POST endpoint - Use /api/auth/login or /api/auth/register',
        status: 'ok'
    });
}

