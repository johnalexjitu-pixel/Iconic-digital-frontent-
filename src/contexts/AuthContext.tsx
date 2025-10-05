'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  level: string;
  membershipId: string;
  referralCode: string;
  creditScore: number;
  accountBalance: number;
  walletBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  todayCommission: number;
  withdrawalAmount: number;
  avatar?: string;
  dailyCheckIn: {
    lastCheckIn: string | null;
    streak: number;
    daysClaimed: number[];
  };
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Verify with server using the logged-in user's email
        const response = await fetch(`/api/user?email=${encodeURIComponent(parsedUser.email)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
