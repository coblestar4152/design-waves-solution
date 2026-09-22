import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from '@/hooks/useAuth';
import { SiteDataProvider } from '@/hooks/useSiteData';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteDataProvider>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#12122a', color: '#f2f2fa', border: '1px solid rgba(255,255,255,0.1)' },
          }} />
        </SiteDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
