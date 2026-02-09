"use client";

/**
 * Push Notification Context
 *
 * Provides push notification state and actions throughout the app.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import type { DisplayedNotification, PushNotificationContextType } from '@/types/push-notification.d';

// Create context with undefined default
const PushNotificationContext = createContext<
  (PushNotificationContextType & {
    notifications: DisplayedNotification[];
    clearNotifications: () => void;
    markAsRead: (id: string) => void;
  }) | undefined
>(undefined);

interface PushNotificationProviderProps {
  children: React.ReactNode;
  onNotification?: (notification: DisplayedNotification) => void;
}

/**
 * Push Notification Provider Component
 */
export function PushNotificationProvider({
  children,
  onNotification,
}: PushNotificationProviderProps) {
  const pushNotifications = usePushNotifications({
    onNotification,
  });

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...pushNotifications,
    }),
    [pushNotifications]
  );

  return (
    <PushNotificationContext.Provider value={contextValue}>
      {children}
    </PushNotificationContext.Provider>
  );
}

/**
 * Hook to use push notification context
 */
export function usePushNotificationContext() {
  const context = useContext(PushNotificationContext);

  if (context === undefined) {
    throw new Error(
      'usePushNotificationContext must be used within a PushNotificationProvider'
    );
  }

  return context;
}

export default PushNotificationContext;

