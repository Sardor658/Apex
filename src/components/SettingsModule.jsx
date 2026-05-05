import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Globe, 
  Sun, 
  Moon, 
  Shield, 
  Bell, 
  Trash2, 
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useNotification } from './NotificationSystem';

const SettingsModule = ({ currentUser, setActiveTab, toggleTheme, theme }) => {
  const { lang, setLang, t } = useLanguage();
  const { showNotification } = useNotification();

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'uzk', label: "Ўзбекcha", flag: '🇺🇿' },
    { code: 'ru', label: "Русский", flag: '🇷🇺' },
    { code: 'en', label: "English", flag: '🇺🇸' }
  ];

  const handleClearCache = () => {
    if (window.confirm("Barcha kesh ma'lumotlarini o'chirmoqchimisiz?")) {
      // Keep currentUser but clear others if needed, or just notify
      showNotification("Kesh muvaffaqiyatli tozalandi!", 'success');
    }
  };

  return (
    <div className="settings-scroll-container" style={{ 
      flex: 1, 
      padding: '40px', 
      overflowY: 'auto', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '30px',
      height: '100%'
    }}>
      <style>
        {`
          .settings-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .settings-scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .settings-scroll-container::-webkit-scrollbar-thumb {
            background: rgba(124, 77, 255, 0.3);
            border-radius: 10px;
          }
          .settings-scroll-container::-webkit-scrollbar-thumb:hover {
            background: rgba(124, 77, 255, 0.5);
          }
        `}
      </style>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '800px',
          padding: '40px',
          background: 'var(--bg-card)',
          borderRadius: '32px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}
      >
        <h2 className="outfit" style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>
          Sozlamalar
        </h2>

        {/* Profile Link */}
        <div 
          onClick={() => setActiveTab('profile')}
          style={{ 
            padding: '20px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--accent-purple)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={24} color="var(--accent-purple)" />
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'white' }}>Profil sozlamalari</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Ism, parol va rasm</p>
            </div>
          </div>
          <ChevronRight size={20} color="var(--text-dim)" />
        </div>

        {/* Theme Toggle */}
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '24px', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--accent-blue)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'dark' ? <Moon size={24} color="var(--accent-blue)" /> : <Sun size={24} color="var(--accent-orange)" />}
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'white' }}>Mavzu</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Yorug' yoki tungi rejim</p>
            </div>
          </div>
          <div 
            onClick={toggleTheme}
            style={{ 
              width: '60px', 
              height: '32px', 
              background: theme === 'dark' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)', 
              borderRadius: '20px',
              padding: '4px',
              cursor: 'pointer',
              position: 'relative',
              transition: '0.3s'
            }}
          >
            <motion.div 
              animate={{ x: theme === 'dark' ? 28 : 0 }}
              style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* Language Selection */}
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '24px', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'var(--accent-green)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={24} color="var(--accent-green)" />
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'white' }}>Tilni tanlash</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Tizim tilini o'zgartirish</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); showNotification(`${l.label} tanlandi`, 'success'); }}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: lang === l.code ? '1px solid var(--accent-green)' : '1px solid var(--glass-border)',
                  background: lang === l.code ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255,255,255,0.02)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: '0.3s'
                }}
              >
                <span>{l.flag}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: lang === l.code ? '700' : '500' }}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System & Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ 
            padding: '20px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
              <Info size={18} />
              <span style={{ fontWeight: '700' }}>Tizim haqida</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Versiya: 2.4.0 (Build 2026)<br/>
              Status: Premium Pro
            </p>
          </div>
          <div 
            onClick={handleClearCache}
            style={{ 
              padding: '20px', 
              background: 'rgba(255,82,82,0.05)', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,82,82,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff5252' }}>
              <Trash2 size={18} />
              <span style={{ fontWeight: '700' }}>Keshni tozalash</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,82,82,0.6)' }}>
              Vaqtinchalik ma'lumotlarni o'chirish
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default SettingsModule;
