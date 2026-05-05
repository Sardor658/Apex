import React, { useState, useRef } from 'react';
import { Search, Plus, Star, Trash2, Edit2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { useNotification } from './NotificationSystem';

const StaffModule = ({ staff, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', salary: '', rating: 5, skills: '', image: '' });
  const { showNotification } = useNotification();
  const fileInputRef = useRef();

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ ...member, skills: member.skills.join(', ') });
    } else {
      setEditingMember(null);
      setFormData({ name: '', role: '', salary: '', rating: 5, skills: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for localStorage
        showNotification("Rasm hajmi juda katta! (Max 1MB)", 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { 
      ...formData, 
      salary: Number(formData.salary), 
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) 
    };
    
    if (editingMember) onUpdate(editingMember.id, data);
    else onAdd(data);
    
    showNotification(editingMember ? "Xodim ma'lumotlari yangilandi!" : "Yangi xodim qo'shildi!", 'success');
    setIsModalOpen(false);
  };

  const confirmDelete = (id) => {
    setMemberToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    onDelete(memberToDelete);
    setIsConfirmOpen(false);
    showNotification("Xodim o'chirildi!", 'error');
  };

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '1.8rem' }}>Ishchilar</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Xodimlar malakasi va oyliklarini boshqarish</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} color="var(--text-dim)" />
            <input type="text" placeholder="Xodimlarni qidirish..." />
          </div>
          <button className="btn-pos" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            <span>Yangi xodim</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {staff.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ padding: '25px', position: 'relative' }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '90px', 
                height: '90px', 
                borderRadius: '24px', 
                overflow: 'hidden',
                border: '2px solid var(--accent-purple)',
                background: 'rgba(124, 77, 255, 0.1)'
              }}>
                <img 
                  src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=7c4dff&color=fff`} 
                  alt={member.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="outfit" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>{member.role}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {member.skills.map((skill, i) => (
                    <span key={i} style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: 'var(--text-dim)' }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Malakasi</p>
                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= member.rating ? 'var(--accent-orange)' : 'none'} color={s <= member.rating ? 'var(--accent-orange)' : 'var(--text-dim)'} />)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Oylik maoshi</p>
                <h4 style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{member.salary.toLocaleString()} so'm</h4>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="sidebar-item" style={{ flex: 1, justifyContent: 'center', padding: '8px' }} onClick={() => handleOpenModal(member)}>
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
              <button className="sidebar-item" style={{ flex: 1, justifyContent: 'center', padding: '8px', color: '#ff5252' }} onClick={() => confirmDelete(member.id)}>
                <Trash2 size={16} />
                <span>O'chirish</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? 'Xodimni tahrirlash' : 'Yangi xodim qo\'shish'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px' }}>Xodim rasmini tanlash (Admin fayllari)</p>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '32px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '2px dashed var(--accent-purple)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 0 20px rgba(124, 77, 255, 0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(124, 77, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              {formData.image ? (
                <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Camera size={32} color="var(--accent-purple)" />
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '4px' }}>Rasm tanlang</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Ism sharifi" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Lavozimi" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
          </div>
          <div className="search-bar">
            <input type="number" placeholder="Oylik maoshi" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Malakalari (vergul bilan ajrating)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
          </div>
          
          <button type="submit" className="btn-pos" style={{ width: '100%', justifyContent: 'center', height: '56px', marginTop: '10px', fontSize: '1rem' }}>
            <span>{editingMember ? 'Ma\'lumotlarni saqlash' : 'Xodimni qo\'shish'}</span>
          </button>

        </form>
      </Modal>

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        title="Xodimni o'chirish" 
        message="Haqiqatdan ham ushbu xodimni ishdan bo'shatmoqchimisiz?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default StaffModule;
