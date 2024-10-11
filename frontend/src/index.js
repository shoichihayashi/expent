import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { GlobalProvider } from './context/GlobalContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
