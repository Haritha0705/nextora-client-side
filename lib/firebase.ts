/**
 * Firebase Configuration for Push Notifications
 *
 * This module initializes Firebase and provides messaging utilities
 * for PWA push notifications.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// VAPID key for web push
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// Initialize Firebase app (singleton pattern)
let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let messagingInitialized = false;

/**
 * Register Firebase Messaging Service Worker
 * This is needed because next-pwa disables service workers in development
 */
export async function registerFirebaseServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[Firebase] Service workers not supported');
    return null;
  }

  try {
    // Check if firebase-messaging-sw.js is already registered
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();
    const existingFirebaseSW = existingRegistrations.find(
      (reg) => reg.active?.scriptURL.includes('firebase-messaging-sw.js') ||
               reg.installing?.scriptURL.includes('firebase-messaging-sw.js') ||
               reg.waiting?.scriptURL.includes('firebase-messaging-sw.js')
    );

    if (existingFirebaseSW) {
      console.log('[Firebase] Using existing firebase-messaging-sw.js registration');

      // Wait for the service worker to be ready if still installing/waiting
      if (existingFirebaseSW.installing || existingFirebaseSW.waiting) {
        await new Promise<void>((resolve) => {
          const sw = existingFirebaseSW.installing || existingFirebaseSW.waiting;
          if (sw) {
            sw.addEventListener('statechange', function handler(e) {
              if ((e.target as ServiceWorker).state === 'activated') {
                sw.removeEventListener('statechange', handler);
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      }

      return existingFirebaseSW;
    }

    // Register firebase-messaging-sw.js
    console.log('[Firebase] Registering firebase-messaging-sw.js...');
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    });

    console.log('[Firebase] Service worker registered with scope:', registration.scope);

    // Wait for the service worker to be active
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Service worker activation timeout'));
      }, 30000); // 30 second timeout

      if (registration.active) {
        clearTimeout(timeoutId);
        resolve();
        return;
      }

      const sw = registration.installing || registration.waiting;
      if (sw) {
        sw.addEventListener('statechange', function handler(e) {
          if ((e.target as ServiceWorker).state === 'activated') {
            clearTimeout(timeoutId);
            sw.removeEventListener('statechange', handler);
            resolve();
          } else if ((e.target as ServiceWorker).state === 'redundant') {
            clearTimeout(timeoutId);
            sw.removeEventListener('statechange', handler);
            reject(new Error('Service worker became redundant'));
          }
        });
      } else {
        clearTimeout(timeoutId);
        resolve();
      }
    });

    console.log('[Firebase] Service worker activated successfully');
    return registration;
  } catch (error) {
    console.error('[Firebase] Failed to register service worker:', error);
    return null;
  }
}

/**
 * Initialize Firebase app
 */
export function initializeFirebase(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase configuration is incomplete. Push notifications will not work.');
    return null;
  }

  if (!firebaseApp && getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log('[Firebase] App initialized successfully');
  } else if (!firebaseApp) {
    firebaseApp = getApps()[0];
    console.log('[Firebase] Using existing Firebase app');
  }

  // Register Firebase service worker in the background (non-blocking)
  if ('serviceWorker' in navigator) {
    registerFirebaseServiceWorker().catch((error) => {
      console.warn('[Firebase] Background service worker registration failed:', error);
    });
  }

  return firebaseApp;
}

/**
 * Get Firebase Messaging instance
 */
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (messaging && messagingInitialized) {
    return messaging;
  }

  const app = initializeFirebase();
  if (!app) {
    return null;
  }

  if (!('Notification' in window)) {
    console.warn('[Firebase] Notifications not supported in this browser');
    return null;
  }

  try {
    messaging = getMessaging(app);
    messagingInitialized = true;
    console.log('[Firebase] Messaging initialized successfully');
    return messaging;
  } catch (error) {
    console.error('[Firebase] Failed to initialize Firebase Messaging:', error);
    return null;
  }
}

/**
 * Check if the browser supports push notifications
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Check if notification permission is granted
 */
export function isNotificationPermissionGranted(): boolean {
  if (typeof window === 'undefined') return false;
  return Notification.permission === 'granted';
}

/**
 * Get current notification permission state
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Get FCM token for push notifications
 *
 * @returns FCM token string or null if unavailable
 */
export async function getFCMToken(): Promise<string | null> {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications are not supported');
    return null;
  }

  if (!isNotificationPermissionGranted()) {
    console.warn('Notification permission not granted');
    return null;
  }

  if (!VAPID_KEY) {
    console.error('VAPID key is not configured');
    return null;
  }

  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) {
    console.error('Firebase Messaging is not initialized');
    return null;
  }

  try {
    // Register Firebase service worker explicitly
    let registration = await registerFirebaseServiceWorker();

    // Fallback to navigator.serviceWorker.ready if registration failed
    if (!registration) {
      console.log('[Firebase] Falling back to navigator.serviceWorker.ready');
      registration = await navigator.serviceWorker.ready;
    }

    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('FCM Token obtained successfully');
      return token;
    } else {
      console.warn('No FCM token available');
      return null;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting FCM token:', errorMessage);

    // Handle specific Firebase errors
    if (errorMessage.includes('messaging/token-unregistered')) {
      // Token was unregistered, try to get a new one
      console.log('Token was unregistered, attempting to get new token...');
      return null;
    }

    throw error;
  }
}

/**
 * Listen for foreground messages
 *
 * @param callback Function to handle incoming messages
 * @returns Unsubscribe function (always returns a function, even if messaging is not available)
 */
export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): () => void {
  const messagingInstance = getFirebaseMessaging();

  if (!messagingInstance) {
    console.warn('[Firebase] Firebase Messaging is not initialized - foreground messages will not be received');
    // Return a no-op unsubscribe function
    return () => {};
  }

  const unsubscribe = onMessage(messagingInstance, (payload) => {
    console.log('[Firebase] Foreground message received:', payload);
    callback(payload);
  });

  return unsubscribe;
}

/**
 * Get device information for token registration
 */
export function getDeviceInfo(): { deviceInfo: string; deviceType: string } {
  if (typeof window === 'undefined') {
    return { deviceInfo: 'Unknown', deviceType: 'web' };
  }

  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera')) {
    browser = 'Opera';
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }

  return {
    deviceInfo: `${browser}/${os}`,
    deviceType: 'web',
  };
}

export type { MessagePayload };
