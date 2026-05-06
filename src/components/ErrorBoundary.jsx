import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: '#080b18', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          color: 'white'
        }}>
          <div style={{ 
            maxWidth: '600px', 
            width: '100%', 
            padding: '40px', 
            background: 'rgba(18, 22, 33, 0.8)', 
            backdropFilter: 'blur(30px)',
            borderRadius: '40px',
            border: '1px solid rgba(255, 82, 82, 0.3)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '80px', height: '80px', background: 'rgba(255, 82, 82, 0.1)', 
              borderRadius: '24px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 24px'
            }}>
              <span style={{ fontSize: '40px' }}>⚠️</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>
              Dasturda kutilmagan xatolik
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px', lineHeight: '1.6' }}>
              Tizimni ishga tushirishda xatolik yuz berdi. Bu ko'pincha brauzerning WebGL texnologiyasini qo'llab-quvvatlamasligi yoki vaqtinchalik uzilishlar sababli bo'lishi mumkin.
            </p>
            
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '20px', 
              borderRadius: '20px', 
              textAlign: 'left',
              marginBottom: '30px',
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.05)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <code style={{ color: '#ff5252', display: 'block', marginBottom: '10px' }}>
                {this.state.error && this.state.error.toString()}
              </code>
              <pre style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #ff5252, #7c4dff)',
                color: 'white',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '50px',
                fontWeight: '800',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(255, 82, 82, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Sahifani yangilash
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
