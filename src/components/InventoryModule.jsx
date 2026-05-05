import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Search, Plus, Edit2, Trash2, Lock, Camera, Package, Box, Barcode as BarcodeIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import Barcode from 'react-barcode';
import ConfirmModal from './ConfirmModal';
import { useNotification } from './NotificationSystem';

const InventoryModule = ({ inventory, isAuthorized, onAdd, onUpdate, onDelete, currentUser }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [authPassword, setAuthPassword] = useState('');
  const [isPrixodModalOpen, setIsPrixodModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [prixodItem, setPrixodItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', category: '', stock: '', purchasePrice: '', sellingPrice: '', image: '', barcode: '', unit: 'dona' });
  const [prixodData, setPrixodData] = useState({ quantity: '', purchasePrice: '' });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [categories, setCategories] = useState(() => {
    const saved = inventory.map(i => i.category);
    return [...new Set(saved), t('category_food'), t('category_drinks'), t('category_electronics')];
  });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { showNotification } = useNotification();
  const fileInputRef = useRef();

  const handleOpenModal = (item = null) => {
    if (currentUser.role !== 'boss') {
      setPendingAction(() => () => openActualModal(item));
      setIsAuthModalOpen(true);
      return;
    }
    openActualModal(item);
  };

  const openActualModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item, barcode: item.barcode || '', unit: item.unit || t('unit_pcs') });
    } else {
      setEditingItem(null);
      setFormData({ name: '', sku: '', category: '', stock: '', purchasePrice: '', sellingPrice: '', image: '', barcode: '', unit: t('unit_pcs') });
    }
    setIsModalOpen(true);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authPassword === currentUser.managerPassword || authPassword === currentUser.password) {
      setIsAuthModalOpen(false);
      setAuthPassword('');
      if (pendingAction) pendingAction();
    } else {
      showNotification("Parol noto'g'ri!", 'error');
    }
  };

  const handleOpenPrixodModal = (item) => {
    setPrixodItem(item);
    setPrixodData({ quantity: '', purchasePrice: item.purchasePrice });
    setIsPrixodModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { 
      ...formData, 
      stock: Number(formData.stock), 
      purchasePrice: Number(formData.purchasePrice), 
      sellingPrice: Number(formData.sellingPrice),
      barcode: formData.barcode || formData.sku // Fallback to SKU if no barcode
    };
    
    if (editingItem) onUpdate(editingItem.id, data);
    else onAdd(data);
    
    setIsModalOpen(false);
  };

  const handlePrixodSubmit = (e) => {
    e.preventDefault();
    const newStock = Number(prixodItem.stock) + Number(prixodData.quantity);
    onUpdate(prixodItem.id, { 
      ...prixodItem, 
      stock: newStock, 
      purchasePrice: Number(prixodData.purchasePrice) 
    });
    showNotification(`${prixodItem.name} uchun buyurtma qabul qilindi!`, 'success');
    setIsPrixodModalOpen(false);
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    setIsConfirmOpen(false);
    onDelete(itemToDelete);
    setItemToDelete(null);
    showNotification("Mahsulot o'chirildi!", 'error');
  };

  const generateBarcode = () => {
    const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setFormData({ ...formData, barcode: randomBarcode });
  };

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '1.8rem' }}>Ombor</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Mahsulotlar va qoldiq nazorati</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} color="var(--text-dim)" />
            <input type="text" placeholder="Qidirish..." />
          </div>

        </div>
      </div>

      <div className="glass-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-purple)' }}>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1, borderBottom: '2px solid var(--glass-border)' }}>
                <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Mahsulot / Shtrix-kod</th>
                <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Kategoriya</th>
                <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Qoldiq</th>
                <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Prixod narxi</th>
                <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Sotish narxi</th>
                <th style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.3s' }}>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-glass)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.image ? <img src={item.image} style={{ width: '28px', height: '28px', objectFit: 'contain' }} /> : <Box size={20} color="var(--text-dim)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                          {item.name} 
                          {item.deliverySchedule && <span style={{ marginLeft: '8px', fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,152,0,0.1)', color: 'var(--accent-orange)', borderRadius: '4px' }}>Keladi: {item.deliverySchedule}</span>}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BarcodeIcon size={12} />
                          {item.barcode || item.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', background: 'rgba(41, 121, 255, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: '600', color: item.stock < 10 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
                      {item.stock} {item.unit || 'dona'}
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    {!isAuthorized ? <Lock size={14} color="var(--accent-purple)" /> : <span>{item.purchasePrice.toLocaleString()} so'm</span>}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: '700' }}>{item.sellingPrice.toLocaleString()} so'm / {item.unit || 'dona'}</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="sidebar-item" style={{ padding: '8px', color: 'var(--accent-green)' }} onClick={() => handleOpenPrixodModal(item)} title="Buyurtma berish">
                        <TrendingUp size={16} />
                      </button>
                      <button className="sidebar-item" style={{ padding: '8px' }} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="sidebar-item" style={{ padding: '8px', color: '#ff5252' }} onClick={() => confirmDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        title="Mahsulotni o'chirish" 
        message="Haqiqatdan ham ushbu mahsulotni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
            <div style={{ textAlign: 'center' }}>
              <label>Rasm</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                style={{ 
                  width: '100px', height: '100px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', 
                  border: '2px dashed var(--accent-purple)', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', cursor: 'pointer', overflow: 'hidden'
                }}
              >
                {formData.image ? <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Camera size={24} color="var(--accent-purple)" />}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
            </div>
            {formData.barcode && (
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 'bold', marginBottom: '8px' }}>Generatsiya qilingan Kod</label>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  style={{ 
                    background: 'white', padding: '10px', borderRadius: '12px',
                    boxShadow: '0 15px 35px rgba(0, 230, 118, 0.4), inset 0 0 0 2px rgba(0, 230, 118, 0.5)',
                    transformStyle: 'preserve-3d', perspective: '1000px',
                    position: 'relative'
                  }}
                >
                  <Barcode value={formData.barcode} width={1.5} height={40} fontSize={12} background="transparent" />
                  <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '80%', height: '10px', background: 'var(--accent-green)', filter: 'blur(15px)', zIndex: -1 }}></div>
                </motion.div>
              </div>
            )}
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Mahsulot nomi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <input type="text" placeholder="Shtrix-kod / SKU" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} required />
            </div>
            <button type="button" onClick={generateBarcode} className="btn-pos" style={{ padding: '0 15px' }}>
              <BarcodeIcon size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="search-bar" style={{ flex: 2 }}>
              {isNewCategory ? (
                <input 
                  type="text" 
                  placeholder="Yangi kategoriya nomi" 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  onBlur={() => { if(!formData.category) setIsNewCategory(false) }}
                  autoFocus
                  required 
                />
              ) : (
                <select 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none' }}
                  value={formData.category}
                  onChange={e => {
                    if (e.target.value === 'NEW') setIsNewCategory(true);
                    else setFormData({...formData, category: e.target.value});
                  }}
                  required
                >
                  <option value="" disabled style={{ background: 'var(--bg-deep)' }}>Kategoriyani tanlang</option>
                  {categories.map(c => <option key={c} value={c} style={{ background: 'var(--bg-deep)' }}>{c}</option>)}
                  <option value="NEW" style={{ background: 'var(--bg-deep)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>+ Yangi kategoriya</option>
                </select>
              )}
            </div>
            <div className="search-bar" style={{ flex: 1 }}>
              <select 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none' }}
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
              >
                <option value="dona" style={{ background: 'var(--bg-deep)' }}>Dona</option>
                <option value="kg" style={{ background: 'var(--bg-deep)' }}>Kilogramm (KG)</option>
                <option value="litr" style={{ background: 'var(--bg-deep)' }}>Litr</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="search-bar"><input type="number" placeholder="Ombor qoldig'i" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required /></div>
            <div className="search-bar"><input type="number" placeholder="Sotish narxi" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} required /></div>
          </div>

          <div className="search-bar">
            <input type="number" placeholder="Asl narxi (Prixod)" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} required />
          </div>
          
          <button type="submit" className="btn-pos" style={{ width: '100%', height: '52px', justifyContent: 'center', marginTop: '10px' }}>
            <span>{editingItem ? 'Saqlash' : 'Qo\'shish'}</span>
          </button>
        </form>
      </Modal>

      {/* Buyurtma Modal */}
      <Modal isOpen={isPrixodModalOpen} onClose={() => setIsPrixodModalOpen(false)} title="Mahsulot Buyurtmasi">
        <form onSubmit={handlePrixodSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(124, 77, 255, 0.05)', borderRadius: '12px' }}>
            <div style={{ width: '50px', height: '50px', background: 'var(--bg-card)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {prixodItem?.image ? <img src={prixodItem.image} style={{ width: '35px' }} /> : <Package size={24} />}
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{prixodItem?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Hozirgi qoldiq: {prixodItem?.stock} ta</div>
            </div>
          </div>

          <label>Kelgan miqdor (Soni)</label>
          <div className="search-bar">
            <input type="number" placeholder="0" value={prixodData.quantity} onChange={e => setPrixodData({...prixodData, quantity: e.target.value})} required />
          </div>

          <label>Kelish narxi (Dona uchun)</label>
          <div className="search-bar">
            <input type="number" placeholder="Narxi" value={prixodData.purchasePrice} onChange={e => setPrixodData({...prixodData, purchasePrice: e.target.value})} required />
          </div>

          <button type="submit" className="btn-pos" style={{ width: '100%', height: '52px', justifyContent: 'center', marginTop: '10px' }}>
            <TrendingUp size={18} />
            <span>Buyurtmani tasdiqlash</span>
          </button>
        </form>
      </Modal>

      {/* Auth Modal for Manager Password */}
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} title="Manager ruxsati">
        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Ushbu amalni bajarish uchun manager parolini kiriting.</p>
          <div className="search-bar">
            <Lock size={18} color="var(--accent-purple)" />
            <input 
              type="password" 
              placeholder="Parolni kiriting" 
              value={authPassword} 
              onChange={e => setAuthPassword(e.target.value)} 
              autoFocus 
              required 
            />
          </div>
          <button type="submit" className="btn-pos" style={{ width: '100%', height: '52px', justifyContent: 'center' }}>
            <span>Tasdiqlash</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryModule;
