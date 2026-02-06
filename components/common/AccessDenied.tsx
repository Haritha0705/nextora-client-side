// AccessDenied - Component shown when user lacks permission
'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface AccessDeniedProps {
    message?: string;
    showBackButton?: boolean;
}

export function AccessDenied({
    message = "You don't have permission to access this page.",
    showBackButton = true,
}: AccessDeniedProps) {
    const router = useRouter();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center',
                    gap: 3,
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'error.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <LockIcon sx={{ fontSize: 40, color: 'error.main' }} />
                </Box>

                <Typography variant="h4" fontWeight={600}>
                    Access Denied
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    {message}
                </Typography>

                {showBackButton && (
                    <Button
                        variant="contained"
                        onClick={() => router.back()}
                        sx={{ mt: 2 }}
                    >
                        Go Back
                    </Button>
                )}
            </Box>
        </Container>
    );
}
