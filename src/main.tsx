import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="480482032578-jbi5mgfo2v65gjcl08ifemp3r4oqp5j4.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);