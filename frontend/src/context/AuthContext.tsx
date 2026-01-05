import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { post } from '../lib/api';

type UserPayload = {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
};

type AuthState = {
  user: UserPayload | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);
const STORAGE_KEY = 'lumina-auth';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { user: UserPayload; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = (nextUser: UserPayload, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  };

  const login = async (email: string, password: string) => {
    const data = await post<{ token: string; user: UserPayload }>('/auth/client/login', { email, password });
    persist(data.user, data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await post<{ token: string; user: UserPayload }>('/auth/client/register', { name, email, password });
    persist(data.user, data.token);
  };

  const forgotPassword = async (email: string) => {
    const data = await post<{ token: string }>('/auth/client/forgot', { email });
    return data.token;
  };

  const resetPassword = async (resetToken: string, password: string) => {
    await post('/auth/client/reset', { token: resetToken, password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, forgotPassword, resetPassword, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
