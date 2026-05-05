import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Phone, CalendarClock, Plus, Trash2, Edit } from 'lucide-react';
import { useNotification } from './NotificationSystem';
import ConfirmModal from './ConfirmModal';

const SuppliersModule = ({ suppliers, onAddSupplier, onDeleteSupplier, inventory, onUpdateInventory, currentUser }) => {
  const { showNotification } = useNotification();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', contractId: '' });
  
  // Delivery Schedule State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const sendSupplierNotification = async (message) => {
    const BOT_TOKEN = '8707829956:AAE2OoFPXH8LJSRTa7MxWmzqHuCnm29_jyQ';
    const CHAT_ID = currentUser?.telegramId || '6512684824';
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });
    } catch (e) {}
  };

  const handleAddSupplier = (e) => {
    e.preventDefault();
    onAddSupplier(formData);
    sendSupplierNotification(`🏢 *Yangi Ta'minotchi Qo'shildi!*\n\nNom: ${formData.name}\nTel: ${formData.phone}\nShartnoma: #${formData.contractId}`);
    showNotification("Ta'minotchi qo'shildi!", 'success');
    setFormData({ name: '', phone: '', contractId: '' });
    setShowAdd(false);
  };

  const handleSetDelivery = (e) => {
    e.preventDefault();
    if (selectedProduct && deliveryTime) {
      const product = inventory.find(i => i.id.toString() === selectedProduct.toString());
      onUpdateInventory(selectedProduct, { deliverySchedule: deliveryTime });
      sendSupplierNotification(`🚚 *Yangi Yuk Kelishi!*\n\nMahsulot: ${product?.name}\nVaqt: ${deliveryTime}`);
      setSelectedProduct('');
      setDeliveryTime('');
      showNotification("Yuk kelish vaqti belgilandi!", 'success');
    }
  };

  const confirmDelete = (id) => {
    setSupplierToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    onDeleteSupplier(supplierToDelete);
    setIsConfirmOpen(false);
    showNotification("Ta'minotchi o'chirildi!", 'error');
  };

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '1.8rem' }}>Kompaniyalar va Shartnomalar</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Ta'minotchilar va kelajakdagi yuklar jadvali</p>
        </div>
        <button className="btn-pos" onClick={() => setShowAdd(!showAdd)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Yangi Kompaniya
        </button>
      </div>

      {showAdd && (
        <motion.form 
          initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
          onSubmit={handleAddSupplier}
          className="glass-card" 
          style={{ padding: '25px', display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid var(--accent-purple)33', marginBottom: '10px' }}
        >
          <div className="search-bar" style={{ flex: 1, height: '54px' }}>
            <Building size={20} color="var(--accent-cyan)" />
            <input type="text" placeholder="Kompaniya nomi" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="search-bar" style={{ flex: 1, height: '54px' }}>
            <Phone size={20} color="var(--accent-green)" />
            <input type="text" placeholder="Telefon raqami" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="search-bar" style={{ flex: 1, height: '54px' }}>
            <Building size={20} color="var(--accent-orange)" />
            <input type="text" placeholder="Shartnoma raqami" required value={formData.contractId} onChange={e => setFormData({...formData, contractId: e.target.value})} style={{ width: '100%', height: '100%' }} />
          </div>
          <button type="submit" className="btn-pos" style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))', height: '54px', borderRadius: '22px', padding: '0 30px' }}>Qo'shish</button>
        </motion.form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <div className="glass-card" style={{ padding: '25px', border: '1px solid var(--glass-border)' }}>
          <h3 className="outfit" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building size={20} color="var(--accent-cyan)" />
            Kompaniyalar Ro'yxati
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {suppliers.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                    <Phone size={14} /> {s.phone} | Shartnoma: #{s.contractId}
                  </div>
                </div>
                <button onClick={() => confirmDelete(s.id)} style={{ background: 'transparent', border: 'none', color: '#ff5252', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {suppliers.length === 0 && <p style={{ color: 'var(--text-dim)' }}>Ta'minotchilar topilmadi.</p>}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
          <h3 className="outfit" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarClock size={20} color="var(--accent-orange)" />
            Yuk Kelish Jadvalini Belgilash
          </h3>
          <form onSubmit={handleSetDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px', display: 'block' }}>Qaysi mahsulot keladi?</label>
              <select 
                className="search-bar" 
                style={{ width: '100%', height: '45px', color: 'var(--text-main)' }}
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                required
              >
                <option value="" disabled style={{ background: 'var(--bg-deep)' }}>Tanlang...</option>
                {inventory.map(i => (
                  <option key={i.id} value={i.id} style={{ background: 'var(--bg-deep)' }}>{i.name} (Qoldiq: {i.stock})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px', display: 'block' }}>Qachon keladi? (Masalan: Ertaga 07:00 da)</label>
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Ertaga soat 07:00 atrofida..." 
                required 
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
                style={{ width: '100%', height: '45px' }} 
              />
            </div>

            <button type="submit" className="btn-pos" style={{ marginTop: 'auto', height: '50px', background: 'var(--accent-purple)' }}>
              Jadvalga kiritish
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        title="Ta'minotchini o'chirish" 
        message="Haqiqatdan ham ushbu ta'minotchini o'chirmoqchimisiz?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default SuppliersModule;
