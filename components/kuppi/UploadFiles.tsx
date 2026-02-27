import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

type Props = {
    multiple?: boolean;
    accept?: string; // comma-separated mime types
    maxSizeBytes?: number;
    onChange: (files: File[]) => void;
};

export default function UploadFiles({ multiple = true, accept, maxSizeBytes = 25 * 1024 * 1024, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const validateAndSet = (fileList: FileList | null) => {
        if (!fileList) return;
        const arr = Array.from(fileList);
        const next: File[] = [];
        const errs: string[] = [];
        arr.forEach((f) => {
            if (f.size > maxSizeBytes) errs.push(`${f.name}: file too large`);
            else if (accept && accept.split(',').length && !accept.split(',').some(a => f.type === a.trim() || (a.trim().endsWith('/*') && f.type.startsWith(a.trim().split('/')[0])))) {
                errs.push(`${f.name}: invalid file type`);
            } else {
                next.push(f);
            }
        });
        setFiles(next);
        setErrors(errs);
        onChange(next);
    };

    return (
        <Box>
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                multiple={multiple}
                accept={accept}
                onChange={(e) => validateAndSet(e.target.files)}
            />
            <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                Select files
            </Button>
            {errors.length > 0 && (
                <Box mt={1}>
                    {errors.map((e, i) => (
                        <Typography key={i} color="error" variant="caption">{e}</Typography>
                    ))}
                </Box>
            )}
            <List>
                {files.map((f, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                        <Typography variant="body2">{f.name} ({Math.round(f.size / 1024)} KB)</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

