import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const data = await api.getSession();
      if (data && data.success && data.user) {
        setAdminUser(data.user);
      } else {
        setAdminUser(null);
      }
    } catch (err) {
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (username, password) => {
    const res = await api.login({ username, password });
    if (res && res.success && res.user) {
      setAdminUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await api.logout();
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ adminUser, loading, isAuthenticated: !!adminUser, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
