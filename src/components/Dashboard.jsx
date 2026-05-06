import React, { useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  ArrowUpRight, ArrowDownRight, Package, 
  Clock, Plus, BarChart3, AlertTriangle, ChevronRight
} from 'lucide-react';

// Custom SVG Wave for Stat Cards
const WaveBackground = ({ color }) => (
  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', overflow: 'hidden', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px' }}>
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
      <path 
        d="M0 30 Q100 0 200 30 T400 30 V60 H0 Z" 
        fill={color} 
        opacity="0.2"
      >
        <animate attributeName="d" dur="5s" repeatCount="indefinite" values="M0 30 Q100 0 200 30 T400 30 V60 H0 Z; M0 30 Q100 60 200 30 T400 30 V60 H0 Z; M0 30 Q100 0 200 30 T400 30 V60 H0 Z" />
      </path>
    </svg>
  </div>
);

// Custom Line Chart - Premium Curved Neon Style
const LineChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const height = 120;
  const width = 300;
  const padding = 20;

  // Function to create smooth curves between points
  const createPath = () => {
    if (data.length === 0) return "";
    const pts = data.map((d, i) => ({
      x: (i * (width - padding * 2)) / (data.length - 1) + padding,
      y: height - (d.value / max) * (height - padding * 2) - padding
    }));

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${cp1x} ${pts[i].y}, ${cp1x} ${pts[i+1].y}, ${pts[i+1].x} ${pts[i+1].y}`;
    }
    return d;
  };

  const pathD = createPath();
  const fillD = `${pathD} L ${width - padding} ${height} L ${padding} ${height} Z`;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3].map(i => (
            <line 
              key={i} 
              x1={padding} y1={padding + (i * (height - padding * 2) / 3)} 
              x2={width - padding} y2={padding + (i * (height - padding * 2) / 3)} 
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" 
            />
          ))}

          {/* Area Fill */}
          <motion.path 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            d={fillD} 
            fill="url(#neonGrad)" 
          />

          {/* Glowing Line */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={pathD} 
            fill="none" 
            stroke="var(--accent-blue)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            filter="url(#glow)"
          />

          {/* Data Points */}
          {data.map((d, i) => {
            const x = (i * (width - padding * 2)) / (data.length - 1) + padding;
            const y = height - (d.value / max) * (height - padding * 2) - padding;
            return (
              <g key={i}>
                <motion.circle 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  cx={x} cy={y} r="6" 
                  fill="var(--bg-deep)" 
                  stroke="var(--accent-cyan)" 
                  strokeWidth="2" 
                />
                <motion.circle 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ delay: 1.5 + i * 0.1, duration: 2, repeat: Infinity }}
                  cx={x} cy={y} r="10" 
                  fill="var(--accent-cyan)" 
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ 
            fontSize: '0.7rem', 
            color: 'var(--text-dim)', 
            fontWeight: '600',
            textAlign: 'center', 
            width: '50px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            background: 'rgba(255,255,255,0.03)',
            padding: '4px 8px',
            borderRadius: '8px'
          }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Donut Chart
const DonutChart = ({ segments }) => {
  let currentOffset = 0;
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
      {segments.map((s, i) => {
        const strokeDasharray = `${s.percent} ${100 - s.percent}`;
        const strokeDashoffset = -currentOffset;
        currentOffset += s.percent;
        return (
          <circle 
            key={i} 
            cx="50" cy="50" r="35" 
            fill="none" 
            stroke={s.color} 
            strokeWidth="15" 
            strokeDasharray={strokeDasharray} 
            strokeDashoffset={strokeDashoffset} 
            transform="rotate(-90 50 50)"
            pathLength="100"
          />
        );
      })}
      <circle cx="50" cy="50" r="20" fill="white" />
    </svg>
  );
};

const Dashboard = ({ stats, inventory, transactions }) => {
  const { t } = useLanguage();
  const lowStock = useMemo(() => inventory?.filter(i => i.stock < 5) || [], [inventory]);
  
  // Rankings from props
  const rankings = stats.rankings || [];
  
  // Find current store's rank
  // Assuming we don't have current user ID here, we can pass it from App or find by name
  // But for now, let's just display the list.

  const salesByProduct = useMemo(() => {
    const productSales = {};
    transactions.forEach(tr => {
      tr.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = 0;
        }
        productSales[item.name] += item.qty;
      });
    });
    
    return Object.entries(productSales)
      .map(([name, qty]) => ({ label: name, value: qty }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7 products
  }, [transactions]);

  const chartData = salesByProduct.length > 0 ? salesByProduct : [
    { label: 'Mahsulot A', value: 12 },
    { label: 'Mahsulot B', value: 18 },
    { label: 'Mahsulot C', value: 8 },
    { label: 'Mahsulot D', value: 15 }
  ];

  const statCards = [
    { 
      label: 'Oylik Savdo',
      value: `${stats.monthlyRevenue.toLocaleString()} so'm`, 
      subtitle: 'Shu oydagi jami tushum',
      color: 'var(--accent-orange)', 
      hasWave: true 
    },
    { 
      label: 'Oylik Foyda',
      value: `${stats.monthlyProfit.toLocaleString()} so'm`, 
      subtitle: 'Maoshlar ayirilmagan yalpi foyda',
      color: 'var(--accent-blue)', 
      hasWave: true 
    },
    { 
      label: 'Bugungi Sof Foyda',
      value: `${stats.dailyProfit.toLocaleString()} so'm`, 
      subtitle: `Bugungi foyda - ${(stats.totalSalaries / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()).toLocaleString(undefined, {maximumFractionDigits: 0})} so'm (1 kun maosh)`,
      color: 'var(--accent-green)', 
      hasWave: true 
    },
    { 
      label: 'Oylik Sof Foyda',
      value: `${stats.monthlyNetProfit.toLocaleString()} so'm`, 
      subtitle: `Oylik foyda - ${(stats.totalSalaries / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() * new Date().getDate()).toLocaleString(undefined, {maximumFractionDigits: 0})} so'm (${new Date().getDate()} kunlik maosh)`,
      color: 'var(--accent-purple)', 
      hasWave: true 
    },
  ];

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 'min-content' }}>
        
        {/* Top Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {statCards.map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
              style={{ 
                padding: '20px', 
                position: 'relative',
                minHeight: '130px',
                border: `1px solid ${card.color}22`,
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', zIndex: 2 }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: '600' }}>{card.label}</p>
                <h2 className="outfit" style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '5px' }}>{card.value}</h2>
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: card.alert ? 'var(--accent-orange)' : 'var(--text-dim)',
                  fontWeight: card.alert ? '700' : '400',
                  marginTop: '4px'
                }}>
                  {card.subtitle}
                </p>
              </div>
              {card.icon && (
                <div style={{ position: 'absolute', right: '15px', top: '15px', opacity: 0.2 }}>
                  <card.icon size={40} color={card.color} />
                </div>
              )}
              {card.hasWave && <WaveBackground color={card.color} />}
            </motion.div>
          ))}
        </div>

        {/* Middle Row: New Sale & Store Rankings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            
            <div className="glass-card" style={{ padding: '25px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="outfit" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShoppingBag size={20} color="var(--accent-blue)" />
                  Eng ko'p sotilgan mahsulotlar
                </h3>
              </div>
              <div style={{ height: '220px' }}>
                <LineChart data={chartData} />
              </div>
            </div>
          </div>

          {/* Store Rankings Leaderboard */}
          <div className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
            <h3 className="outfit" style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} color="var(--accent-purple)" />
              {t('store_ranking')} ({t('profit_leaderboard')})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '300px' }}>
              {rankings.map((rank, idx) => (
                <div key={rank.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 18px', 
                  background: idx === 0 ? 'rgba(124, 77, 255, 0.1)' : 'rgba(255,255,255,0.02)', 
                  borderRadius: '15px',
                  border: idx === 0 ? '1px solid var(--accent-purple)55' : '1px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '30px', height: '30px', borderRadius: '50%', 
                      background: idx === 0 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: '800'
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{rank.storeName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{rank.orders} {t('orders')}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', color: 'var(--accent-green)' }}>{rank.totalProfit.toLocaleString()} so'm</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t('total_profit')}</div>
                  </div>
                  {idx === 0 && <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '40px', height: '40px', background: 'var(--accent-purple)', opacity: 0.1, borderRadius: '50%' }}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Oxirgi Faoliyatlar */}
          <div className="glass-card" style={{ padding: '25px' }}>
            <h3 className="outfit" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{t('latest_activities')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { type: 'login', text: t('admin_login'), color: 'var(--accent-green)', icon: Clock },
                ...transactions.slice(0, 4).map(tr => ({
                  type: 'sale',
                  text: `${t('sale_completed')} - #${tr.id.toString().slice(-4)}`,
                  color: 'var(--accent-blue)',
                  icon: ShoppingBag
                })),
                ...inventory.slice(0, 2).map(inv => ({
                  type: 'product',
                  text: `${t('new_product_added')} - "${inv.name}"`,
                  color: 'var(--accent-orange)',
                  icon: Package
                }))
              ].slice(0, 6).map((act, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${act.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <act.icon size={16} color={act.color} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{act.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             {/* Ombor Holati */}
            <div className="glass-card" style={{ padding: '25px' }}>
              <h3 className="outfit" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{t('inventory_status')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { label: t('in_stock'), value: `${inventory.length} ${t('ta')}`, color: 'var(--accent-blue)', icon: Package },
                  { label: t('low_stock_warning'), value: `${lowStock.length} ${t('ta')}`, color: 'var(--accent-orange)', icon: AlertTriangle },
                  { label: t('total_value'), value: `${inventory.reduce((acc, i) => acc + ((Number(i.sellingPrice) || 0) * (Number(i.stock) || 0)), 0).toLocaleString()} so'm`, color: 'var(--accent-green)', icon: DollarSign },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', background: `${item.color}22`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <item.icon size={16} color={item.color} />
                      </div>
                      <span style={{ fontSize: '0.9rem' }}>{item.label}:</span>
                    </div>
                    <span style={{ fontWeight: '700' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savdo Hisoboti */}
            <div className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
              <h3 className="outfit" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Savdo Hisoboti</h3>
              
              {(() => {
                const totalQty = salesByProduct.reduce((acc, p) => acc + p.value, 0);
                const segments = salesByProduct.slice(0, 3).map((p, i) => ({
                  label: p.label,
                  percent: Math.round((p.value / (totalQty || 1)) * 100),
                  color: i === 0 ? 'var(--accent-blue)' : i === 1 ? 'var(--accent-green)' : 'var(--accent-orange)'
                }));

                // Add "Others" if needed
                const top3Sum = segments.reduce((acc, s) => acc + s.percent, 0);
                if (top3Sum < 100 && salesByProduct.length > 3) {
                  segments.push({
                    label: "Boshqalar",
                    percent: 100 - top3Sum,
                    color: 'var(--accent-purple)'
                  });
                }

                return (
                  <>
                    <div style={{ height: '140px', position: 'relative', marginBottom: '15px' }}>
                      <DonutChart segments={segments.length > 0 ? segments : [{ percent: 100, color: 'rgba(255,255,255,0.05)' }]} />
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Jami</div>
                        <div style={{ fontWeight: '800' }}>100%</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {segments.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }}></div>
                            <span style={{ color: 'var(--text-dim)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                          </div>
                          <span style={{ fontWeight: '700' }}>{s.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

