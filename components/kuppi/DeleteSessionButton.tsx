import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useAppDispatch } from '@/store';
import { softDeleteSessionWithFilesAsync } from '@/features/kuppi/kuppiSlice';

type Props = { sessionId: number };

export default function DeleteSessionButton({ sessionId }: Props) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await dispatch(softDeleteSessionWithFilesAsync(sessionId) as any);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <Button color="error" variant="outlined" onClick={() => setOpen(true)}>Delete</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete session</DialogTitle>
                <DialogContent>Are you sure you want to delete this session and its files? This action cannot be undone.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleConfirm} disabled={loading}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

