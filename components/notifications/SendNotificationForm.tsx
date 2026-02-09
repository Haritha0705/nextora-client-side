"use client";

/**
 * Admin Send Notification Component
 *
 * Allows admins with PUSH:SEND permission to send notifications
 * to users, roles, or specific user IDs.
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  AlertTitle,
  CircularProgress,
  Typography,
  Divider,
  Collapse,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PreviewIcon from '@mui/icons-material/Preview';
import { sendPushNotification } from '@/features/push-notifications/services';
import type {
  NotificationType,
  UserRole,
  SendNotificationRequest,
  SendNotificationResponse,
} from '@/types/push-notification.d';

const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: 'GENERAL', label: 'General' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'EVENT', label: 'Event' },
  { value: 'VOTING_ALERT', label: 'Voting Alert' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'REMINDER', label: 'Reminder' },
  { value: 'ALERT', label: 'Alert' },
  { value: 'ASSIGNMENT', label: 'Assignment' },
  { value: 'GRADE', label: 'Grade' },
  { value: 'ATTENDANCE', label: 'Attendance' },
  { value: 'MESSAGE', label: 'Message' },
];

const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'ROLE_STUDENT', label: 'Students' },
  { value: 'ROLE_ACADEMIC_STAFF', label: 'Academic Staff' },
  { value: 'ROLE_NON_ACADEMIC_STAFF', label: 'Non-Academic Staff' },
  { value: 'ROLE_ADMIN', label: 'Admins' },
  { value: 'ROLE_SUPER_ADMIN', label: 'Super Admins' },
];

interface SendNotificationFormProps {
  onSuccess?: (response: SendNotificationResponse) => void;
  onError?: (error: string) => void;
}

export function SendNotificationForm({ onSuccess, onError }: SendNotificationFormProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [clickAction, setClickAction] = useState('');
  const [type, setType] = useState<NotificationType>('GENERAL');
  const [targetRole, setTargetRole] = useState<UserRole | ''>('');
  const [userIds, setUserIds] = useState<string>('');
  const [ttlSeconds, setTtlSeconds] = useState<number>(86400);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SendNotificationResponse | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Validation
  const isValid = title.trim().length > 0 && title.length <= 100 &&
                  body.trim().length > 0 && body.length <= 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const request: SendNotificationRequest = {
        title: title.trim(),
        body: body.trim(),
        type,
      };

      // Add optional fields
      if (imageUrl.trim()) {
        request.imageUrl = imageUrl.trim();
      }
      if (clickAction.trim()) {
        request.clickAction = clickAction.trim();
      }
      if (targetRole) {
        request.targetRole = targetRole;
      }
      if (userIds.trim()) {
        request.userIds = userIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      }
      if (ttlSeconds !== 86400) {
        request.ttlSeconds = ttlSeconds;
      }

      const response = await sendPushNotification(request);

      if (response.success && response.data) {
        setSuccess(response.data);
        onSuccess?.(response.data);

        // Reset form on success
        setTitle('');
        setBody('');
        setImageUrl('');
        setClickAction('');
        setType('GENERAL');
        setTargetRole('');
        setUserIds('');
      } else {
        const errorMsg = response.message || 'Failed to send notification';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setBody('');
    setImageUrl('');
    setClickAction('');
    setType('GENERAL');
    setTargetRole('');
    setUserIds('');
    setError(null);
    setSuccess(null);
  };

  return (
    <Card>
      <CardHeader
        title="Send Push Notification"
        subheader="Send notifications to users or specific roles"
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Title */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 characters`}
            error={title.length > 100}
          />

          {/* Body */}
          <TextField
            label="Message Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            margin="normal"
            inputProps={{ maxLength: 500 }}
            helperText={`${body.length}/500 characters`}
            error={body.length > 500}
          />

          {/* Notification Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Notification Type</InputLabel>
            <Select
              value={type}
              label="Notification Type"
              onChange={(e) => setType(e.target.value as NotificationType)}
            >
              {NOTIFICATION_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Target Role */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Target Role (Optional)</InputLabel>
            <Select
              value={targetRole}
              label="Target Role (Optional)"
              onChange={(e) => setTargetRole(e.target.value as UserRole | '')}
            >
              <MenuItem value="">All Users</MenuItem>
              {USER_ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Advanced Options */}
          <Box sx={{ mt: 2 }}>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              size="small"
            >
              Advanced Options
            </Button>
          </Box>

          <Collapse in={showAdvanced}>
            <Box sx={{ mt: 2 }}>
              {/* User IDs */}
              <TextField
                label="Specific User IDs (comma-separated)"
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="1, 2, 3"
                helperText="Leave empty to use role-based targeting"
              />

              {/* Image URL */}
              <TextField
                label="Image URL (Optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="https://example.com/image.png"
                inputProps={{ maxLength: 500 }}
              />

              {/* Click Action */}
              <TextField
                label="Click Action URL (Optional)"
                value={clickAction}
                onChange={(e) => setClickAction(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="/dashboard or https://example.com"
                inputProps={{ maxLength: 500 }}
              />

              {/* TTL */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Time to Live</InputLabel>
                <Select
                  value={ttlSeconds}
                  label="Time to Live"
                  onChange={(e) => setTtlSeconds(e.target.value as number)}
                >
                  <MenuItem value={3600}>1 Hour</MenuItem>
                  <MenuItem value={21600}>6 Hours</MenuItem>
                  <MenuItem value={43200}>12 Hours</MenuItem>
                  <MenuItem value={86400}>24 Hours (Default)</MenuItem>
                  <MenuItem value={259200}>3 Days</MenuItem>
                  <MenuItem value={604800}>1 Week</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Collapse>

          {/* Preview */}
          <Box sx={{ mt: 2 }}>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              startIcon={<PreviewIcon />}
              size="small"
              disabled={!title && !body}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </Box>

          <Collapse in={showPreview && (!!title || !!body)}>
            <Card variant="outlined" sx={{ mt: 2, bgcolor: 'grey.50' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  Notification Preview
                </Typography>
                <Box sx={{ mt: 1, p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {title || 'Notification Title'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {body || 'Notification body text will appear here...'}
                  </Typography>
                  {imageUrl && (
                    <Box
                      component="img"
                      src={imageUrl}
                      alt="Preview"
                      sx={{ mt: 1, maxWidth: '100%', maxHeight: 100, borderRadius: 1 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Collapse>

          <Divider sx={{ my: 3 }} />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              <AlertTitle>Notification Sent!</AlertTitle>
              <Typography variant="body2">
                Successfully sent {success.successCount} of {success.totalAttempted} notifications.
              </Typography>
              {success.failureCount > 0 && (
                <Typography variant="body2" color="warning.main">
                  {success.failureCount} failed to send.
                </Typography>
              )}
            </Alert>
          )}

          {/* Actions */}
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {isLoading ? 'Sending...' : 'Send Notification'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SendNotificationForm;

