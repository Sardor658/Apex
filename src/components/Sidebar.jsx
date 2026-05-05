import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Archive, 
  Users, 
  BarChart3, 
  Settings, 
  Cpu, 
  Globe, 
  Sun,
  Moon,
  Bot,
  Building,
  LogOut
} from 'lucide-react';

import { useLanguage } from './LanguageContext';

const Sidebar = ({ activeTab, setActiveTab, toggleTheme, theme, role, onLogout }) => {
  const { t } = useLanguage();
  const allMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), roles: ['boss'] },
    { id: 'pos', icon: ShoppingCart, label: t('pos'), roles: ['boss', 'worker'] },
    { id: 'products', icon: Package, label: t('products'), roles: ['boss', 'manager'] },
    { id: 'inventory', icon: Archive, label: t('inventory'), roles: ['boss', 'manager'] },
    { id: 'suppliers', icon: Building, label: t('suppliers'), roles: ['boss', 'manager'] },
    { id: 'staff', icon: Users, label: t('staff'), roles: ['boss'] },
    { id: 'reports', icon: BarChart3, label: t('reports'), roles: ['boss', 'manager'] },
    { id: 'settings', icon: Settings, label: "Sozlamalar", roles: ['boss', 'manager', 'worker'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <div className="glass-card" style={{ 
      width: 'var(--sidebar-width)', 
      height: 'calc(100vh - 40px)', 
      margin: '20px', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '15px',
      borderRadius: 'var(--liquid-radius)',
      background: 'var(--bg-card)',
      zIndex: 10,
      border: '1px solid var(--glass-border)',
      overflow: 'hidden' // Main container doesn't scroll
    }}>
      {/* Fixed Logo Section */}
      <div style={{ padding: '20px 10px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(124, 77, 255, 0.4)'
        }}>
          <img src="/logo.png" alt="Apex point Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <h2 className="outfit" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Apex point</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--accent-green)', borderRadius: '50%' }}></div>
            <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>Pro v2.4</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="sidebar-scroll-container" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden', 
        display: 'flex', 
        flexDirection: 'column',
        paddingRight: '5px' // Space for scrollbar
      }}>
        <style>
          {`
            .sidebar-scroll-container::-webkit-scrollbar {
              width: 5px;
            }
            .sidebar-scroll-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .sidebar-scroll-container::-webkit-scrollbar-thumb {
              background: rgba(124, 77, 255, 0.2);
              border-radius: 10px;
            }
            .sidebar-scroll-container::-webkit-scrollbar-thumb:hover {
              background: rgba(124, 77, 255, 0.4);
            }
          `}
        </style>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: activeTab === item.id ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
              color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-dim)',
              borderLeft: activeTab === item.id ? '4px solid var(--accent-green)' : '4px solid transparent',
              boxShadow: activeTab === item.id ? 'inset 10px 0 20px -10px rgba(0, 230, 118, 0.3)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <item.icon size={20} color={activeTab === item.id ? 'var(--accent-green)' : 'var(--text-dim)'} />
            <span style={{ fontSize: '0.95rem', fontWeight: activeTab === item.id ? '700' : '500' }}>{item.label}</span>
          </motion.div>
        ))}
      </nav>

      {/* Divider Line */}
      <div style={{ height: '1px', background: 'var(--glass-border)', margin: '15px 10px', opacity: 0.5 }}></div>

      <div style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
        <a 
          href="https://t.me/SmartPOS_ERP_Bot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="sidebar-item" 
          style={{ color: '#0088cc', background: 'rgba(0, 136, 204, 0.08)', borderRadius: '16px', padding: '14px 18px', textDecoration: 'none' }}
        >
          <Bot size={20} color="#0088cc" />
          <span style={{ fontWeight: '700' }}>Telegram Bot</span>
        </a>

        <div 
          className="sidebar-item" 
          onClick={onLogout}
          style={{ 
            color: '#ff5252', 
            background: 'rgba(255, 82, 82, 0.08)', 
            borderRadius: '16px', 
            padding: '14px 18px', 
            cursor: 'pointer',
            marginTop: '5px'
          }}
        >
          <LogOut size={20} color="#ff5252" />
          <span style={{ fontWeight: '700' }}>{t('logout')}</span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
