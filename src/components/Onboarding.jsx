import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Maximize2, Database, ArrowRight, User, Lock, ShieldCheck } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    capacity: '',
    managerName: '',
    pin: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.location;
    if (step === 2) return formData.size && formData.capacity;
    if (step === 3) return formData.managerName && formData.pin.length >= 4;
    return false;
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1a1a3a 0%, #08081a 100%)'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ width: '500px', padding: '40px', textAlign: 'center', borderRadius: '32px' }}
      >
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'rgba(124, 77, 255, 0.1)', 
          borderRadius: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px',
          border: '1px solid var(--accent-purple)'
        }}>
          {step === 1 && <Store size={40} color="var(--accent-purple)" />}
          {step === 2 && <Database size={40} color="var(--accent-purple)" />}
          {step === 3 && <ShieldCheck size={40} color="var(--accent-purple)" />}
        </div>

        <h1 className="outfit" style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'white' }}>
          {step === 1 && "Do'koningizni sozlang"}
          {step === 2 && "Ombor va hajmi"}
          {step === 3 && "Xavfsizlik va Manager"}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '30px', fontSize: '0.9rem' }}>
          {step === 1 && "Tizimni ishga tushirish uchun do'koningiz haqida ma'lumot bering"}
          {step === 2 && "Do'kon maydoni va mahsulot sig'imi haqida ma'lumot"}
          {step === 3 && "Moliya va xodimlarni boshqarish uchun paroll o'rnating"}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          {step === 1 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Do'kon nomi</label>
                <div className="search-bar" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <Store size={18} color="var(--accent-purple)" />
                  <input 
                    type="text" 
                    placeholder="Masalan: Smart Shop" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ color: 'white' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Joylashuv</label>
                <div className="search-bar" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <MapPin size={18} color="var(--accent-purple)" />
                  <input 
                    type="text" 
                    placeholder="Shahar, ko'cha..." 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    style={{ color: 'white' }}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Maydoni (m²)</label>
                <div className="search-bar" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <Maximize2 size={18} color="var(--accent-purple)" />
                  <input 
                    type="number" 
                    placeholder="Masalan: 50" 
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    style={{ color: 'white' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Ombor sig'imi (birlik)</label>
                <div className="search-bar" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <Database size={18} color="var(--accent-purple)" />
                  <input 
                    type="number" 
                    placeholder="Masalan: 1000" 
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    style={{ color: 'white' }}
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Manager Ismi Sharifi</label>
                <div className="search-bar" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <User size={18} color="var(--accent-purple)" />
                  <input 
                    type="text" 
                    placeholder="Masalan: Alisher Valiyev" 
                    value={formData.managerName}
                    onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                    style={{ color: 'white' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Kirish PIN-kodi (4 ta raqam)</label>
                <div className="search-bar" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
                  <Lock size={18} color="var(--accent-purple)" />
                  <input 
                    type="password" 
                    maxLength={4}
                    placeholder="****" 
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                    style={{ color: 'white', letterSpacing: '8px' }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button 
          className="btn-pos pulse" 
          style={{ width: '100%', marginTop: '40px', justifyContent: 'center', height: '56px', borderRadius: '16px' }}
          onClick={handleNext}
          disabled={!isStepValid()}
        >
          <span>{step === 3 ? 'Tizimni boshlash' : 'Davom etish'}</span>
          <ArrowRight size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              style={{ 
                width: i === step ? '40px' : '10px', 
                height: '6px', 
                borderRadius: '3px', 
                background: i === step ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
