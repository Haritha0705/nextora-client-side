// JWT Token Types
export interface JWTPayload {
    sub: string; // User ID
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    authorities: string[]; // Permissions from Spring Boot
    iat: number; // Issued at
    exp: number; // Expiration
    iss?: string; // Issuer
}

export interface DecodedToken extends JWTPayload {
    isExpired: boolean;
    expiresIn: number; // milliseconds until expiration
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
