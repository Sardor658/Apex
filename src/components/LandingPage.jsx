import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Users, TrendingUp, Zap, BarChart3 } from 'lucide-react';

const LandingPage = ({ onSignIn, onSignUp }) => {
  const vantaRef = useRef(null);
  const vantaInstanceRef = useRef(null);
  const [isVantaLoaded, setIsVantaLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let localVantaInstance = null;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Ensure scripts are loaded
        if (!window.THREE) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        if (!window.VANTA) await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js');

        // Prevent double initialization if unmounted or already initialized during the await
        if (!isMounted || vantaInstanceRef.current) return;

        if (vantaRef.current && window.VANTA && window.VANTA.CLOUDS) {
          localVantaInstance = window.VANTA.CLOUDS({
            el: vantaRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: 0x050505,   // Dark background
            skyColor: 0x080a10,          // Dark navy
            cloudColor: 0x334155,        // Lighter dark clouds for visibility
            cloudShadowColor: 0x020817,
            sunColor: 0x7c4dff,          // Purple accent
            sunGlareColor: 0x00e5ff,     // Cyan accent
            sunlightColor: 0x2979ff,
            speed: 1.2,
            quantity: 5.0
          });
          vantaInstanceRef.current = localVantaInstance;
          setIsVantaLoaded(true);
        }
      } catch (err) {
        console.error("Vanta initialization failed:", err);
      }
    };

    initVanta();

    const handleResize = () => {
      if (vantaInstanceRef.current) vantaInstanceRef.current.onResize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      if (vantaInstanceRef.current) {
        vantaInstanceRef.current.destroy();
        vantaInstanceRef.current = null;
      } else if (localVantaInstance) {
        localVantaInstance.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const bgStyle = {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#050505', // Base black
  };

  return (
    <div style={bgStyle}>
      {/* Vanta Canvas Container - Absolutely positioned to guarantee it sits behind content */}
      <div 
        ref={vantaRef} 
        id="vanta-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      
      {/* Ensure content is above vanta canvas */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px 50px', 
          background: 'rgba(5, 5, 5, 0.5)', 
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 className="outfit" style={{ fontSize: '1.5rem', margin: 0, fontWeight: '800' }}>Apex point</h1>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>Premium POS Solution</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '40px', fontWeight: '600', fontSize: '1rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s' }}>Asosiy</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s' }}>Xususiyatlar</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.3s' }}>Narxlar</a>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={onSignIn}
            style={{ 
              background: 'transparent', 
              color: 'white', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '1rem', 
              cursor: 'pointer',
              padding: '10px 20px'
            }}
          >
            Kirish
          </button>
          <button 
            onClick={onSignUp}
            style={{ 
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50px', 
              fontWeight: '700', 
              fontSize: '1rem', 
              cursor: 'pointer',
              padding: '12px 30px',
              boxShadow: '0 8px 20px rgba(124, 77, 255, 0.4)'
            }}
          >
            Ro'yxatdan o'tish
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', zIndex: 10 }}>
        
        {/* Left Text Content */}
        <div style={{ flex: 1, maxWidth: '600px' }}>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="outfit" 
            style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.05', marginBottom: '30px', position: 'relative' }}
          >
            Biznesingizni <br/>
            <span style={{ 
              color: '#00e5ff', 
              textShadow: '0 0 30px rgba(0,229,255,0.4)',
              display: 'inline-block'
            }}>
              aqlliroq
            </span> boshqaring <br/>
            <motion.span 
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ 
                background: 'linear-gradient(90deg, #7c4dff, #00e5ff, #2979ff, #7c4dff)', 
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                position: 'relative'
              }}
            >
              Apex point
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.8 }}
                style={{ position: 'absolute', bottom: '5px', left: 0, height: '6px', background: 'linear-gradient(90deg, #7c4dff, transparent)', borderRadius: '3px' }}
              />
            </motion.span> bilan
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ fontSize: '1.35rem', color: 'rgba(255,255,255,0.7)', marginBottom: '50px', lineHeight: '1.6', maxWidth: '540px', fontWeight: '500' }}
          >
            Sotuvlar, ombor va hisobotlarni bir joyda soddalashtirish uchun eng kuchli va zamonaviy POS tizimi.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', gap: '25px' }}
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 229, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onSignUp}
              style={{ 
                background: 'linear-gradient(135deg, #00e5ff, #7c4dff)', 
                color: '#050505', 
                border: 'none', 
                borderRadius: '20px', 
                fontWeight: '900', 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                padding: '22px 50px',
                boxShadow: '0 12px 35px rgba(0, 229, 255, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
            >
              Bepul sinab ko'rish
            </motion.button>
            <motion.button 
              whileHover={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                color: 'white', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '20px', 
                fontWeight: '700', 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                padding: '22px 50px',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.4s'
              }}
            >
              Demo ko'rish
            </motion.button>
          </motion.div>
        </div>

        {/* Right Graphic Content */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>

          {/* Background Auras */}
          <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
          <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,77,255,0.2) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, top: '40%', left: '60%' }} />

          {/* Orbital Elements */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: `${400 + i * 60}px`,
                height: `${400 + i * 60}px`,
                borderRadius: '50%',
                border: `1px ${i === 2 ? 'dashed' : 'solid'} rgba(0,229,255,${0.15 / i})`,
                zIndex: 1
              }}
            />
          ))}

          {/* Floating Data Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                x: [Math.random() * 40 - 20, Math.random() * 40 - 20],
                y: [Math.random() * 40 - 20, Math.random() * 40 - 20],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: i % 2 === 0 ? '#00e5ff' : '#7c4dff',
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                zIndex: 1,
                boxShadow: `0 0 10px ${i % 2 === 0 ? '#00e5ff' : '#7c4dff'}`
              }}
            />
          ))}

          {/* Central Dashboard Card */}
          <motion.div 
            initial={{ scale: 0.7, opacity: 0, rotateY: 15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 60 }}
            whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
            style={{ 
              width: '360px',
              background: 'rgba(10, 15, 30, 0.85)',
              backdropFilter: 'blur(30px)',
              borderRadius: '60px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '35px',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,255,0.1), inset 0 1px 1px rgba(255,255,255,0.1)',
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Glossy Reflection */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)', borderRadius: '60px 60px 0 0', pointerEvents: 'none' }} />
            {/* Mini Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(124,77,255,0.3)' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Dashboard</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Real-time analytics</div>
                </div>
              </div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676', boxShadow: '0 0 8px #00e676' }} />
            </div>

            {/* Inventory Status */}
            <div style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(124,77,255,0.08))', borderRadius: '35px', padding: '22px', marginBottom: '20px', border: '1px solid rgba(0,229,255,0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Mahsulotlar zaxirasi</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span className="outfit" style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #00e5ff, #7c4dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>8,450+</span>
                <span style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: '700' }}>dona</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                <Zap size={14} color="#7c4dff" />
                <span style={{ color: '#7c4dff', fontSize: '0.75rem', fontWeight: '700' }}>Barchasi nazoratda</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>real vaqtda</span>
              </div>
            </div>

            {/* Mini Chart Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px', marginBottom: '20px' }}>
              {[45, 65, 30, 80, 40, 95, 55, 70, 85, 50, 90, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                  style={{
                    flex: 1, borderRadius: '4px',
                    background: i % 3 === 0 ? 'linear-gradient(to top, #7c4dff, #00e5ff)' : 'rgba(124,77,255,0.15)',
                    boxShadow: i % 3 === 0 ? '0 0 8px rgba(124,77,255,0.3)' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Bottom Stats */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, background: 'rgba(0,229,255,0.06)', borderRadius: '25px', padding: '14px', border: '1px solid rgba(0,229,255,0.08)' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Savdo tezligi</div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>92%</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(124,77,255,0.06)', borderRadius: '25px', padding: '14px', border: '1px solid rgba(124,77,255,0.08)' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Samaradorlik</div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>+18%</div>
              </div>
            </div>
          </motion.div>

          {/* Floating Card — Top Right */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0, y: [-12, 12, -12] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.8, delay: 0.6 } }}
            style={{ 
              position: 'absolute', top: '20px', right: '-20px',
              background: 'rgba(15, 20, 40, 0.8)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,229,255,0.25)',
              padding: '16px 28px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.45), 0 0 15px rgba(0,229,255,0.1)',
              zIndex: 3
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #00e5ff, #7c4dff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,229,255,0.4)' }}>
              <Zap size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'white' }}>99.9%</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Tizim barqarorligi</div>
            </div>
          </motion.div>

          {/* Floating Card — Bottom Left */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0, y: [12, -12, 12] }}
            transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.8, delay: 0.8 } }}
            style={{ 
              position: 'absolute', bottom: '50px', left: '-10px',
              background: 'rgba(15, 20, 40, 0.8)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(124,77,255,0.3)',
              padding: '16px 28px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.45), 0 0 15px rgba(124,77,255,0.1)',
              zIndex: 3
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c4dff, #2979ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(124,77,255,0.4)' }}>
              <BarChart3 size={22} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'white' }}>+340%</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Oylik o'sish</div>
            </div>
          </motion.div>

          {/* Live Activity Notification — Pop Up */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], y: [50, 0, 0, -20], scale: [0.8, 1, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, times: [0, 0.1, 0.9, 1] }}
            style={{
              position: 'absolute', bottom: '-40px', left: '40%',
              background: 'rgba(0, 230, 118, 0.15)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 230, 118, 0.4)',
              padding: '10px 18px', borderRadius: '30px',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 10px 30px rgba(0, 230, 118, 0.2)',
              zIndex: 4
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676', boxShadow: '0 0 10px #00e676' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#00e676' }}>Yangi sotuv: +450,000 so'm</span>
          </motion.div>

          {/* Floating Card — Bottom Right */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [-4, 4, -4] }}
            transition={{ y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.8, delay: 1 } }}
            style={{ 
              position: 'absolute', bottom: '10px', right: '30px',
              background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,229,255,0.12)',
              padding: '10px 18px', borderRadius: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.35)'
            }}
          >
            <ShieldCheck size={16} color="#00e5ff" />
            <span style={{ fontWeight: '700', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>256-bit SSL himoya</span>
          </motion.div>

        </div>
      </main>
      </div>
    </div>
  );
};

export default LandingPage;
