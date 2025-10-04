"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/AppLayout";
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
  AlertCircle
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

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
    }
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

  const accountOptions = [
    {
      icon: CreditCard,
      label: "Withdrawal information",
      href: "/account/withdrawal",
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
      href: "/transaction-history"
    },
    {
      icon: Settings,
      label: "Customer service",
      href: "/customer-service"
    }
  ];

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <Badge className="bg-gray-600 text-white">{user.level}</Badge>
                </div>
                <p className="text-gray-600">{user.id}</p>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Referral Code</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-semibold text-gray-900">{user.referralCode}</span>
                <Button size="sm" variant="ghost" className="p-1" onClick={copyReferralCode}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Credit Score */}
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Credit Score</p>
              <p className="text-lg font-semibold text-teal-600">{user.creditScore}</p>
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
                    <p className="font-semibold">Your current level {user.level}</p>
                    <p className="text-sm text-gray-300">Membership class gets more privileges</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-gray-900">
                  Check
                </Button>
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
    </AppLayout>
  );
}
