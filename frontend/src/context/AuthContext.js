import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, user: null });

    useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth);
            console.log('Retrieved auth from localStorage:', parsedAuth);
            setAuth(parsedAuth);
        } else {
            console.log('No auth found in localStorage.');
        }
    }, []);

    const login = async (code) => {
        try {
            const response = await axios.post('/api/auth/google-login', { code });
            const data = response.data;
            console.log('Login successful, received data:', data);
            setAuth(data);
            localStorage.setItem('auth', JSON.stringify(data));
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
