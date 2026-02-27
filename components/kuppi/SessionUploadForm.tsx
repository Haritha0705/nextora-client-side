import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import UploadFiles from './UploadFiles';
import { useAppDispatch } from '@/store';
import { updateSessionWithFilesAsync } from '@/features/kuppi/kuppiSlice';

type Props = { sessionId: number };

export default function SessionUploadForm({ sessionId }: Props) {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!files.length) return;
        setLoading(true);
        try {
            await dispatch(updateSessionWithFilesAsync({ id: sessionId, files } as any));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2}>
            <UploadFiles multiple accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/*" onChange={(f) => setFiles(f)} />
            <Button variant="outlined" onClick={handleSubmit} disabled={loading || files.length === 0}>Upload</Button>
        </Stack>
    );
}

