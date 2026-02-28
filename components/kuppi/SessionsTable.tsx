'use client';

import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Typography,
    CircularProgress,
    Paper,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { KuppiSessionResponse, SessionStatus } from '@/features/kuppi';

interface Props {
    sessions: KuppiSessionResponse[];
    total: number;
    page: number;
    rowsPerPage: number;
    isLoading?: boolean;
    isTablet?: boolean;
    onOpenMenu: (e: React.MouseEvent<HTMLElement>, session: KuppiSessionResponse) => void;
    onChangePage: (newPage: number) => void;
    onChangeRowsPerPage: (newSize: number) => void;
}

const SESSION_STATUS_COLORS: Record<SessionStatus, string> = {
    SCHEDULED: '#3B82F6',
    IN_PROGRESS: '#10B981',
    COMPLETED: '#6B7280',
    CANCELLED: '#EF4444',
};

const getSessionStatusIcon = (status?: SessionStatus) => {
    switch (status) {
        case 'SCHEDULED': return undefined;
        case 'IN_PROGRESS': return undefined;
        case 'COMPLETED': return undefined;
        case 'CANCELLED': return undefined;
        default: return undefined;
    }
};

export default function SessionsTable({ sessions, total, page, rowsPerPage, isLoading, isTablet, onOpenMenu, onChangePage, onChangeRowsPerPage }: Props) {
    if (isLoading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>);
    if (!sessions || sessions.length === 0) return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No sessions found</Typography>
        </Box>
    );

    return (
        <Paper>
            <TableContainer>
                <Table size={isTablet ? 'small' : 'medium'}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: (theme) => theme.palette.primary.main + '14' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Session</TableCell>
                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Host</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Views</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map((session) => {
                            const sessionColor = SESSION_STATUS_COLORS[(session.status as SessionStatus)] ?? '#6B7280';
                            return (
                                <TableRow key={session.id} hover>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{session.title}</Typography>
                                            <Chip label={session.subject} size="small" sx={{ mt: 0.5 }} />
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        <Typography variant="body2">{session.host?.fullName ?? ''}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={session.status ?? '—'} size="small" sx={{ bgcolor: sessionColor + '14', color: sessionColor }} />
                                    </TableCell>
                                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                        <Typography variant="caption">{session.scheduledStartTime ? new Date(session.scheduledStartTime).toLocaleDateString() : ''}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{session.viewCount}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => onOpenMenu(e, session)}><MoreVertIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination component="div" count={total} page={page} onPageChange={(_, p) => onChangePage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => onChangeRowsPerPage(parseInt((e.target as HTMLInputElement).value, 10))} rowsPerPageOptions={[5, 10, 25]} />
        </Paper>
    );
}

