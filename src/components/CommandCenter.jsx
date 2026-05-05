import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, ArrowRight, ShieldAlert } from 'lucide-react';

const CommandCenter = ({ onVerify, correctPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin === correctPin) {
      onVerify(true);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="glass-card" style={{
      width: '350px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      borderRadius: '32px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        background: error ? 'rgba(255, 82, 82, 0.1)' : 'rgba(124, 77, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
        border: `1px solid ${error ? '#ff5252' : 'var(--accent-purple)'}`,
        transition: 'all 0.3s ease'
      }}>
        {error ? <ShieldAlert size={32} color="#ff5252" /> : <Lock size={32} color="var(--accent-purple)" />}
      </div>

      <h3 className="outfit" style={{ fontSize: '1.2rem', fontWeight: '700' }}>Xavfsizlik tizimi</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center' }}>
        {error ? "Noto'g'ri PIN-kod!" : "Davom etish uchun PIN-kodni kiriting"}
      </p>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: pin.length > i ? 'var(--accent-purple)' : 'var(--glass-border)',
              boxShadow: pin.length > i ? '0 0 10px var(--accent-purple)' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        width: '100%'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(num.toString())}
            style={{
              height: '56px',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              background: 'transparent',
              color: 'var(--text-main)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {num}
          </motion.button>
        ))}
        <button style={{ background: 'transparent', border: 'none' }}></button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleKeyPress('0')}
          style={{
            height: '56px',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            background: 'transparent',
            color: 'var(--text-main)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          0
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, color: '#ff5252' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          style={{
            height: '56px',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Delete size={24} />
        </motion.button>
      </div>

      <button
        className="btn-pos"
        style={{ width: '100%', marginTop: '10px', height: '56px', borderRadius: '16px', justifyContent: 'center' }}
        onClick={handleSubmit}
        disabled={pin.length < 4}
      >
        <span>Tasdiqlash</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default CommandCenter;
