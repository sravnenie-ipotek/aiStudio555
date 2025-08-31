'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, tokenManager } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPPORT';
  emailVerified: boolean;
  profile?: {
    phone?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: any;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const token = tokenManager.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await api.auth.me();
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      tokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;
      
      tokenManager.setTokens(accessToken, refreshToken);
      setUser(user);
      
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка входа');
    }
  };

  const register = async (data: any) => {
    try {
      const response = await api.auth.register(data);
      const { user, accessToken, refreshToken } = response.data.data;
      
      tokenManager.setTokens(accessToken, refreshToken);
      setUser(user);
      
      router.push('/auth/verify-email');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      setUser(null);
      router.push('/');
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}