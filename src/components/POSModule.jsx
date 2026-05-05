import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Trash2,
  X,
  Plus,
  Minus,
  Calculator,
  ScanLine,
  CheckCircle2,
  ChevronRight,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronLeft
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useNotification } from './NotificationSystem';

const POSModule = ({ inventory, onTransaction }) => {
  const { t } = useLanguage();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('naqd');
  const [selectedCategory, setSelectedCategory] = useState('Barcha');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeWeightItem, setActiveWeightItem] = useState(null);
  const [weightValue, setWeightValue] = useState(250);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const { showNotification } = useNotification();

  const [lastKeyTime, setLastKeyTime] = useState(Date.now());
  const [barcodeBuffer, setBarcodeBuffer] = useState('');

  const itemsPerPage = 12;

  // Hardware Scanner Listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      const currentTime = Date.now();
      if (currentTime - lastKeyTime > 100) {
        setBarcodeBuffer('');
      }

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) {
          let product = inventory.find(item => item.barcode === barcodeBuffer);
          let weighedQty = 1;

          // EAN-13 Weighed Barcode Logic (starts with 20, 13 digits)
          if (!product && barcodeBuffer.length === 13 && barcodeBuffer.startsWith('20')) {
            const itemCode = barcodeBuffer.substring(2, 7); // 5 digits item code
            const weightGrams = parseInt(barcodeBuffer.substring(7, 12), 10); // 5 digits weight in grams
            product = inventory.find(item => item.barcode === itemCode || item.sku === itemCode);
            if (product && product.unit === 'kg') {
              weighedQty = weightGrams / 1000;
            } else {
              product = null;
            }
          }

          if (product) addToCart(product, weighedQty);
          setBarcodeBuffer('');
        }
      } else {
        setBarcodeBuffer(prev => prev + e.key);
      }
      setLastKeyTime(currentTime);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [barcodeBuffer, lastKeyTime, inventory]);

  // Categories from inventory
  const categories = useMemo(() => {
    const cats = ['Barcha', ...new Set(inventory.map(item => item.category || 'Boshqa'))];
    return cats;
  }, [inventory]);

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.barcode?.includes(searchTerm);
      const matchesCategory = selectedCategory === 'Barcha' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const addToCart = (product, weighedQty = 1) => {
    if (product.stock <= 0) {
      showNotification("Mahsulot omborda qolmagan!", 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty + weighedQty > product.stock) {
          showNotification("Omborda yetarli mahsulot yo'q!", 'warning');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + weighedQty } : item);
      }
      return [...prev, { ...product, qty: weighedQty }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        if (newQty > item.stock && delta > 0) return item;
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, curr) => acc + (curr.sellingPrice * curr.qty), 0);
  const tax = subtotal * 0.12;
  const discount = (subtotal * discountPercent) / 100;
  const total = subtotal + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.trim().toLowerCase() === 'salom123') {
      setDiscountPercent(15);
      showNotification("15% chegirma qo'llanildi!", 'success');
    } else {
      setDiscountPercent(0);
      showNotification("Noto'g'ri promo kod", 'error');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsConfirmOpen(true);
  };

  const confirmCheckout = () => {
    setIsConfirmOpen(false);
    onTransaction(cart, paymentMethod);
    setCart([]);
    setPaymentMethod('naqd');
    setPromoCode('');
    setDiscountPercent(0);
    showNotification("Xarid muvaffaqiyatli yakunlandi!", 'success');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      background: 'transparent', 
      margin: '-20px 0', 
      borderRadius: '28px',
      overflow: 'hidden',
      color: 'var(--text-main)'
    }}>
      {/* Left side: Products */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '25px', overflow: 'hidden' }}>
        
        {/* Header: Search & Categories */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ 
              flex: 1, 
              height: '56px', 
              background: 'var(--bg-card)', 
              borderRadius: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 20px',
              boxShadow: 'var(--glass-shadow)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'var(--glass-blur)'
            }}>
              <Search size={20} color="var(--text-dim)" />
              <input 
                type="text" 
                placeholder="Mahsulot nomi yoki shtrix-kod..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  width: '100%', 
                  marginLeft: '12px', 
                  fontSize: '0.95rem',
                  color: 'var(--text-main)',
                  background: 'transparent'
                }}
              />
              <ScanLine size={20} color="var(--accent-purple)" style={{ cursor: 'pointer', marginLeft: '10px' }} />
            </div>
            <button style={{ 
              width: '56px', 
              height: '56px', 
              background: 'var(--accent-purple)', 
              borderRadius: '18px', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 10px 20px -5px rgba(124, 77, 255, 0.4)'
            }}>
              <Plus size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'transparent' : 'var(--glass-border)',
                  background: selectedCategory === cat ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: '0.2s',
                  boxShadow: selectedCategory === cat ? '0 8px 15px -4px rgba(124, 77, 255, 0.4)' : 'none',
                  backdropFilter: 'var(--glass-blur)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '20px', 
          overflowY: 'auto',
          paddingBottom: '20px'
        }}>
          {paginatedItems.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5, borderColor: 'var(--accent-purple)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.unit === 'kg' || item.unit === 'litr') {
                  setActiveWeightItem(item);
                } else {
                  addToCart(item);
                }
              }}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '15px',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'var(--glass-blur)'
              }}
            >
              <div style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: 'var(--accent-green)', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '0.7rem', 
                fontWeight: '700' 
              }}>
                {item.stock} {item.unit || 'dona'}
              </div>
              <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '15px 0' }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <Calculator size={48} color="var(--text-dim)" />
                )}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</h4>
                <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.category || 'Boshqa'}</p>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
                  {item.sellingPrice.toLocaleString()} so'm
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              style={{ padding: '8px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'white', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1 }}
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px', border: '1px solid',
                  borderColor: currentPage === i + 1 ? 'transparent' : 'var(--glass-border)',
                  background: currentPage === i + 1 ? 'var(--accent-purple)' : 'var(--bg-card)',
                  color: 'white',
                  fontWeight: '700', cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              style={{ padding: '8px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'white', cursor: 'pointer', opacity: currentPage === totalPages ? 0.3 : 1 }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Right side: Cart */}
      <div style={{ 
        width: '450px', 
        background: 'var(--bg-card)', 
        display: 'flex', 
        flexDirection: 'column', 
        borderLeft: '1px solid var(--glass-border)',
        padding: '25px',
        backdropFilter: 'var(--glass-blur)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 className="outfit" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Savatcha <span style={{ color: 'white', background: 'var(--accent-purple)', padding: '2px 10px', borderRadius: '50%', fontSize: '1rem', marginLeft: '5px' }}>{cart.length}</span>
          </h2>
          <button 
            onClick={() => setCart([])}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          <AnimatePresence>
            {cart.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px 0', 
                  borderBottom: '1px solid var(--glass-border)' 
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)' }}>
                  <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</h5>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.sellingPrice.toLocaleString()} so'm</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '20px' }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ border: 'none', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex' }}><Minus size={14} /></button>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', minWidth: '15px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ border: 'none', background: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex' }}><Plus size={14} /></button>
                </div>
                <div style={{ width: '80px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {(item.sellingPrice * item.qty).toLocaleString()} so'm
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: 'rgba(255, 82, 82, 0.5)', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.length === 0 && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              <ShoppingCart size={48} style={{ marginBottom: '10px', opacity: 0.2 }} />
              <p style={{ fontSize: '0.9rem' }}>Savatcha bo'sh</p>
            </div>
          )}
        </div>

        {/* Footer: Summary & Actions */}
        <div style={{ borderTop: '2px solid var(--glass-border)', paddingTop: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Chegirma yoki promo kod" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
              style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', color: 'var(--text-main)' }}
            />
            <button 
              onClick={applyPromoCode}
              style={{ border: 'none', background: 'rgba(124, 77, 255, 0.2)', color: 'var(--accent-purple)', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
            >
              Qo'llash
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              <span>Oraliq summa</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{subtotal.toLocaleString()} so'm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              <span>Chegirma {discountPercent > 0 && `(${discountPercent}%)`}</span>
              <span style={{ fontWeight: '600', color: 'var(--accent-green)' }}>-{discount.toLocaleString()} so'm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              <span>Soliq (12%)</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{tax.toLocaleString()} so'm</span>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(124, 77, 255, 0.1)', 
            padding: '15px 20px', 
            borderRadius: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px',
            border: '1px solid var(--glass-border)'
          }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-dim)' }}>Umumiy summa</span>
            <span className="outfit" style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main)' }}>{total.toLocaleString()} so'm</span>
          </div>

          {/* Payment Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '25px' }}>
            {[
              { id: 'naqd', label: 'Naqd', icon: Banknote },
              { id: 'plastik', label: 'Plastik', icon: CreditCard },
              { id: 'uzcard', label: 'UzCard', icon: Smartphone },
              { id: 'humo', label: 'HUMO', icon: Smartphone },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{
                  height: '70px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: paymentMethod === method.id ? 'var(--accent-purple)' : 'var(--glass-border)',
                  background: paymentMethod === method.id ? 'rgba(124, 77, 255, 0.1)' : 'var(--bg-card)',
                  color: paymentMethod === method.id ? 'white' : 'var(--text-dim)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: paymentMethod === method.id ? '0 10px 15px -3px rgba(124, 77, 255, 0.1)' : 'none'
                }}
              >
                <method.icon size={20} />
                <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{method.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{ 
              width: '100%', 
              height: '64px', 
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 15px 30px -10px rgba(41, 121, 255, 0.3)',
              opacity: cart.length === 0 ? 0.6 : 1
            }}
          >
            To'lov qilish <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="To'lovni tasdiqlash"
        message={`Jami summa: ${total.toLocaleString()} so'm. Davom etamizmi?`}
        onConfirm={confirmCheckout}
        onCancel={() => setIsConfirmOpen(false)}
      />

      <AnimatePresence>
        {activeWeightItem && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
             <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--bg-deep)', width: '400px', padding: '30px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid var(--glass-border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="outfit" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>Vazn kiritish</h3>
                <button onClick={() => setActiveWeightItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '10px' }}>{activeWeightItem.name}</div>
                <div className="outfit" style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-purple)' }}>{weightValue} g</div>
              </div>

              <input 
                type="range" min="50" max="5000" step="50" value={weightValue}
                onChange={(e) => setWeightValue(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)', marginBottom: '30px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '25px', border: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-dim)' }}>Summa:</span>
                <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>{((activeWeightItem.sellingPrice * weightValue) / 1000).toLocaleString()} so'm</span>
              </div>

              <button 
                onClick={() => { addToCart(activeWeightItem, weightValue/1000); setActiveWeightItem(null); }}
                style={{ width: '100%', height: '56px', background: 'var(--accent-purple)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer' }}
              >
                Savatchaga qo'shish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSModule;
