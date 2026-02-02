'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );

    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const clearNotification = async (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));

    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete notification');
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );

    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-amber-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-charcoal-800 border-l border-charcoal-700 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-charcoal-700">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-warm-50">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-amber-500 text-charcoal-900 rounded-full text-xs font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-charcoal-700 rounded-lg transition"
              >
                <X size={20} className="text-charcoal-400" />
              </button>
            </div>

            {notifications.length > 0 && unreadCount > 0 && (
              <div className="px-6 py-3 border-b border-charcoal-700">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-amber-500 hover:text-amber-400 transition"
                >
                  Mark all as read
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        notification.read
                          ? 'bg-charcoal-700/50 border-charcoal-700'
                          : 'bg-charcoal-700 border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-semibold ${
                              notification.read ? 'text-charcoal-300' : 'text-warm-100'
                            }`}>
                              {notification.title}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notification.id);
                              }}
                              className="p-1 hover:bg-charcoal-600 rounded transition"
                            >
                              <X size={16} className="text-charcoal-400" />
                            </button>
                          </div>
                          <p className={`text-sm mt-1 ${
                            notification.read ? 'text-charcoal-400' : 'text-charcoal-300'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-charcoal-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell size={64} className="text-charcoal-600 mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-400 mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-charcoal-500">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
