import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// PWA: register service worker (auto-updates when a new build is deployed)
import { registerSW } from 'virtual:pwa-register';
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-update on next navigation; no prompt needed for this app
    console.log('[PWA] New version available — will activate on next load.');
  },
  onOfflineReady() {
    console.log('[PWA] App ready to work offline.');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
