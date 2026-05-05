import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Percent, Users, Banknote, ArrowRight, 
  ShieldCheck, CheckCircle2, Store, FileText, Wallet
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useNotification } from './NotificationSystem';

const StoreSetup = ({ currentUser, onComplete }) => {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    businessType: 'YaTT',
    taxRate: '4',
    employeeCount: '',
    avgSalary: '',
    telegramBotLinked: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
    showNotification(t('success_system_started'), 'success');
  };

  return (
    <div style={{ 
      width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e5e9f5 50%, #d8def1 100%)',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden', position: 'relative'
    }}>
      
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-setup-container"
        style={{ 
          width: '900px', height: '600px', background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '40px', position: 'relative'
        }}
      >
        {/* Metal Corners Decoration */}
        {[
          { top: '20px', left: '20px', rotate: 0 },
          { top: '20px', right: '20px', rotate: 90 },
          { bottom: '20px', left: '20px', rotate: -90 },
          { bottom: '20px', right: '20px', rotate: 180 }
        ].map((corner, i) => (
          <div key={i} style={{ 
            position: 'absolute', ...corner, width: '40px', height: '40px',
            borderTop: '4px solid #94a3b8', borderLeft: '4px solid #94a3b8',
            borderRadius: '12px 0 0 0', opacity: 0.5, transform: `rotate(${corner.rotate}deg)`
          }}></div>
        ))}

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
            <Building2 size={32} color="#059669" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{t('setup_store')}</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.5' }}>
            {t('setup_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '550px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="setup-input-group">
              <select 
                value={formData.businessType}
                onChange={e => setFormData({...formData, businessType: e.target.value})}
                style={{ 
                  width: '100%', padding: '15px 20px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: '500', outline: 'none'
                }}
              >
                <option value="YaTT">{t('business_yatt')}</option>
                <option value="MCHJ">{t('business_mchj')}</option>
                <option value="Xususiy">{t('business_private')}</option>
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <Percent size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="number" 
                placeholder={t('tax_rate')} 
                value={formData.taxRate}
                onChange={e => setFormData({...formData, taxRate: e.target.value})}
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.8)', fontSize: '1rem', outline: 'none'
                }} 
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Users size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="number" 
              placeholder={t('employee_count')} 
              value={formData.employeeCount}
              onChange={e => setFormData({...formData, employeeCount: e.target.value})}
              required
              style={{ 
                width: '100%', padding: '15px 15px 15px 45px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.8)', fontSize: '1rem', outline: 'none'
              }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Banknote size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="number" 
              placeholder={t('avg_salary')} 
              value={formData.avgSalary}
              onChange={e => setFormData({...formData, avgSalary: e.target.value})}
              required
              style={{ 
                width: '100%', padding: '15px 15px 15px 45px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.8)', fontSize: '1rem', outline: 'none'
              }} 
            />
          </div>

          <div style={{ 
            padding: '15px 20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '15px',
            border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <ShieldCheck size={20} color="#059669" />
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#065f46' }}>
              {t('telegram_info')}
            </p>
          </div>

          <button type="submit" style={{ 
            marginTop: '10px', padding: '18px', background: 'linear-gradient(to right, #0891b2, #0e7490)',
            color: 'white', border: 'none', borderRadius: '20px', fontSize: '1.2rem', fontWeight: '700',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            boxShadow: '0 10px 25px rgba(8, 145, 178, 0.3)'
          }}>
            {t('start_system')} <ArrowRight size={22} />
          </button>
        </form>

        {/* Bottom Decorative Icons */}
        <div style={{ 
          position: 'absolute', bottom: '40px', left: '60px', right: '60px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Store size={40} color="#1e293b" />
            <FileText size={40} color="#1e293b" />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
              <Users size={45} color="#1e293b" />
            </motion.div>
            <Wallet size={40} color="#1e293b" />
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default StoreSetup;
