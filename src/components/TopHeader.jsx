import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, ChevronDown, LogOut, Settings, Maximize, Minimize, Power, Globe } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useNotification } from './NotificationSystem';
import { useLanguage } from './LanguageContext';

const TopHeader = ({ managerName, storeName, onLogout, toggleTheme, theme, role, onCloseRegister, setActiveTab, currentUser }) => {
  const { lang, setLang, t } = useLanguage();
  const languages = [
    { code: 'uz', label: 'UZ', flag: '🇺🇿' },
    { code: 'uzk', label: 'ЎЗ', flag: '🇺🇿' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'en', label: 'EN', flag: '🇺🇸' }
  ];
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { showNotification } = useNotification();

  const handleCloseClick = () => {
    setIsConfirmOpen(true);
  };

  const confirmClose = () => {
    onCloseRegister();
    setIsConfirmOpen(false);
    showNotification(t('success_close_register'), 'success');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div style={{ 
      height: '80px', 
      padding: '0 30px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%',
      borderBottom: '1px solid var(--glass-border)',
      background: 'transparent',
      zIndex: 5
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div className="search-bar" style={{ width: '100%', maxWidth: '300px' }}>
          <Search size={18} color="var(--text-dim)" />
          <input type="text" placeholder={t('search_placeholder')} style={{ width: '100%' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-dim)' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: '600' }}>{storeName || 'Apex point Pro'}</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {role !== 'boss' && (
          <button 
            onClick={handleCloseClick}
            className="btn-pos" 
            style={{ 
              padding: '10px 20px', 
              background: 'linear-gradient(135deg, var(--accent-orange), #ff5252)', 
              borderRadius: '12px', 
              color: 'white', 
              border: 'none', 
              fontWeight: 'bold',
              height: '44px'
            }}
            title="Smenani tugatish va hisobot jo'natish"
          >
            <Power size={18} style={{ marginRight: '8px' }} />
            {t('close_register')}
          </button>
        )}

        <button 
          onClick={toggleFullscreen}
          className="sidebar-item" 
          style={{ padding: '10px', background: 'var(--glass-border)', borderRadius: '12px' }}
          title={isFullscreen ? 'Chiqish' : 'To\'liq ekran'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Language Switcher - Premium Design */}
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          padding: '5px', 
          background: 'var(--bg-glass)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)'
        }}>
          {languages.map((l) => (
            <motion.button
              key={l.code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLang(l.code);
                showNotification(`${l.label} ${t('lang_selected')}`, 'info');
              }}
              style={{
                padding: '6px 10px',
                border: 'none',
                background: lang === l.code ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'transparent',
                color: lang === l.code ? 'white' : 'var(--text-main)',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                boxShadow: lang === l.code ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '1rem' }}>{l.flag}</span>
              <span>{l.label}</span>
            </motion.button>
          ))}
        </div>

        <div 
          onClick={toggleTheme}
          style={{ 
            display: 'flex', 
            background: 'var(--glass-border)', 
            borderRadius: '20px', 
            padding: '4px',
            cursor: 'pointer'
          }}
        >
          <div style={{ padding: '6px 12px', background: theme === 'light' ? 'var(--bg-card)' : 'transparent', borderRadius: '16px', display: 'flex', alignItems: 'center' }}>
            <Sun size={18} color={theme === 'light' ? 'var(--accent-orange)' : 'var(--text-dim)'} />
          </div>
          <div style={{ padding: '6px 12px', background: theme === 'dark' ? 'var(--bg-glass)' : 'transparent', borderRadius: '16px', display: 'flex', alignItems: 'center' }}>
            <Moon size={18} color={theme === 'dark' ? 'var(--accent-blue)' : 'var(--text-dim)'} />
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="sidebar-item" 
          style={{ padding: '10px', background: 'var(--glass-border)', borderRadius: '12px', color: '#ff5252' }}
          title="Chiqish"
        >
          <LogOut size={20} />
        </button>

        <div 
          onClick={() => setActiveTab('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid var(--glass-border)', cursor: 'pointer' }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{managerName || 'Admin'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: '600' }}>{t('manager_role')}</div>
          </div>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '14px', 
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold',
            overflow: 'hidden',
            border: '2px solid var(--glass-border)'
          }}>
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (managerName || 'A')[0].toUpperCase()
            )}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        title={t('close_register')} 
        message={t('confirm_close_register_msg')}
        onConfirm={confirmClose}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default TopHeader;
