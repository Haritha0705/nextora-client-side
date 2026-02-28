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
import { KuppiNoteResponse } from '@/features/kuppi';

interface Props {
    notes: KuppiNoteResponse[];
    total: number;
    page: number;
    rowsPerPage: number;
    isLoading?: boolean;
    isTablet?: boolean;
    onOpenMenu: (e: React.MouseEvent<HTMLElement>, note: KuppiNoteResponse) => void;
    onChangePage: (newPage: number) => void;
    onChangeRowsPerPage: (newSize: number) => void;
    onOpenSessionById?: (sessionId: number | string) => void;
}

export default function NotesTable({ notes, total, page, rowsPerPage, isLoading, isTablet, onOpenMenu, onChangePage, onChangeRowsPerPage, onOpenSessionById }: Props) {
    if (isLoading) return (<Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>);
    if (!notes || notes.length === 0) return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No notes found</Typography>
        </Box>
    );

    return (
        <Paper>
            <TableContainer>
                <Table size={isTablet ? 'small' : 'medium'}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: (theme) => theme.palette.primary.main + '14' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', md: 'table-cell' } }}>Uploader</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Views</TableCell>
                            <TableCell sx={{ fontWeight: 600, display: { xs: 'none', sm: 'table-cell' } }}>Downloads</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.map((note) => (
                            <TableRow key={note.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>{note.title}</Typography>
                                </TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                    <Typography variant="body2">{note.uploaderName}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={note.fileType?.toUpperCase() || 'FILE'} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{note.viewCount}</Typography>
                                </TableCell>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                    <Typography variant="body2">{note.downloadCount}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={(e) => onOpenMenu(e, note)}><MoreVertIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination component="div" count={total} page={page} onPageChange={(_, p) => onChangePage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => onChangeRowsPerPage(parseInt((e.target as HTMLInputElement).value, 10))} rowsPerPageOptions={[5, 10, 25]} />
        </Paper>
    );
}

