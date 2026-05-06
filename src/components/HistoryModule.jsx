import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Wallet, Users, ChevronRight, History } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const HistoryModule = ({ transactions, staff, currentUser }) => {
  const { t } = useLanguage();

  // Calculate daily salary based on month days
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  let totalSalaries = staff.reduce((acc, member) => acc + (Number(member.salary) || 0), 0);
  
  if (totalSalaries === 0 && currentUser) {
    totalSalaries = (Number(currentUser.employeeCount) || 0) * (Number(currentUser.avgSalary) || 0);
  }
  const dailySalary = totalSalaries / daysInMonth;

  // Group transactions by date
  const groupedData = transactions.reduce((acc, trans) => {
    const dateKey = new Date(trans.date).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        rawDate: new Date(trans.date),
        revenue: 0,
        grossProfit: 0,
        transactionCount: 0
      };
    }
    acc[dateKey].revenue += trans.total || 0;
    acc[dateKey].grossProfit += trans.totalProfit || 0;
    acc[dateKey].transactionCount += 1;
    return acc;
  }, {});

  // Convert to array and sort by date descending
  const historyArray = Object.values(groupedData).sort((a, b) => b.rawDate - a.rawDate);

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '1.8rem' }}>Kunlik Tarix</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Har bir kunlik savdo va sof foyda statistikasi</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Jami kunlar: </span>
          <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>{historyArray.length}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {historyArray.map((day, index) => {
          const netProfit = day.grossProfit - dailySalary;
          const isToday = day.date === new Date().toLocaleDateString();

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card"
              style={{ 
                padding: '20px', 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.5fr',
                alignItems: 'center',
                gap: '20px',
                borderLeft: isToday ? '4px solid var(--accent-green)' : '1px solid var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  width: '45px', height: '45px', borderRadius: '12px', 
                  background: isToday ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Calendar size={20} color={isToday ? 'var(--accent-green)' : 'var(--text-dim)'} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{day.date}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isToday ? 'Bugun' : 'Yakunlangan kun'}</p>
                </div>
              </div>

              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tushum</p>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{day.revenue.toLocaleString()} so'm</p>
              </div>

              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Yalpi Foyda</p>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: 'var(--accent-blue)' }}>{day.grossProfit.toLocaleString()} so'm</p>
              </div>

              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Xarajat (Maosh)</p>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#ff5252' }}>-{Math.round(dailySalary).toLocaleString()} so'm</p>
              </div>

              <div style={{ 
                background: 'rgba(255,255,255,0.03)', padding: '10px 15px', borderRadius: '12px',
                border: '1px solid var(--glass-border)', textAlign: 'right'
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Sof Foyda</p>
                <p style={{ 
                  margin: 0, fontWeight: '800', fontSize: '1.1rem', 
                  color: netProfit >= 0 ? 'var(--accent-green)' : '#ff5252' 
                }}>
                  {Math.round(netProfit).toLocaleString()} so'm
                </p>
              </div>
            </motion.div>
          );
        })}

        {historyArray.length === 0 && (
          <div style={{ 
            textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.02)', 
            borderRadius: '30px', border: '2px dashed var(--glass-border)' 
          }}>
            <History size={60} color="var(--text-dim)" style={{ marginBottom: '20px', opacity: 0.3 }} />
            <h3 style={{ color: 'var(--text-dim)' }}>Hozircha tarix mavjud emas</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Savdo amalga oshirilgandan so'ng kunlik ma'lumotlar shu yerda to'planadi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModule;
