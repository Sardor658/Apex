import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const Notification = ({ id, message, type, remove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      remove(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, remove]);

  const icons = {
    success: <CheckCircle2 size={22} color="#10b981" />,
    error: <AlertCircle size={22} color="#ef4444" />,
    warning: <AlertTriangle size={22} color="#f59e0b" />,
    info: <Info size={22} color="#3b82f6" />
  };

  const gradients = {
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
    error: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.05))',
    warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
    info: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.4 } }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        duration: 0.8 
      }}
      style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        minWidth: '320px',
        maxWidth: '450px',
        marginBottom: '12px',
        pointerEvents: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Liquid Accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '6px',
        height: '100%',
        background: gradients[type] || gradients.info,
        borderRadius: '0 4px 4px 0'
      }} />

      <div style={{ 
        width: '44px', 
        height: '44px', 
        borderRadius: '16px', 
        background: 'rgba(255, 255, 255, 0.5)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
      }}>
        {icons[type] || icons.info}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ 
          margin: 0, 
          color: '#1e293b', 
          fontSize: '0.95rem', 
          fontWeight: '600',
          lineHeight: '1.4'
        }}>
          {message}
        </p>
      </div>

      <button 
        onClick={() => remove(id)}
        style={{ 
          background: 'rgba(0,0,0,0.05)', 
          border: 'none', 
          borderRadius: '50%', 
          width: '28px', 
          height: '28px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#64748b',
          transition: '0.2s'
        }}
      >
        <X size={14} />
      </button>

      {/* Glossy Overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const remove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '30px',
        right: '30px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {notifications.map(n => (
            <Notification key={n.id} {...n} remove={remove} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
