import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Lock, 
  Edit3, 
  Save, 
  X,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useNotification } from './NotificationSystem';
import { useLanguage } from './LanguageContext';

const ProfileModule = ({ currentUser, onUpdateProfile }) => {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const fileInputRef = useRef(null);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  const [newUsername, setNewUsername] = useState(currentUser?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification("Rasm hajmi 2MB dan oshmasligi kerak", 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatar: reader.result });
        showNotification("Profil rasmi yangilandi!", 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUsername = () => {
    if (newUsername.trim().length < 3) {
      showNotification("Username kamida 3 ta belgidan iborat bo'lishi kerak", 'warning');
      return;
    }
    onUpdateProfile({ name: newUsername });
    setIsEditingUsername(false);
    showNotification("Username muvaffaqiyatli o'zgartirildi!", 'success');
  };

  const handleSavePassword = () => {
    if (newPassword.length < 6) {
      showNotification("Parol kamida 6 ta belgidan iborat bo'lishi kerak", 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("Parollar mos kelmadi", 'error');
      return;
    }
    onUpdateProfile({ password: newPassword });
    setIsEditingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    showNotification("Parol muvaffaqiyatli o'zgartirildi!", 'success');
  };

  return (
    <div className="profile-scroll-container" style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px',
      overflowY: 'auto',
      gap: '30px',
      height: '100%'
    }}>
      <style>
        {`
          .profile-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .profile-scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .profile-scroll-container::-webkit-scrollbar-thumb {
            background: rgba(124, 77, 255, 0.3);
            border-radius: 10px;
          }
          .profile-scroll-container::-webkit-scrollbar-thumb:hover {
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: '32px',
          backdropFilter: 'var(--glass-blur)',
          boxShadow: 'var(--glass-shadow)'
        }}
      >
        <h2 className="outfit" style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '10px' }}>
          Profil Ma'lumotlari
        </h2>

        {/* Avatar Section */}
        <div style={{ position: 'relative' }}>
          <div style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '40px', 
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: 'white',
            fontWeight: '800',
            overflow: 'hidden',
            border: '4px solid var(--glass-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (currentUser?.name || 'A')[0].toUpperCase()
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current.click()}
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '-10px',
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'var(--accent-purple)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(124, 77, 255, 0.4)',
              transition: '0.3s'
            }}
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* Info Grid */}
        <div style={{ 
          width: '100%', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Username Section */}
          <div style={{ 
            padding: '20px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
              <User size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Foydalanuvchi nomi</span>
            </div>
            
            <AnimatePresence mode="wait">
              {!isEditingUsername ? (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white' }}>{currentUser?.name}</span>
                  <button 
                    onClick={() => setIsEditingUsername(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer' }}
                  >
                    <Edit3 size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: '10px' }}
                >
                  <input 
                    type="text" 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ 
                      flex: 1, 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid var(--accent-purple)', 
                      borderRadius: '10px', 
                      padding: '8px 12px',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                  <button 
                    onClick={handleSaveUsername}
                    style={{ padding: '8px', background: 'var(--accent-green)', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer' }}
                  >
                    <Save size={18} />
                  </button>
                  <button 
                    onClick={() => setIsEditingUsername(false)}
                    style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', border: 'none', color: 'white', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Role Section */}
          <div style={{ 
            padding: '20px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', 
            border: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)' }}>
              <Shield size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Lavozim</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                padding: '6px 12px', 
                background: 'rgba(41, 121, 255, 0.1)', 
                color: 'var(--accent-blue)', 
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                textTransform: 'capitalize'
              }}>
                {currentUser?.role || 'User'}
              </span>
              {currentUser?.role === 'boss' && <CheckCircle2 size={16} color="var(--accent-green)" />}
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div style={{ 
          width: '100%',
          padding: '30px', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '24px', 
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
            <Lock size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Xavfsizlik</h3>
          </div>

          {!isEditingPassword ? (
            <button 
              onClick={() => setIsEditingPassword(true)}
              className="btn-pos"
              style={{ 
                width: 'fit-content', 
                padding: '12px 24px', 
                background: 'rgba(124, 77, 255, 0.1)', 
                border: '1px solid var(--accent-purple)',
                boxShadow: 'none',
                color: 'var(--accent-purple)'
              }}
            >
              <KeyRound size={18} />
              Parolni o'zgartirish
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Yangi parol</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '12px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Parolni tasdiqlang</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '12px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={handleSavePassword}
                  style={{ flex: 1, height: '44px', background: 'var(--accent-purple)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Saqlash
                </button>
                <button 
                  onClick={() => setIsEditingPassword(false)}
                  style={{ flex: 1, height: '44px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModule;
