import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, Zap, Shield, BarChart } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('nexusMessages');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', content: "Assalomu alaykum! Men SmartPOS AI assistentiman. Google Gemini orqali ishlayman. Savolingizni bering!" }
    ];
  });
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localstorage
  React.useEffect(() => {
    localStorage.setItem('nexusMessages', JSON.stringify(messages));
  }, [messages]);

  const botInfo = [
    { icon: Zap, title: "Tezkor Tahlil", desc: "Sotuvlar va abarotni soniyalar ichida hisoblaydi." },
    { icon: BarChart, title: "Bashorat", desc: "Kelajakdagi sotuvlar tendensiyasini aniqlaydi." },
    { icon: Shield, title: "Nazorat", desc: "Ombor qoldig'i va xavfsizlikni nazorat qiladi." }
  ];

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('geminiApiKey', apiKey);
    alert('API Key saqlandi! Endi bot bilan gaplashishingiz mumkin.');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      alert("Iltimos, avval Gemini API Keyni kiriting (O'ng tomondagi menyuda)!");
      return;
    }

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const aiText = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: `Xatolik yuz berdi: ${error.message || "API kalit noto'g'ri bo'lishi mumkin."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 30px 30px', flex: 1, display: 'flex', gap: '25px', overflow: 'hidden' }}>
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--accent-purple)33' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--accent-purple)08' }}>
          <div style={{ width: '45px', height: '45px', background: 'var(--accent-purple)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--accent-purple)44' }}>
            <Bot color="white" size={24} />
          </div>
          <div>
            <h2 className="outfit" style={{ fontSize: '1.1rem' }}>SmartPOS Nexus AI</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>● Online • Sun'iy Intellekt</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                  gap: '12px'
                }}
              >
                {msg.role === 'ai' && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-purple)22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} color="var(--accent-purple)" /></div>}
                <div style={{
                  maxWidth: '70%',
                  padding: '14px 18px',
                  borderRadius: msg.role === 'ai' ? '0 20px 20px 20px' : '20px 0 20px 20px',
                  background: msg.role === 'ai' ? 'rgba(255,255,255,0.03)' : 'var(--accent-purple)',
                  color: msg.role === 'ai' ? 'var(--text-main)' : 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  boxShadow: msg.role === 'user' ? '0 5px 15px var(--accent-purple)33' : 'none',
                  border: msg.role === 'ai' ? '1px solid var(--glass-border)' : 'none'
                }}>
                  {msg.content}
                </div>
                {msg.role === 'user' && <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="white" /></div>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSend} style={{ padding: '20px', background: 'var(--bg-deep)', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, height: '52px' }}>
            <input 
              type="text" 
              placeholder="Savolingizni yozing..." 
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-pos" style={{ width: '52px', height: '52px', padding: 0, justifyContent: 'center' }}>
            <Send size={20} />
          </button>
        </form>
      </div>

      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div className="glass-card" style={{ padding: '25px', border: '1px solid var(--accent-purple)33' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Sparkles size={20} color="var(--accent-purple)" />
            <h3 className="outfit">Bot Imkoniyatlari</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {botInfo.map((info, i) => (
              <div key={i} style={{ display: 'flex', gap: '15px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', height: 'fit-content' }}>
                  <info.icon size={18} color="var(--accent-purple)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>{info.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{info.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px', border: '1px solid var(--accent-blue)33' }}>
          <h3 className="outfit" style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Sozlamalar (API Key)</h3>
          <form onSubmit={handleSaveApiKey} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="password" 
              placeholder="Google Gemini API Key" 
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="search-bar"
              style={{ width: '100%', height: '40px' }}
            />
            <button type="submit" className="btn-pos" style={{ height: '40px', justifyContent: 'center' }}>
              Saqlash
            </button>
          </form>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '10px' }}>
            Bot to'liq ishlashi uchun Gemini API kalitini kiriting va saqlang.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, var(--accent-purple)11, var(--accent-blue)11)', border: '1px solid var(--accent-purple)33' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', textAlign: 'center', fontWeight: '500' }}>
            Nexus AI sizning biznesingizni 2 baravar samaraliroq qiladi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
