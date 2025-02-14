import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Pages/Homepage';
import Userpage from './components/Pages/Userpage';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <GlobalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/userpage" element={<Userpage />} />
            </Routes>
          </Router>
        </GlobalProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
