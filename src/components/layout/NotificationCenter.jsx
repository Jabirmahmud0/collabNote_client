import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, Trash2, MailOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotes } from '../../hooks/useNotes';
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    respondToInvite,
  } = useNotifications();
  const { fetchNotes } = useNotes();
  const { isSupported: isBrowserNotificationSupported, permission: browserNotificationPermission, requestPermission } = useBrowserNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = async (notificationId, action) => {
    try {
      await respondToInvite(notificationId, action);
      toast.success(`Invitation ${action}ed`);

      // Refresh notes list if accepted to show the new note immediately
      if (action === 'accept') {
        fetchNotes({ force: true });
      }
    } catch (error) {
      toast.error('Failed to update invitation');
    }
  };

  const handleRequestNotificationPermission = async (e) => {
    e.stopPropagation();
    const granted = await requestPermission();
    if (granted) {
      toast.success('Browser notifications enabled!');
    } else if (browserNotificationPermission === 'denied') {
      toast.error('Notifications blocked. Enable them in browser settings.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg hover:bg-border transition-all relative ${
          isOpen ? 'bg-border text-text-primary' : 'text-text-muted hover:text-text-primary'
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }}
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-bg-primary shadow-lg shadow-accent/50"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-bg-secondary border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-bg-tertiary/30">
              <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
              <div className="flex items-center gap-2">
                {isBrowserNotificationSupported && browserNotificationPermission !== 'granted' && (
                  <button
                    onClick={handleRequestNotificationPermission}
                    className="text-[10px] font-bold text-accent hover:text-accent-hover uppercase tracking-wider flex items-center gap-1"
                    title="Enable browser notifications"
                  >
                    <AlertCircle className="w-3 h-3" /> Enable
                  </button>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-accent hover:text-accent-hover uppercase tracking-wider"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-height-[400px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-text-muted">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-8 h-8 text-text-muted/20 mx-auto mb-3" />
                  <p className="text-sm text-text-muted">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 transition-colors group ${
                        notification.status === 'unread' ? 'bg-accent/5' : 'hover:bg-bg-tertiary'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 pt-1">
                          <div className={`p-1.5 rounded-full ${
                            notification.type === 'collaboration_invite' ? 'bg-accent/10 text-accent' : 'bg-text-muted/10 text-text-muted'
                          }`}>
                            {notification.type === 'collaboration_invite' ? <MailOpen className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-text-primary leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1 font-medium">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>

                          {/* Action Buttons for Invite */}
                          {notification.type === 'collaboration_invite' && !notification.data?.response && (
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => handleAction(notification._id, 'accept')}
                                className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white px-2.5 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm"
                              >
                                <Check className="w-3 h-3" /> Accept
                              </button>
                              <button
                                onClick={() => handleAction(notification._id, 'reject')}
                                className="flex items-center gap-1.5 bg-bg-tertiary hover:bg-bg-hover text-text-primary px-2.5 py-1 rounded-md text-[10px] font-bold border border-border transition-all"
                              >
                                <X className="w-3 h-3" /> Reject
                              </button>
                            </div>
                          )}

                          {notification.data?.response && (
                            <div className="mt-2 text-[10px] font-semibold text-text-muted flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {notification.data.response === 'accept' ? 'Accepted' : 'Rejected'}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {notification.status === 'unread' && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-1.5 rounded-md hover:bg-border text-text-muted hover:text-accent transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-1.5 rounded-md hover:bg-border text-text-muted hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 bg-bg-tertiary/30 border-t border-border text-center">
                <p className="text-[10px] text-text-muted font-medium">
                  Stay updated with real-time activities
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;
