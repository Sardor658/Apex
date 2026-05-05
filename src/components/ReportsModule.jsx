import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, PieChart, Activity, ArrowUpRight, ArrowDownRight, Briefcase, Percent, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { useLanguage } from './LanguageContext';
import { useNotification } from './NotificationSystem';

const ReportsModule = ({ transactions, inventory, staff, currentUser, onDeleteTransaction }) => {
  const { t } = useLanguage();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [transToDelete, setTransToDelete] = React.useState(null);
  const { showNotification } = useNotification();
  // Moliyaviy hisob-kitoblar
  const turnover = transactions.reduce((acc, t) => acc + t.total, 0);
  
  // Sotilgan mahsulotlarning tannarxi (COGS)
  const cogs = transactions.reduce((acc, t) => {
    const transactionCost = t.items.reduce((itemAcc, item) => {
      const invItem = inventory.find(i => i.id === item.id);
      const buyPrice = invItem ? invItem.purchasePrice : (item.purchasePrice || 0);
      return itemAcc + (buyPrice * item.qty);
    }, 0);
    return acc + transactionCost;
  }, 0);

  const grossProfit = turnover - cogs;
  const totalSalaries = staff.reduce((acc, s) => acc + (Number(s.salary) || 0), 0);
  
  const taxPercent = Number(currentUser?.taxRate) || 0;
  const taxes = turnover * (taxPercent / 100);
  const netProfit = grossProfit - totalSalaries - taxes;
  const totalItemsSold = transactions.reduce((acc, t) => acc + t.items.reduce((ia, i) => ia + i.qty, 0), 0);

  const stats = [
    { label: t('turnover'), value: turnover, icon: DollarSign, color: 'var(--accent-blue)', trend: t('turnover_trend') || 'Aborot' },
    { label: t('gross_profit'), value: grossProfit, icon: TrendingUp, color: 'var(--accent-green)', trend: t('profit_trend') || 'Foyda' },
    { label: t('net_profit'), value: netProfit, icon: Activity, color: 'var(--accent-cyan)', trend: t('net_trend') || 'Sof' },
    { label: t('items_sold'), value: totalItemsSold, icon: PieChart, color: 'var(--accent-orange)', trend: t('items_trend') || t('ta') },
  ];

  const handleDeleteClick = (id) => {
    setTransToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    setIsConfirmOpen(false);
    onDeleteTransaction(transToDelete);
    showNotification(t('sale_cancelled'), 'error');
  };

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '1.8rem' }}>{t('financial_reports')}</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{t('real_time_status')}</p>
        </div>
        <button 
          onClick={() => {
            const message = `📊 *MOLIYAVIY HISOBOT* (Hozirgi Holat)\n\n🏪 Do'kon: ${currentUser?.storeName}\n💰 Aylanma: ${turnover.toLocaleString()} so'm\n📈 Yalpi foyda: ${grossProfit.toLocaleString()} so'm\n💎 Sof foyda: ${netProfit.toLocaleString()} so'm\n🛒 Sotilgan mahsulotlar: ${totalItemsSold} ta\n📅 Sana: ${new Date().toLocaleString()}`;
            const BOT_TOKEN = '8707829956:AAE2OoFPXH8LJSRTa7MxWmzqHuCnm29_jyQ';
            const CHAT_ID = currentUser?.telegramId || '6512684824';
            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
            }).then(() => showNotification(t('report_sent'), 'success'));
          }}
          className="btn-pos" 
          style={{ background: '#0088cc', gap: '8px' }}
        >
          <TrendingUp size={18} />
          {t('send_to_telegram')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card stat-card"
            style={{ border: `1px solid ${stat.color}44` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '15px 20px 0' }}>
              <div style={{ padding: '10px', background: `${stat.color}11`, borderRadius: '12px' }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <span style={{ 
                fontSize: '0.75rem', 
                color: stat.color, 
                fontWeight: '700', 
                padding: '6px 12px', 
                background: `${stat.color}15`, 
                borderRadius: '12px', 
                border: `1px solid ${stat.color}22`,
                boxShadow: `0 4px 10px ${stat.color}11`
              }}>
                {stat.trend}
              </span>
            </div>
            <div style={{ padding: '0 20px 20px', marginTop: '10px' }}>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{stat.label}</p>
              <h2 className="outfit" style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '5px', wordBreak: 'break-word' }}>
                {stat.value.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>so'm</span>
              </h2>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
        <div className="glass-card" style={{ padding: '25px', border: '1px solid var(--glass-border)' }}>
          <h3 className="outfit" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--accent-purple)" />
            {t('recent_sales')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--accent-blue)22', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={18} color="var(--accent-blue)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>#{t.id.toString().slice(-6)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(t.date).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent-green)' }}>+{t.total.toLocaleString()} so'm</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t.paymentMethod}</div>
                  </div>
                  <button onClick={() => handleDeleteClick(t.id)} style={{ background: 'transparent', border: 'none', color: '#ff5252', cursor: 'pointer', padding: '5px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px', border: '1px solid var(--glass-border)' }}>
          <h3 className="outfit" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieChart size={20} color="var(--accent-cyan)" />
            {t('profit_distribution')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: t('cogs'), val: turnover > 0 ? (cogs / turnover) * 100 : 0, color: 'var(--accent-orange)' },
              { label: t('salaries'), val: turnover > 0 ? (totalSalaries / turnover) * 100 : 0, color: 'var(--accent-purple)' },
              { label: t('net_profit'), val: turnover > 0 ? (netProfit / turnover) * 100 : 0, color: 'var(--accent-green)' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: '600' }}>{item.val.toFixed(1)}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.val}%` }}
                    style={{ height: '100%', background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '30px', padding: '15px', background: 'var(--accent-blue)11', borderRadius: '12px', border: '1px dashed var(--accent-blue)44' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', textAlign: 'center' }}>
              {t('real_time_update')}
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        title={t('cancel_sale')} 
        message={t('confirm_cancel_sale')}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default ReportsModule;
