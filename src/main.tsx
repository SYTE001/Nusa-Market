import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AuthProvider sits above the router so every route — including the
        full-bleed auth pages that render outside <Layout> — can read the
        Supabase session. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
