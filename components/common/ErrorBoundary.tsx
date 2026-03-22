// Error Boundary Component
'use client';

import { Component, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Container maxWidth="sm">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 3 }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'error.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ErrorOutlineIcon sx={{ fontSize: 40, color: 'error.main' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={600}>Something went wrong</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Typography>
                        <Button variant="contained" onClick={this.handleReset}>Try Again</Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}
