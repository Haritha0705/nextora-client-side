import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from '@/store';
import UploadFiles from './UploadFiles';
import { createSessionWithFilesAsync } from '@/features/kuppi/kuppiSlice';
import { CreateKuppiSessionRequest } from '@/features/kuppi/types';

export default function SessionCreateForm() {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [scheduledStartTime, setScheduledStartTime] = useState('');
    const [scheduledEndTime, setScheduledEndTime] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title || !subject || !scheduledStartTime || !scheduledEndTime || !liveLink) return;
        setSubmitting(true);
        const payload: CreateKuppiSessionRequest = {
            title,
            subject,
            scheduledStartTime,
            scheduledEndTime,
            liveLink,
        } as any;

        try {
            const res: any = await dispatch(createSessionWithFilesAsync({ data: payload, files } as any));
            // handle response message via global state
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h6">Create session</Typography>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} size="small" />
            <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} size="small" />
            <TextField label="Start Time" type="datetime-local" value={scheduledStartTime} onChange={(e) => setScheduledStartTime(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="End Time" type="datetime-local" value={scheduledEndTime} onChange={(e) => setScheduledEndTime(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <TextField label="Live Link" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} size="small" />

            <UploadFiles multiple accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/*" onChange={(f) => setFiles(f)} />

            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Create</Button>
        </Stack>
    );
}

