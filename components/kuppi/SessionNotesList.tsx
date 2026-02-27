import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchNotesBySessionAsync, selectKuppiNotesBySession, selectKuppiIsNoteLoading } from '@/features/kuppi/kuppiSlice';
import * as kuppiServices from '@/features/kuppi/services';

type Props = {
    sessionId: number;
};

export default function SessionNotesList({ sessionId }: Props) {
    const dispatch = useAppDispatch();
    const notes = useAppSelector(selectKuppiNotesBySession(sessionId));
    const loading = useAppSelector(selectKuppiIsNoteLoading);

    // local menu state for per-note actions
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchNotesBySessionAsync(sessionId));
    }, [dispatch, sessionId]);

    if (loading) return <div>Loading notes...</div>;
    if (!notes || notes.length === 0) return <div>No notes for this session.</div>;

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, noteId: number) => {
        setAnchorEl(e.currentTarget);
        setActiveNoteId(noteId);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveNoteId(null);
    };

    const handleDownload = () => {
        if (!activeNoteId) return;
        const url = kuppiServices.KUPPI_ENDPOINTS.NOTE_DOWNLOAD(activeNoteId);
        window.open(url, '_blank');
        handleMenuClose();
    };

    const handleView = () => {
        // Ideally we'd call back to parent to open a view dialog. For now just close the menu.
        handleMenuClose();
    };

    return (
        <List>
            {notes.map((n) => (
                <ListItem key={n.id} divider secondaryAction={(
                    <>
                        <IconButton edge="end" onClick={(e) => handleMenuOpen(e, n.id)}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && activeNoteId === n.id} onClose={handleMenuClose}>
                            <MenuItem onClick={handleView}><VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />View</MenuItem>
                            <MenuItem onClick={handleDownload}><DownloadIcon sx={{ mr: 1.5, fontSize: 20 }} />Download</MenuItem>
                        </Menu>
                    </>
                )}>
                    <ListItemText primary={n.title} secondary={n.uploader?.fullName || n.uploaderName} />
                </ListItem>
            ))}
        </List>
    );
}
