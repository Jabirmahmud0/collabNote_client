import { useEffect, useCallback } from 'react';

/**
 * Hook to manage browser push notifications
 */
export const useBrowserNotifications = () => {
  // Request permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't auto-request, let user trigger it
      console.log('[NOTIFY] Browser notifications available, permission not yet granted');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('[NOTIFY] Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('[NOTIFY] Notifications permission denied by user');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const sendNotification = useCallback((title, options = {}) => {
    if (!('Notification' in window)) {
      console.warn('[NOTIFY] Browser does not support notifications');
      return false;
    }

    if (Notification.permission !== 'granted') {
      console.warn('[NOTIFY] Notifications not permitted');
      return false;
    }

    const notification = new Notification(title, {
      icon: '/icon.png',
      badge: '/badge.png',
      requireInteraction: true,
      tag: 'collabnote-notification',
      ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  }, []);

  return {
    isSupported: 'Notification' in window,
    permission: Notification.permission,
    requestPermission,
    sendNotification,
  };
};
