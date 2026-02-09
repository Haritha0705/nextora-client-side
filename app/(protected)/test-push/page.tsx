'use client';

/**
 * Push Notification Test Page
 *
 * This page helps you test if push notifications are working correctly.
 * Access it at /test-push after logging in.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  AlertTitle,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import { usePushNotificationContext } from '@/contexts/PushNotificationContext';
import { PushSettings } from '@/components/notifications';
import { pushNotificationApi } from '@/features/push-notifications/services';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
}

export default function TestPushPage() {
  const {
    isSupported,
    permission,
    token,
    isRegistered,
    isLoading,
    error,
    requestPermission,
    registerToken,
    notifications,
  } = usePushNotificationContext();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // Backend test state
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendResult, setBackendResult] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [customTitle, setCustomTitle] = useState('Test Notification');
  const [customBody, setCustomBody] = useState('Hello from Nextora!');

  // Run diagnostic tests
  useEffect(() => {
    runDiagnostics();
  }, [isSupported, permission, token, isRegistered]);

  const runDiagnostics = () => {
    const results: TestResult[] = [];

    // Test 1: Browser Support
    results.push({
      name: 'Browser Support',
      status: isSupported ? 'pass' : 'fail',
      message: isSupported
        ? 'Your browser supports push notifications'
        : 'Your browser does not support push notifications',
    });

    // Test 2: Service Worker
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        const swResult: TestResult = {
          name: 'Service Worker',
          status: reg ? 'pass' : 'fail',
          message: reg
            ? `Service worker registered at scope: ${reg.scope}`
            : 'Service worker not registered',
        };
        setTestResults((prev) => {
          const filtered = prev.filter((r) => r.name !== 'Service Worker');
          return [...filtered, swResult];
        });
      });
    }
    results.push({
      name: 'Service Worker',
      status: 'pending',
      message: 'Checking service worker...',
    });

    // Test 3: Notification Permission
    results.push({
      name: 'Notification Permission',
      status:
        permission === 'granted'
          ? 'pass'
          : permission === 'denied'
          ? 'fail'
          : 'warning',
      message:
        permission === 'granted'
          ? 'Notification permission granted'
          : permission === 'denied'
          ? 'Notification permission denied. Please enable in browser settings.'
          : 'Notification permission not yet requested',
    });

    // Test 4: FCM Token
    results.push({
      name: 'FCM Token',
      status: token ? 'pass' : permission === 'granted' ? 'warning' : 'pending',
      message: token
        ? `Token obtained: ${token.substring(0, 20)}...`
        : permission === 'granted'
        ? 'Token not yet obtained. Click "Register Token" below.'
        : 'Request permission first to get FCM token',
    });

    // Test 5: Backend Registration
    results.push({
      name: 'Backend Registration',
      status: isRegistered ? 'pass' : token ? 'warning' : 'pending',
      message: isRegistered
        ? 'Token registered with backend successfully'
        : token
        ? 'Token not registered with backend. Click "Register Token" below.'
        : 'Get FCM token first',
    });

    // Test 6: Firebase Config
    const hasFirebaseConfig =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    results.push({
      name: 'Firebase Configuration',
      status: hasFirebaseConfig ? 'pass' : 'fail',
      message: hasFirebaseConfig
        ? `Firebase configured (Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID})`
        : 'Missing Firebase configuration in .env.local',
    });

    // Test 7: API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not configured';
    results.push({
      name: 'API URL',
      status: apiUrl !== 'Not configured' ? 'pass' : 'fail',
      message: `Backend API: ${apiUrl}/push/token`,
    });

    // Test 8: VAPID Key
    const hasVapidKey = !!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    results.push({
      name: 'VAPID Key',
      status: hasVapidKey ? 'pass' : 'fail',
      message: hasVapidKey
        ? 'VAPID key configured'
        : 'Missing VAPID key in .env.local',
    });

    setTestResults(results);
  };

  const handleRequestPermission = async () => {
    await requestPermission();
    runDiagnostics();
  };

  const handleRegisterToken = async () => {
    await registerToken();
    runDiagnostics();
  };

  const handleSendTestNotification = () => {
    // Send a local notification to test if notifications work
    if (permission === 'granted' && 'Notification' in window) {
      new Notification('Test Notification', {
        body: 'If you see this, browser notifications are working!',
        icon: '/icons/icon-192x192.png',
        tag: 'test-notification',
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon color="success" />;
      case 'fail':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  const passCount = testResults.filter((r) => r.status === 'pass').length;
  const failCount = testResults.filter((r) => r.status === 'fail').length;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        🔔 Push Notification Test
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page helps you verify that push notifications are properly configured.
      </Typography>

      {/* Summary */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            icon={<CheckCircleIcon />}
            label={`${passCount} Passed`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<ErrorIcon />}
            label={`${failCount} Failed`}
            color="error"
            variant="outlined"
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            startIcon={<RefreshIcon />}
            onClick={runDiagnostics}
            size="small"
          >
            Re-run Tests
          </Button>
        </Stack>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {/* Test Results */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Diagnostic Results
          </Typography>
          <List>
            {testResults.map((result, index) => (
              <ListItem key={result.name} divider={index < testResults.length - 1}>
                <ListItemIcon>{getStatusIcon(result.status)}</ListItemIcon>
                <ListItemText
                  primary={result.name}
                  secondary={result.message}
                  secondaryTypographyProps={{
                    sx: {
                      wordBreak: 'break-all',
                      fontSize: '0.8rem',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={handleRequestPermission}
              disabled={permission === 'granted' || isLoading}
              startIcon={<NotificationsActiveIcon />}
            >
              {permission === 'granted'
                ? 'Permission Already Granted'
                : 'Request Notification Permission'}
            </Button>

            <Button
              variant="contained"
              onClick={handleRegisterToken}
              disabled={permission !== 'granted' || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {isLoading ? 'Registering...' : 'Register FCM Token with Backend'}
            </Button>

            <Divider />

            <Button
              variant="outlined"
              onClick={handleSendTestNotification}
              disabled={permission !== 'granted'}
              startIcon={<NotificationsActiveIcon />}
            >
              Send Local Test Notification
            </Button>
            {testNotificationSent && (
              <Alert severity="success">
                Test notification sent! Check your system notifications.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Backend Test Endpoints */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReportIcon color="warning" />
            Backend Test Endpoints (Dev Only)
          </Typography>

          {backendError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBackendError(null)}>
              {backendError}
            </Alert>
          )}

          {backendResult && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setBackendResult(null)}>
              {backendResult}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* Ping Test */}
            <Button
              variant="outlined"
              onClick={async () => {
                setBackendLoading(true);
                setBackendError(null);
                try {
                  const res = await pushNotificationApi.ping();
                  setBackendResult(`Ping: ${res.message} - ${res.data}`);
                } catch (e: any) {
                  setBackendError(e.message);
                } finally {
                  setBackendLoading(false);
                }
              }}
              disabled={backendLoading}
            >
              1. Ping Backend
            </Button>

            {/* Diagnostics */}
            <Button
              variant="outlined"
              onClick={async () => {
                setBackendLoading(true);
                setBackendError(null);
                try {
                  const res = await pushNotificationApi.getDiagnostics();
                  setDiagnostics(res.data);
                  setBackendResult(`Diagnostics loaded! Firebase: ${res.data?.firebaseEnabled ? 'Enabled' : 'Disabled'}`);
                } catch (e: any) {
                  setBackendError(e.message);
                } finally {
                  setBackendLoading(false);
                }
              }}
              disabled={backendLoading}
            >
              2. Get Diagnostics
            </Button>

            {diagnostics && (
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>Backend Diagnostics:</Typography>
                <Typography variant="body2">Firebase Enabled: {diagnostics.firebaseEnabled ? '✅ Yes' : '❌ No'}</Typography>
                <Typography variant="body2">User ID: {diagnostics.currentUserId}</Typography>
                <Typography variant="body2">Role: {diagnostics.currentUserRole}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{diagnostics.hint}</Typography>
              </Paper>
            )}

            <Divider />

            {/* Send Test to Self */}
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                setBackendLoading(true);
                setBackendError(null);
                try {
                  const res = await pushNotificationApi.testSelf();
                  setBackendResult(`Test sent! Success: ${res.data?.successCount}/${res.data?.totalAttempted}`);
                } catch (e: any) {
                  setBackendError(e.message);
                } finally {
                  setBackendLoading(false);
                }
              }}
              disabled={backendLoading || !isRegistered}
              startIcon={backendLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              3. Send Test Notification to Self
            </Button>

            <Divider />

            {/* Custom Test */}
            <Typography variant="subtitle2">Send Custom Test Notification:</Typography>
            <TextField
              label="Title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Body"
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              size="small"
              fullWidth
              multiline
              rows={2}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                setBackendLoading(true);
                setBackendError(null);
                try {
                  const res = await pushNotificationApi.testCustom(customTitle, customBody);
                  setBackendResult(`Custom notification sent! Success: ${res.data?.successCount}/${res.data?.totalAttempted}`);
                } catch (e: any) {
                  setBackendError(e.message);
                } finally {
                  setBackendLoading(false);
                }
              }}
              disabled={backendLoading || !isRegistered || !customTitle || !customBody}
              startIcon={backendLoading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              4. Send Custom Notification
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Push Settings Component */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Push Settings Component
          </Typography>
          <PushSettings showStatus />
        </CardContent>
      </Card>

      {/* Received Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Received Notifications ({notifications.length})
          </Typography>
          {notifications.length === 0 ? (
            <Typography color="text.secondary">
              No notifications received yet. Send a notification from your backend to test.
            </Typography>
          ) : (
            <List>
              {notifications.map((notif) => (
                <ListItem key={notif.id} divider>
                  <ListItemText
                    primary={notif.title}
                    secondary={
                      <>
                        {notif.body}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notif.timestamp).toLocaleString()} - Type: {notif.type}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Token Display */}
      {token && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your FCM Token
            </Typography>
            <Typography
              variant="body2"
              sx={{
                wordBreak: 'break-all',
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
              }}
            >
              {token}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Use this token to send test notifications from your backend or Firebase Console.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="h6" gutterBottom>
          📝 Testing Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Click <strong>"Request Notification Permission"</strong> and allow notifications</li>
            <li>Click <strong>"Register FCM Token with Backend"</strong> to save the token</li>
            <li>Click <strong>"Send Local Test Notification"</strong> to verify browser notifications work</li>
            <li>
              To test backend notifications, use this cURL command:
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.900',
                  color: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  mt: 1,
                }}
              >
{`curl -X POST http://localhost:8081/api/v1/push/send \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "title": "Test Notification",
    "body": "This is a test from the backend!",
    "type": "ANNOUNCEMENT"
  }'`}
              </Box>
            </li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
}

