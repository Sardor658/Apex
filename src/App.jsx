import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import POSModule from './components/POSModule';
import InventoryModule from './components/InventoryModule';
import SuppliersModule from './components/SuppliersModule';
import ReportsModule from './components/ReportsModule';
import Auth from './components/Auth';
import StaffModule from './components/StaffModule';
import StoreSetup from './components/StoreSetup';
import SettingsModule from './components/SettingsModule';
import LandingPage from './components/LandingPage';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './components/LanguageContext';
import { useNotification } from './components/NotificationSystem';

const INITIAL_INVENTORY = [];

function App() {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (e) { return null; }
  });
  
  const getInitialData = (key, defaultVal) => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) return defaultVal;
      const uId = user.id || 'default';
      const stored = localStorage.getItem(`${key}_${uId}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch { return defaultVal; }
  };

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [inventory, setInventory] = useState(() => getInitialData('inventory', INITIAL_INVENTORY));
  const [suppliers, setSuppliers] = useState(() => getInitialData('suppliers', []));
  const [staff, setStaff] = useState(() => getInitialData('staff', []));
  const [transactions, setTransactions] = useState(() => getInitialData('transactions', []));

  useEffect(() => {
    if (currentUser && currentUser.role === 'worker' && activeTab === 'dashboard') {
      setActiveTab('pos');
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    if (currentUser) {
      const uId = currentUser.id || 'default';
      localStorage.setItem(`inventory_${uId}`, JSON.stringify(inventory));
      localStorage.setItem(`suppliers_${uId}`, JSON.stringify(suppliers));
      localStorage.setItem(`staff_${uId}`, JSON.stringify(staff));
      localStorage.setItem(`transactions_${uId}`, JSON.stringify(transactions));
      localStorage.setItem('theme', theme);
      document.body.className = theme === 'light' ? 'light-mode' : '';
    }
  }, [inventory, suppliers, staff, transactions, theme, currentUser]);

  const calculateStats = useCallback(() => {
    const today = new Date().setHours(0,0,0,0);
    const todaysTransactions = transactions.filter(t => new Date(t.date).setHours(0,0,0,0) === today);
    const dailyRevenue = todaysTransactions.reduce((acc, t) => acc + t.total, 0);
    const dailyProfit = todaysTransactions.reduce((acc, t) => acc + (t.totalProfit || 0), 0);
    const orders = todaysTransactions.length;
    const totalInventoryValue = inventory.reduce((acc, i) => acc + (i.stock * i.sellingPrice), 0);
    const customers = new Set(transactions.map(t => t.id)).size; 
    const avgOrder = orders > 0 ? dailyRevenue / orders : 0;

    // Calculate Global Rankings
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const rankings = allUsers.map(user => {
      const uTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`)) || [];
      const uProfit = uTransactions.reduce((acc, t) => acc + (t.totalProfit || 0), 0);
      const uRevenue = uTransactions.reduce((acc, t) => acc + t.total, 0);
      return { 
        id: user.id, 
        storeName: user.storeName, 
        totalProfit: uProfit, 
        totalRevenue: uRevenue,
        orders: uTransactions.length 
      };
    }).sort((a, b) => b.totalProfit - a.totalProfit);

    return { 
      dailyRevenue, 
      dailyProfit, 
      orders, 
      customers, 
      avgOrder, 
      totalInventoryValue, 
      todaysTransactions,
      rankings
    };
  }, [transactions, inventory]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    const uId = user.id || 'default';
    setInventory(JSON.parse(localStorage.getItem(`inventory_${uId}`)) || INITIAL_INVENTORY);
    setSuppliers(JSON.parse(localStorage.getItem(`suppliers_${uId}`)) || []);
    setStaff(JSON.parse(localStorage.getItem(`staff_${uId}`)) || []);
    setTransactions(JSON.parse(localStorage.getItem(`transactions_${uId}`)) || []);
    setActiveTab(user.role === 'worker' ? 'pos' : 'dashboard');
  };

  const handleCloseRegister = async () => {
    const stats = calculateStats();
    const BOT_TOKEN = '8707829956:AAE2OoFPXH8LJSRTa7MxWmzqHuCnm29_jyQ';
    const CHAT_ID = currentUser?.telegramId;
    if (!CHAT_ID) {
      showNotification("Telegram ID kiritilmagan. Hisobot yuborilmadi.", 'info');
      return;
    }
    
    const message = `🏁 *KASSA YOPILDI* (Kunlik Hisobot)\n\n🏪 Do'kon: ${currentUser?.storeName}\n👤 Ishchi: ${currentUser?.name}\n--------------------------\n💵 Jami savdo: ${stats.dailyRevenue.toLocaleString()} so'm\n🛒 Buyurtmalar soni: ${stats.orders} ta\n👥 Mijozlar soni: ${stats.customers} ta\n--------------------------\n📅 Sana: ${new Date().toLocaleString()}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });
      showNotification(t('success_register_closed'), 'success');
    } catch (e) {
      showNotification(t('error_network'), 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    showNotification(t('logout_msg'), 'info');
  };

  const formatPhoneForDisplay = (phone) => {
    if (!phone) return 'Noma\'lum';
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 12) {
      return `+${clean.slice(0, 3)} (${clean.slice(3, 5)}) ${clean.slice(5, 8)}-${clean.slice(8, 10)}-${clean.slice(10, 12)}`;
    }
    return '+' + clean;
  };

  const sendTelegramNotification = async (cartItems, total, paymentMethod) => {
    const BOT_TOKEN = '8707829956:AAE2OoFPXH8LJSRTa7MxWmzqHuCnm29_jyQ';
    const CHAT_ID = currentUser?.telegramId || '6512684824'; // Default to boss if no ID yet, but user wants phone linking
    const itemsList = cartItems.map(item => `🔹 ${item.name} - ${item.qty} ta x ${item.sellingPrice.toLocaleString()} so'm`).join('\n');
    const message = `🛍 *Yangi Sotuv!* \n\n🏪 Do'kon: ${currentUser?.storeName}\n👤 Sotuvchi: ${currentUser?.name}\n📞 Tel: ${formatPhoneForDisplay(currentUser?.phoneNumber)}\n--------------------------\n${itemsList}\n--------------------------\n💰 *Jami: ${total.toLocaleString()} so'm*\n💳 To'lov: ${paymentMethod.toUpperCase()}`;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });
    } catch (e) {
      console.error("Telegram xatosi", e);
    }
  };

  const sendOutOfStockAlert = async (item) => {
    const BOT_TOKEN = '8707829956:AAE2OoFPXH8LJSRTa7MxWmzqHuCnm29_jyQ';
    const CHAT_ID = currentUser?.telegramId;
    if (!CHAT_ID) return;
    const message = `⚠️ *DIQQAT! MAHSULOT TUGADI*\n\n📦 Mahsulot: ${item.name}\n🔢 Shtrix-kod: ${item.barcode || item.sku}\n🛑 Iltimos, zudlik bilan buyurtma bering!`;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });
    } catch (e) {}
  };

  const handleTransaction = (cartItems, paymentMethod) => {
    const itemsWithProfit = cartItems.map(item => ({
      ...item,
      profit: (item.sellingPrice - (item.purchasePrice || 0)) * item.qty
    }));
    const total = cartItems.reduce((acc, curr) => acc + (curr.sellingPrice * curr.qty), 0);
    const totalProfit = itemsWithProfit.reduce((acc, curr) => acc + curr.profit, 0);
    
    sendTelegramNotification(cartItems, total, paymentMethod);
    setInventory(prev => prev.map(item => {
      const cartItem = cartItems.find(c => c.id === item.id);
      if (cartItem) {
        const newStock = Math.max(0, item.stock - cartItem.qty);
        if (newStock === 0 && item.stock > 0) sendOutOfStockAlert(item);
        return { ...item, stock: newStock };
      }
      return item;
    }));
    setTransactions(prev => [{ id: Date.now(), items: itemsWithProfit, total, totalProfit, paymentMethod, date: new Date() }, ...prev]);
    showNotification(t('success_sale'), 'success');
  };

  const handleDeleteTransaction = async (id) => {
    const trans = transactions.find(t => t.id === id);
    if (!trans) return;
    
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    const BOT_TOKEN = '8707829956:AAE2OoFPXH8LJSRTa7MxWmzqHuCnm29_jyQ';
    const CHAT_ID = currentUser?.telegramId || '6512684824';
    const message = `❌ *SOTUV BEKOR QILINDI!*\n\n🏪 Do'kon: ${currentUser?.storeName}\n👤 Bekor qildi: ${currentUser?.name}\n💰 Summa: ${trans.total.toLocaleString()} so'm\n🆔 ID: #${id.toString().slice(-6)}\n📅 Vaqt: ${new Date().toLocaleString()}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });
    } catch (e) {}
  };

  const handleUpdateProfile = (newData) => {
    const updatedUser = { ...currentUser, ...newData };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Also update in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={calculateStats()} inventory={inventory} transactions={transactions} />;
      case 'pos': return <POSModule inventory={inventory} onTransaction={handleTransaction} />;
      case 'inventory':
      case 'products':
        return <InventoryModule inventory={inventory} isAuthorized={true} currentUser={currentUser} onAdd={(item) => { setInventory(p => [...p, {...item, id: Date.now()}]); showNotification("Yangi mahsulot qo'shildi!", 'success'); }} onUpdate={(id, data) => { setInventory(p => p.map(i => i.id === id ? {...i, ...data} : i)); showNotification("Mahsulot yangilandi!", 'success'); }} onDelete={(id) => { setInventory(p => p.filter(i => i.id !== id)); showNotification("Mahsulot o'chirildi!", 'error'); }} />;
      case 'suppliers':
        return <SuppliersModule suppliers={suppliers} onAddSupplier={(s) => setSuppliers(p => [...p, {...s, id: Date.now()}])} onDeleteSupplier={(id) => setSuppliers(p => p.filter(s => s.id !== id))} inventory={inventory} onUpdateInventory={(id, data) => setInventory(p => p.map(i => i.id.toString() === id.toString() ? {...i, ...data} : i))} currentUser={currentUser} />;
      case 'reports':
        return <ReportsModule transactions={transactions} inventory={inventory} staff={staff} currentUser={currentUser} onDeleteTransaction={handleDeleteTransaction} />;
      case 'staff':
        return <StaffModule staff={staff} onAdd={(m) => setStaff(p => [...p, {...m, id: Date.now()}])} onUpdate={(id, data) => setStaff(p => p.map(s => s.id === id ? {...s, ...data} : s))} onDelete={(id) => setStaff(p => p.filter(s => s.id !== id))} />;
      case 'profile':
        return <ProfileModule currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />;
      case 'settings':
        return <SettingsModule currentUser={currentUser} setActiveTab={setActiveTab} toggleTheme={toggleTheme} theme={theme} />;
      default: return <Dashboard stats={calculateStats()} />;
    }
  };

  const handleSetupComplete = (setupData) => {
    const updatedUser = { ...currentUser, ...setupData, setupCompleted: true };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(u => u.email === updatedUser.email ? { ...u, ...setupData, setupCompleted: true } : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  if (currentUser && currentUser.setupCompleted === false && currentUser.role === 'boss') {
    return <StoreSetup currentUser={currentUser} onComplete={handleSetupComplete} />;
  }

  if (!currentUser) {
    return (
      <AnimatePresence mode="wait">
        {showAuth ? (
          <motion.div 
            key="auth" 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 100 }} 
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: '100vw', height: '100vh', position: 'absolute', zIndex: 50 }}
          >
            <Auth 
              onLogin={handleLogin} 
              initialMode={authMode} 
              onBack={() => setShowAuth(false)} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="landing" 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }} 
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ width: '100vw', height: '100vh', position: 'absolute', zIndex: 50 }}
          >
            <LandingPage 
              onSignIn={() => { setAuthMode('login'); setShowAuth(true); }} 
              onSignUp={() => { setAuthMode('register'); setShowAuth(true); }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-deep)', color: 'var(--text-main)', position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Liquid Background for Glassmorphism */}
      <div className="liquid-bg"></div>
      
      {/* Liquid Background Orbs */}
      <div className="liquid-orb" style={{ top: '-10%', left: '10%', width: '45vw', height: '45vw', background: 'var(--accent-blue)', opacity: 0.2 }}></div>
      <div className="liquid-orb" style={{ bottom: '-10%', right: '5%', width: '40vw', height: '40vw', background: 'var(--accent-green)', opacity: 0.15, animationDelay: '-5s' }}></div>
      <div className="liquid-orb" style={{ top: '30%', right: '10%', width: '30vw', height: '30vw', background: 'var(--accent-cyan)', opacity: 0.1, animationDelay: '-10s' }}></div>

      {currentUser && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} toggleTheme={toggleTheme} theme={theme} role={currentUser.role} onLogout={handleLogout} />}

      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {currentUser && <TopHeader managerName={currentUser.name} storeName={currentUser.storeName} onLogout={handleLogout} toggleTheme={toggleTheme} theme={theme} role={currentUser.role} onCloseRegister={handleCloseRegister} setActiveTab={setActiveTab} currentUser={currentUser} />}
        
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser ? currentUser.id + activeTab : 'auth'}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{ width: '100%', height: '100%' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
