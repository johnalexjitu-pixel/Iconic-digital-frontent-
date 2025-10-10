'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  number?: string;
  level: string;
  membershipId: string;
  referralCode: string;
  creditScore: number;
  accountBalance: number;
  walletBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  campaignSet: number[];
  campaignCommission: number;
  depositCount: number;
  trialBalance: number;
  campaignStatus: string;
  withdrawStatus: string;
  accountStatus: string;
  dailyCheckIn: {
    lastCheckIn: string | null;
    streak: number;
    daysClaimed: number[];
  };
  isActive: boolean;
  allowTask: boolean;
  avatar?: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  requiresVerification?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requiresVerification, setRequiresVerification] = useState(false);
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
        
        // Verify with server using the logged-in user's username
        const response = await fetch(`/api/user?username=${encodeURIComponent(parsedUser.username)}`);
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
        setRequiresVerification(false);
        return true;
      } else if (data.requiresVerification) {
        setRequiresVerification(true);
        router.push('/contact-support');
        return false;
      } else {
        console.error('Login failed:', data.error);
        setRequiresVerification(false);
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
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, requiresVerification }}>
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
