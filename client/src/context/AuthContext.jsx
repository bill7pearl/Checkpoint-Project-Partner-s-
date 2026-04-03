import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL params (from OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('perfumehub_token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Load user if token exists
    const loadUser = async () => {
      const savedToken = localStorage.getItem('perfumehub_token');
      if (savedToken) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('perfumehub_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000/api' : 'https://perfumehub-api.onrender.com/api');

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) { /* ignore */ }
    localStorage.removeItem('perfumehub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      loginWithGithub,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.is_admin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
