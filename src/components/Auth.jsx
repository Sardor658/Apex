import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Store, ArrowRight, ArrowLeft, BarChart3, Package, Users, PieChart, ShieldCheck } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useNotification } from './NotificationSystem';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Auth = ({ onLogin, initialMode = 'login', onBack }) => {
  const { lang, setLang, t } = useLanguage();
  const { showNotification } = useNotification();
  const languages = [
    { code: 'uz', label: 'UZ', flag: '🇺🇿' },
    { code: 'uzk', label: 'ЎЗ', flag: '🇺🇿' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'en', label: 'EN', flag: '🇺🇸' }
  ];
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    phoneNumber: ''
  });
  const [showForgot, setShowForgot] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setIsGoogleLoading(true);
      showNotification(t('loading'), 'info');
      
      // Fetch user info from Google
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      });
      
      if (!res.ok) throw new Error('Failed to fetch user info');
      
      const googleUser = await res.json();
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const googleEmail = googleUser.email.toLowerCase();
      let user = users.find(u => u.email.toLowerCase() === googleEmail);
      
      if (!user) {
        user = {
          id: Date.now(),
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          role: 'boss',
          setupCompleted: false,
          isGoogleAuth: true
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      localStorage.setItem('currentUser', JSON.stringify({ ...user, role: 'boss' }));
      showNotification(`${googleUser.name}, ${t('success_login') || 'muvaffaqiyatli kirdingiz!'}`, 'success');
      onLogin({ ...user, role: 'boss' });
    } catch (error) {
      console.error('Google login error:', error);
      showNotification(t('error_login') || 'Google orqali kirishda xatolik yuz berdi', 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => showNotification(t('error_login'), 'error'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (isLogin) {
      const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      if (user && user.password === formData.password) {
        localStorage.setItem('currentUser', JSON.stringify({ ...user, role: 'boss' }));
        showNotification(t('success_login'), 'success');
        onLogin({ ...user, role: 'boss' });
      } else {
        showNotification(t('error_login'), 'error');
      }
    } else {
      if (users.find(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        showNotification(t('error_email_exists'), 'error');
        return;
      }
      const newUser = { ...formData, id: Date.now(), setupCompleted: false };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ ...newUser, role: 'boss' }));
      showNotification(t('success_register'), 'success');
      onLogin({ ...newUser, role: 'boss' });
    }
  };

  const FeatureItem = ({ icon: Icon, title, desc }) => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', color: 'white', marginBottom: '25px' }}>
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '10px', 
        background: 'rgba(255,255,255,0.1)', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', flexShrink: 0 
      }}>
        <Icon size={20} color="#60a5fa" />
      </div>
      <div>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{title}</h4>
        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div style={{ 
      width: '100vw', height: '100vh', display: 'flex', 
      background: '#f8fafc', overflow: 'hidden', fontFamily: 'Inter, sans-serif' 
    }}>
      
      {/* Left Side - Dark Illustration */}
      <div style={{ 
        flex: 1.2, background: '#020617', position: 'relative', 
        display: 'flex', flexDirection: 'column', padding: '60px',
        overflow: 'hidden'
      }}>
        {/* Dark Overlay for better text readability */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.8) 0%, rgba(2, 6, 23, 0.4) 50%, rgba(2, 6, 23, 0.9) 100%)',
          zIndex: 1
        }}></div>

        {/* Abstract Background Effect */}
        <div style={{ 
          position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)', zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '50px' }}>
            <div style={{ 
              width: '80px', height: '80px', 
              borderRadius: '20px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)'
            }}>
              <img src="/logo.png" alt="Apex point Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>Apex point</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.75rem' }}>Premium POS Solution</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ color: 'white', fontSize: '2.8rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', maxWidth: '500px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {t('auth_hero_title_1')} <span style={{ color: '#60a5fa' }}>{t('auth_hero_title_2')}</span> {t('auth_hero_title_3')} <span style={{ color: '#2563eb' }}>{t('auth_hero_title_4')}</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '50px', maxWidth: '450px', fontWeight: '500' }}>
              {t('auth_hero_desc')}
            </p>

            <div style={{ maxWidth: '400px' }}>
              <FeatureItem icon={BarChart3} title={t('feature_sales')} desc={t('feature_sales_desc')} />
              <FeatureItem icon={Package} title={t('feature_inventory')} desc={t('feature_inventory_desc')} />
              <FeatureItem icon={Users} title={t('feature_customers')} desc={t('feature_customers_desc')} />
              <FeatureItem icon={PieChart} title={t('feature_reports')} desc={t('feature_reports_desc')} />
            </div>
          </motion.div>
        </div>

        {/* Hero Image Illustration */}
        <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', zIndex: 0, height: '60%' }}>
          <img 
            src="/pos_manager_hero_illustration_1777891857823.png" 
            alt="POS Illustration" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-scroll-container" style={{ 
        flex: 1, 
        background: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '60px 80px 40px', 
        position: 'relative',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>
          {`
            .auth-scroll-container::-webkit-scrollbar {
              width: 6px;
            }
            .auth-scroll-container::-webkit-scrollbar-track {
              background: #f1f5f9;
            }
            .auth-scroll-container::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
            .auth-scroll-container::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        
        {/* Auth Language Switcher & Back Button */}
        <div style={{ 
          position: 'absolute', top: '20px', left: '40px', right: '40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10
        }}>
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(241, 245, 249, 0.8)', padding: '8px 16px',
                border: '1px solid #e2e8f0', borderRadius: '12px',
                color: '#475569', fontWeight: '600', cursor: 'pointer',
                backdropFilter: 'blur(5px)', transition: '0.2s'
              }}
            >
              <ArrowLeft size={16} /> Orqaga
            </button>
          )}

          <div style={{ 
            display: 'flex', gap: '6px', padding: '4px',
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
            borderRadius: '14px', border: '1px solid #e2e8f0'
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
                padding: '6px 10px', border: 'none',
                background: lang === l.code ? 'var(--accent-blue)' : 'transparent',
                color: lang === l.code ? 'white' : '#64748b',
                borderRadius: '10px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '700',
                transition: 'all 0.3s'
              }}
            >
              {l.flag} {l.label}
            </motion.button>
          ))}
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '50px', borderBottom: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => setIsLogin(true)}
            style={{ 
              padding: '15px 0', background: 'none', border: 'none', 
              color: isLogin ? '#2563eb' : '#94a3b8', fontSize: '1rem', 
              fontWeight: '600', cursor: 'pointer', position: 'relative'
            }}
          >
            {t('login')}
            {isLogin && <motion.div layoutId="tab" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#2563eb' }} />}
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            style={{ 
              padding: '15px 0', background: 'none', border: 'none', 
              color: !isLogin ? '#2563eb' : '#94a3b8', fontSize: '1rem', 
              fontWeight: '600', cursor: 'pointer', position: 'relative'
            }}
          >
            {t('register')}
            {!isLogin && <motion.div layoutId="tab" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#2563eb' }} />}
          </button>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            width: '90px', height: '90px', background: '#eff6ff', 
            borderRadius: '24px', overflow: 'hidden', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', marginBottom: '25px',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)'
          }}>
            <img src="/logo.png" alt="Apex point Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px' }}>
            {showForgot ? t('reset_password') : (isLogin ? t('welcome_back') : t('create_account'))}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {showForgot ? t('reset_password_desc') : (isLogin ? t('login_to_account') : t('start_managing'))}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {showForgot ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Email address</label>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '12px 16px', background: 'white', 
                border: '1px solid #e2e8f0', borderRadius: '12px' 
              }}>
                <Mail size={18} color="#94a3b8" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem' }} 
                />
              </div>
            </div>
          ) : (
            <>
              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{t('full_name')}</label>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '12px 16px', background: 'white', 
                    border: '1px solid #e2e8f0', borderRadius: '12px' 
                  }}>
                    <Users size={18} color="#94a3b8" />
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem' }} 
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{t('email_address')}</label>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  padding: '12px 16px', background: 'white', 
                  border: '1px solid #e2e8f0', borderRadius: '12px' 
                }}>
                  <Mail size={18} color="#94a3b8" />
                  <input 
                    type="email" 
                    placeholder={t('enter_email')} 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{t('password')}</label>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  padding: '12px 16px', background: 'white', 
                  border: '1px solid #e2e8f0', borderRadius: '12px' 
                }}>
                  <Lock size={18} color="#94a3b8" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t('enter_password')} 
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem' }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{t('store_name')}</label>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    padding: '12px 16px', background: 'white', 
                    border: '1px solid #e2e8f0', borderRadius: '12px' 
                  }}>
                    <Store size={18} color="#94a3b8" />
                    <input 
                      type="text" 
                      placeholder="Enter store name" 
                      required
                      value={formData.storeName}
                      onChange={e => setFormData({...formData, storeName: e.target.value})}
                      style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem' }} 
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
                  {t('remember_me')}
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  {t('forgot_password')}
                </button>
              </div>
            </>
          )}

          <button type="submit" style={{ 
            marginTop: '10px', padding: '16px', background: '#2563eb', 
            color: 'white', border: 'none', borderRadius: '14px', 
            fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}>
            {showForgot ? t('send_reset_link') : (isLogin ? t('login_btn') : t('create_account_btn'))}
            <ArrowRight size={20} />
          </button>
          
          {showForgot && (
            <button 
              type="button" 
              onClick={() => setShowForgot(false)}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
            >
              {t('back_to_login')}
            </button>
          )}
        </form>

        {!showForgot && (
          <>
            <div style={{ margin: '30px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t('or_continue_with')}</span>
              <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => !isGoogleLoading && loginWithGoogle()}
                disabled={isGoogleLoading}
                style={{ 
                  width: '100%', maxWidth: '300px', padding: '10px 16px', background: 'white', 
                  border: '1px solid #dadce0', borderRadius: '24px', 
                  fontSize: '15px', fontWeight: '500', cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  color: '#3c4043', transition: 'all 0.2s',
                  opacity: isGoogleLoading ? 0.7 : 1,
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
                }}
                onMouseOver={(e) => !isGoogleLoading && (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                onMouseOut={(e) => !isGoogleLoading && (e.currentTarget.style.backgroundColor = 'white')}
              >
                {isGoogleLoading ? (
                  <div className="google-spinner" style={{ 
                    width: '20px', height: '20px', border: '2px solid #f3f3f3', 
                    borderTop: '2px solid #4285F4', borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                ) : (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '22px', height: '22px' }} />
                )}
                <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                  {isGoogleLoading ? t('loading') : t('google_login_btn')}
                </span>
              </button>
            </div>
          </>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.95rem', color: '#64748b' }}>
          {isLogin ? t('dont_have_account') : t('already_have_account')}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', border: 'none', color: '#2563eb', 
              fontWeight: '800', cursor: 'pointer', marginLeft: '8px',
              textDecoration: 'underline', textUnderlineOffset: '4px'
            }}
          >
            {isLogin ? t('register') : t('login')}
          </button>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '60px',
          paddingBottom: '20px',
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px', 
          fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#10b981" />
            {t('data_secure')}
          </div>
          <span>© 2026 Apex point. {t('rights_reserved')}</span>
        </div>

      </div>
    </div>
  );
};

export default Auth;
