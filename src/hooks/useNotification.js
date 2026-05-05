// src/hooks/useNotification.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Notification types: 'info', 'success', 'warning', 'error'
 * Each notification is an object: { id, message, type }
 */
export default function useNotification() {
  const [notifications, setNotifications] = useState([]);

  // Add a notification, auto‑remove after 5 seconds
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    // Auto‑dismiss
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Manual removal (used by container on close button)
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => setNotifications([]);
  }, []);

  return { notifications, addNotification, removeNotification };
}
