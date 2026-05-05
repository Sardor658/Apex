import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Generic confirmation modal.
 * Props:
 *   title: string – modal title (Uzbek)
 *   message: string – body text
 *   onConfirm: () => void – called when user clicks "Tasdiqlash"
 *   onCancel: () => void – called when user clicks "Bekor qilish" or outside click
 *   isOpen: boolean – control visibility
 */
export default function ConfirmModal({ title, message, isOpen, onConfirm, onCancel }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="confirm-modal-fragment">
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              zIndex: 1001,
              width: '90%',
              maxWidth: '420px',
              padding: '35px',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 77, 255, 0.2)'
            }}
          >
            <h3 className="outfit" style={{ marginBottom: '15px', color: 'white', fontSize: '1.6rem', fontWeight: '800' }}>{title}</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '35px', fontSize: '1rem', lineHeight: '1.6' }}>{message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                className="btn-pos"
                style={{ 
                  flex: 1, 
                  height: '52px',
                  background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                  boxShadow: '0 10px 20px -5px rgba(124, 77, 255, 0.4)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Tasdiqlash
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="btn-pos"
                style={{ 
                  flex: 1, 
                  height: '52px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Bekor qilish
              </button>
            </div>
          </motion.div>
          {/* Dark overlay with higher blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          />
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
