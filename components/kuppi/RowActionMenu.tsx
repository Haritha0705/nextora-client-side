'use client';

import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface ExtraAction { key: string; label: string; onClick: () => void; color?: string }

interface Props {
    anchorEl: HTMLElement | null;
    open: boolean;
    mode: 'application' | 'session' | 'note';
    targetItem: any;
    onClose: () => void;
    onView: () => void;
    onDelete?: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    onMarkUnderReview?: () => void;
    extraActions?: ExtraAction[];
}

export default function RowActionMenu({ anchorEl, open, mode, targetItem, onClose, onView, onDelete, onApprove, onReject, onMarkUnderReview, extraActions }: Props) {
    const handleClick = (cb?: () => void) => {
        onClose();
        if (cb) cb();
    };

    if (!targetItem) return null;

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            <MenuItem onClick={() => handleClick(onView)}><VisibilityIcon sx={{ mr: 1.5, fontSize: 20 }} />View</MenuItem>
            {mode === 'application' && (targetItem.status === 'PENDING') && <MenuItem onClick={() => handleClick(onMarkUnderReview)} sx={{ color: 'info.main' }}><HourglassEmptyIcon sx={{ mr: 1.5, fontSize: 20 }} />Mark Under Review</MenuItem>}
            {targetItem?.canBeApproved && <MenuItem onClick={() => handleClick(onApprove)} sx={{ color: 'success.main' }}><ThumbUpIcon sx={{ mr: 1.5, fontSize: 20 }} />Approve</MenuItem>}
            {targetItem?.canBeRejected && <MenuItem onClick={() => handleClick(onReject)} sx={{ color: 'error.main' }}><ThumbDownIcon sx={{ mr: 1.5, fontSize: 20 }} />Reject</MenuItem>}
            {onDelete && <MenuItem onClick={() => handleClick(onDelete)} sx={{ color: 'error.main' }}><DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />Delete</MenuItem>}
            {extraActions && extraActions.map((a) => <MenuItem key={a.key} onClick={() => handleClick(a.onClick)} sx={a.color ? { color: a.color } : undefined}>{a.label}</MenuItem>)}
        </Menu>
    );
}

