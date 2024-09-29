import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { GlobalProvider } from './context/GlobalContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="264275785571-7p8d5tm156iuaphc4kbqi8roulc3filf.apps.googleusercontent.com">
    <AuthProvider>
      <React.StrictMode>
        <GlobalProvider>
          <GlobalStyle />
          <App />
        </GlobalProvider>
      </React.StrictMode>
    </AuthProvider>
  </GoogleOAuthProvider>
);
