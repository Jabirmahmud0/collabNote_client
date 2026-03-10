import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useSocket } from './useSocket';
import { useBrowserNotifications } from './useBrowserNotifications';
import { useNotificationSound } from './useNotificationSound';
import toast from 'react-hot-toast';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { socket } = useSocket();
    const { sendNotification: sendBrowserNotification } = useBrowserNotifications();
    const { playSound } = useNotificationSound();
    const hasFocusRef = useRef(document.hasFocus());

    // Track if window has focus
    useEffect(() => {
        const handleFocus = () => { hasFocusRef.current = true; };
        const handleBlur = () => { hasFocusRef.current = false; };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/notifications');
            const data = response.data.data;
            setNotifications(data);
            setUnreadCount(data.filter(n => n.status === 'unread').length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/api/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, status: 'read' } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            // Re-calculate unread count is safer
            setUnreadCount(prev => {
                const deleted = notifications.find(n => n._id === id);
                return deleted && deleted.status === 'unread' ? Math.max(0, prev - 1) : prev;
            });
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const respondToInvite = async (notificationId, action) => {
        try {
            const response = await api.post('/api/notifications/respond', {
                notificationId,
                action,
            });
            // Update notification status locally
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, status: 'read', data: { ...n.data, response: action } } : n)
            );
            setUnreadCount(prev => {
                const responded = notifications.find(n => n._id === notificationId);
                return responded && responded.status === 'unread' ? Math.max(0, prev - 1) : prev;
            });
            return response.data;
        } catch (error) {
            console.error('Failed to respond to invite:', error);
            throw error;
        }
    };

    /**
     * Handle incoming real-time notification with sound, toast, and browser notification
     */
    const handleNewNotification = useCallback((notification) => {
        console.log('[NOTIFY] Received new notification:', notification);
        
        // Add to state
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Always play sound
        playSound();

        // Show toast notification
        const isInvite = notification.type === 'collaboration_invite';
        toast.success(
            isInvite ? '📧 New collaboration invite!' : '🔔 ' + (notification.message || 'New notification'),
            {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
            }
        );

        // Show browser notification if window doesn't have focus
        if (!hasFocusRef.current) {
            sendBrowserNotification(
                isInvite ? 'Collaboration Invite' : 'CollabNote Notification',
                {
                    body: notification.message || 'You have a new notification',
                    icon: '/vite.svg',
                    badge: '/vite.svg',
                    tag: `notification-${notification._id}`,
                    requireInteraction: true,
                }
            );
        }
    }, [playSound, sendBrowserNotification]);

    /**
     * Handle invite response (when someone accepts/rejects owner's invite)
     */
    const handleInviteResponse = useCallback((data) => {
        console.log('[NOTIFY] Received invite response:', data);
        
        // Refresh notifications to get the new one created by the server
        fetchNotifications();
        
        // Play sound and show toast
        playSound();
        
        const actionText = data.action === 'accept' ? 'accepted' : 'rejected';
        toast.success(
            `✅ ${data.userName} ${actionText} your collaboration invite!`,
            {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
            }
        );

        // Show browser notification if window doesn't have focus
        if (!hasFocusRef.current) {
            sendBrowserNotification(
                'Invite Response',
                {
                    body: `${data.userName} ${actionText} your collaboration invite!`,
                    icon: '/vite.svg',
                    badge: '/vite.svg',
                    tag: `invite-response-${data.noteId}-${data.userId}`,
                    requireInteraction: true,
                }
            );
        }
    }, [playSound, sendBrowserNotification, fetchNotifications]);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        socket.on('new-notification', handleNewNotification);
        socket.on('invite-response', handleInviteResponse);
        return () => {
            socket.off('new-notification', handleNewNotification);
            socket.off('invite-response', handleInviteResponse);
        };
    }, [socket, handleNewNotification, handleInviteResponse]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        respondToInvite,
        refreshNotifications: fetchNotifications,
    };
};
