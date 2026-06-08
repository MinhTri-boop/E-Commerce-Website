import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import axiosClient, { setupInterceptors } from '../api/axiosClient';

export const AuthContext = createContext();

const CURRENT_USER_KEY = 'hexashop_current_user';
const TOKEN_KEY = 'hexashop_token';

const loadCurrentUser = () => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadCurrentUser);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Global Modal State
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const isAuthenticated = !!user;

  const requireAuth = useCallback((callback) => {
    if (isAuthenticated) {
      if (callback) callback();
    } else {
      setLoginModalOpen(true);
    }
  }, [isAuthenticated]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    // Setup Axios interceptor to catch 401s
    setupInterceptors(logout);
  }, [logout]);

  useEffect(() => {
    // Fetch current user on mount if token exists
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const response = await axiosClient.get('/auth/me');
          setUser(response.data);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.data));
        } catch (err) {
          // If token is invalid/expired, the interceptor will call logout()
          console.error('Failed to fetch user:', err);
        }
      }
      setIsInitializing(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }

    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, token);

      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password.';
      setError(errMsg);
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    if (!name || !email || !password) {
      setError('All fields are required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    try {
      const response = await axiosClient.post('/auth/register', { name, email, password });
      const { user: userData, token } = response.data;

      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, token);

      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed.';
      setError(errMsg);
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      register,
      logout,
      error,
      isLoginModalOpen,
      setLoginModalOpen,
      isRegisterModalOpen,
      setRegisterModalOpen,
      requireAuth,
    }),
    [user, isAuthenticated, login, register, logout, error, isLoginModalOpen, isRegisterModalOpen, requireAuth]
  );

  if (isInitializing) {
    return null; // or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
