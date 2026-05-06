import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { NotificationProvider } from './components/NotificationSystem.jsx'
import { LanguageProvider } from './components/LanguageContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LanguageProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </LanguageProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
