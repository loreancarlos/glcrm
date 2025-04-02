import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="480482032578-1gecsmq9615errtu0quhv8dsqbf1gb0j.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);