# Push Notification Setup Guide

## Overview

This guide explains how to set up push notifications in the Nextora LMS PWA using Firebase Cloud Messaging (FCM).

## Prerequisites

1. Firebase project with Cloud Messaging enabled
2. Backend with FCM endpoints (already implemented)
3. HTTPS (required for service workers in production)

## Setup Steps

### 1. Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Go to Project Settings > General
4. Add a web app if not already added
5. Copy the Firebase configuration

### 2. Get VAPID Key

1. In Firebase Console, go to Project Settings > Cloud Messaging
2. Under "Web Push certificates", click "Generate key pair"
3. Copy the VAPID key

### 3. Environment Variables

Create/update `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123

# VAPID Key for Web Push
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BLc-qZ...

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Update Service Worker

Edit `public/firebase-messaging-sw.js` and replace the placeholder config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
};
```

⚠️ **Important**: The service worker cannot access Next.js environment variables directly. You must either:
- Manually update the config in the service worker file
- Use a build script to inject values
- Use a separate config file that the service worker imports

## Usage

### Enable Push Notifications (User)

```tsx
import { PushNotificationProvider, usePushNotificationContext } from '@/contexts/PushNotificationContext';
import { PushSettings, EnableNotificationsBanner } from '@/components/notifications';

// In your app wrapper
function App({ children }) {
  return (
    <PushNotificationProvider>
      {children}
      <EnableNotificationsBanner />
    </PushNotificationProvider>
  );
}

// In settings page
function SettingsPage() {
  return <PushSettings showStatus={true} />;
}
```

### Use the Hook

```tsx
import { usePushNotifications } from '@/hooks';

function MyComponent() {
  const {
    isSupported,
    permission,
    isRegistered,
    isLoading,
    error,
    notifications,
    requestPermission,
    registerToken,
    unregisterToken,
    markAsRead,
  } = usePushNotifications();

  const handleEnable = async () => {
    await requestPermission();
    await registerToken();
  };

  return (
    <button onClick={handleEnable} disabled={isRegistered || isLoading}>
      {isRegistered ? 'Notifications Enabled' : 'Enable Notifications'}
    </button>
  );
}
```

### Notification Bell in Header

```tsx
import { NotificationBell, NotificationList } from '@/components/notifications';
import { useState } from 'react';
import { Popover } from '@mui/material';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <NotificationBell onClick={(e) => setAnchorEl(e.currentTarget)} />
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <NotificationList maxItems={10} />
      </Popover>
    </>
  );
}
```

### Admin Send Notification (requires PUSH:SEND permission)

```tsx
import { SendNotificationForm } from '@/components/notifications';

function AdminNotificationsPage() {
  return (
    <SendNotificationForm
      onSuccess={(result) => console.log('Sent:', result)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

## Integration with Auth

### Register on Login

```tsx
// In your auth provider or login handler
const { registerToken } = usePushNotifications();

const handleLoginSuccess = async () => {
  // After successful login
  if (Notification.permission === 'granted') {
    await registerToken();
  }
};
```

### Unregister on Logout

```tsx
const { unregisterToken } = usePushNotifications();

const handleLogout = async () => {
  await unregisterToken(); // Remove token from backend
  // ... rest of logout logic
};
```

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/push/token` | Register FCM token |
| DELETE | `/api/v1/push/token?token=xxx` | Remove single token |
| DELETE | `/api/v1/push/token/all` | Remove all user tokens |
| GET | `/api/v1/push/status` | Check push status |
| POST | `/api/v1/push/send` | Send notification (admin) |

## Notification Types

- `GENERAL` - General notifications
- `ANNOUNCEMENT` - Official announcements
- `EVENT` - Event notifications
- `VOTING_ALERT` - Voting reminders
- `SYSTEM` - System messages
- `REMINDER` - Reminders
- `ALERT` - Important alerts
- `ASSIGNMENT` - Assignment notifications
- `GRADE` - Grade notifications
- `ATTENDANCE` - Attendance notifications
- `MESSAGE` - Direct messages

## Troubleshooting

### Notifications Not Showing

1. Check browser permission (should be "granted")
2. Verify service worker is registered (DevTools > Application > Service Workers)
3. Check console for Firebase errors
4. Verify VAPID key matches between client and Firebase Console

### Token Registration Fails

1. Check network tab for API errors
2. Verify JWT token is valid
3. Check backend logs

### Service Worker Not Updating

1. Unregister old service worker in DevTools
2. Clear site data
3. Hard refresh (Cmd/Ctrl + Shift + R)

### iOS Safari Limitations

- Push notifications on iOS Safari have limited support
- Works best when app is added to home screen
- Background notifications may not work

## File Structure

```
├── lib/
│   └── firebase.ts              # Firebase initialization
├── hooks/
│   └── usePushNotifications.ts  # Main push notification hook
├── contexts/
│   └── PushNotificationContext.tsx  # React context
├── components/notifications/
│   ├── index.ts
│   ├── NotificationComponents.tsx  # UI components
│   └── SendNotificationForm.tsx    # Admin send form
├── features/push-notifications/
│   ├── index.ts
│   └── services.ts              # API service
├── providers/
│   └── PushNotificationWrapper.tsx  # Provider wrapper
├── types/
│   └── push-notification.d.ts   # TypeScript types
└── public/
    └── firebase-messaging-sw.js  # Service worker
```

