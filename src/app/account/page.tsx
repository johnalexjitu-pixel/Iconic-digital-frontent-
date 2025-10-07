"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  CreditCard,
  DollarSign,
  Gift,
  History,
  Settings,
  Key,
  LogOut,
  ChevronRight,
  Copy,
  AlertCircle,
  Wallet,
  RefreshCw
} from "lucide-react";
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface User {
  _id: string;
  id?: string;
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
  lastLogin: Date;
  dailyCheckIn: {
    lastCheckIn?: Date;
    streak: number;
    daysClaimed: number[];
  };
  avatar?: string;
  isDestructive?: boolean;
}

interface AccountOption {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  hasArrow?: boolean;
  isDestructive?: boolean;
}

export default function AccountPage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    name: '',
    walletBalance: 0,
    level: '',
    membershipId: '',
    referralCode: '',
    creditScore: 0
  });

  // Real-time data fetching
  const fetchRealTimeData = useCallback(async () => {
    try {
      if (!user?.email) return;
      
      const response = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const userData = data.data;
          setRealTimeData({
            name: userData.name || '',
            walletBalance: userData.accountBalance || 0, // Use accountBalance instead of walletBalance
            level: userData.level || 'Bronze',
            membershipId: userData.membershipId || '',
            referralCode: userData.referralCode || '',
            creditScore: userData.creditScore || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!loading && !user) {
      // No user data, redirect to login
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      // Initial data fetch
      fetchRealTimeData();
      
      // Auto-refresh every 3 seconds for real-time updates
      const interval = setInterval(() => {
        fetchRealTimeData();
      }, 3000); // 3 seconds for more frequent updates

      return () => clearInterval(interval);
    }
  }, [user, loading, router, fetchRealTimeData]);

  const handleLogout = () => {
    logout();
  };

  const copyReferralCode = () => {
    const referralCode = realTimeData.referralCode || user?.referralCode;
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRealTimeData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const accountOptions: AccountOption[] = [
    {
      icon: CreditCard,
      label: "Withdrawal information",
      href: "/account/withdrawal",
      hasArrow: true
    },
    {
      icon: History,
      label: "Withdrawal history",
      href: "/account/withdrawal-history",
      hasArrow: true
    },
    {
      icon: Key,
      label: "Login password",
      href: "/account/password",
      hasArrow: true
    },
    {
      icon: Key,
      label: "Withdrawal password",
      href: "/account/withdrawal-password",
      hasArrow: true
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
      isDestructive: true
    }
  ];

  const commonFunctions = [
    {
      icon: User,
      label: "Member Level",
      href: "/member-level"
    },
    {
      icon: History,
      label: "Transaction History",
      href: "/history"
    },
    {
      icon: Settings,
      label: "Customer service",
      href: "/customer-service"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user} />
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
        {/* Profile Header */}
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
                  {(realTimeData.name || user.name)?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 animate-pulse">
                    {realTimeData.name || user.name || 'User'}
                  </h2>
                  <Badge className={`${
                    (realTimeData.level || user.level) === 'Gold' ? 'bg-yellow-500 text-white' :
                    (realTimeData.level || user.level) === 'Silver' ? 'bg-gray-400 text-white' :
                    (realTimeData.level || user.level) === 'Platinum' ? 'bg-purple-500 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {realTimeData.level || user.level || 'Bronze'}
                  </Badge>
                </div>
                <p className="text-gray-600 font-mono">{realTimeData.membershipId || user.membershipId || 'N/A'}</p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Referral Code</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-semibold text-gray-900">
                  {realTimeData.referralCode || user.referralCode || 'N/A'}
                </span>
                <Button size="sm" variant="ghost" className="p-1" onClick={copyReferralCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Credit Score */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Credit Score</p>
              <p className="text-lg font-semibold text-teal-600">
                {realTimeData.creditScore || user.creditScore || 0}
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-1"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-6 h-6 text-green-600" />
                <p className="text-3xl font-bold text-green-600 animate-pulse">
                  BDT {(realTimeData.walletBalance || user.walletBalance || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/deposit">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </Link>
              <Link href="/account/withdrawal">
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </Link>
            </div>

            {/* Level Check */}
            <Card className="p-4 bg-gray-900 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <div>
                    <p className="font-semibold animate-pulse">
                      Your current level {realTimeData.level || user.level || 'Bronze'}
                    </p>
                    <p className="text-sm text-gray-300">Membership class gets more privileges</p>
                  </div>
                </div>
                <Link href="/member-level">
                  <Button variant="outline" size="sm" className="text-gray-900">
                    Check
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Card>

        {/* Daily Check-In */}
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">Daily Check-In</p>
                <p className="text-sm text-gray-600">Earn rewards by checking in daily!</p>
              </div>
            </div>
            <Link href="/daily-checkin">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Check In
              </Button>
            </Link>
          </div>
        </Card>

        {/* Common Functions */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Common functions</h3>
          <div className="grid grid-cols-3 gap-4">
            {commonFunctions.map((func, index) => {
              const Icon = func.icon;
              return (
                <Link key={index} href={func.href}>
                  <Button
                    variant="ghost"
                    className="w-full flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <Icon className="w-6 h-6 text-gray-600" />
                    <span className="text-xs text-center text-gray-700">{func.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-4">
          <div className="space-y-1">
            {accountOptions.map((option, index) => {
              const Icon = option.icon;
              if (option.onClick) {
                return (
                  <div key={index} onClick={option.onClick} className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${option.isDestructive ? 'hover:bg-red-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${option.isDestructive ? 'text-red-500' : 'text-gray-600'}`} />
                      <span className={`${option.isDestructive ? 'text-red-600' : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                    </div>
                    {option.hasArrow && (
                      <ChevronRight className={`w-4 h-4 ${option.isDestructive ? 'text-red-400' : 'text-gray-400'}`} />
                    )}
                  </div>
                );
              }
              return (
                <Link key={index} href={option.href || '#'}>
                  <div className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${option.isDestructive ? 'hover:bg-red-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${option.isDestructive ? 'text-red-500' : 'text-gray-600'}`} />
                      <span className={`${option.isDestructive ? 'text-red-600' : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                    </div>
                    {option.hasArrow && (
                      <ChevronRight className={`w-4 h-4 ${option.isDestructive ? 'text-red-400' : 'text-gray-400'}`} />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
