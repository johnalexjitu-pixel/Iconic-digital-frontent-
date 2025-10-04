"use client";

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

export default function AccountPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    id: "46235",
    referralCode: "UXOX485U6",
    creditScore: "100%",
    avatar: "/placeholder-avatar.jpg"
  };

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
      href: "/logout",
      hasArrow: true,
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
                <Button size="sm" variant="ghost" className="p-1">
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
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <CreditCard className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
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
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Check In
            </Button>
          </div>
        </Card>

        {/* Common Functions */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Common functions</h3>
          <div className="grid grid-cols-3 gap-4">
            {commonFunctions.map((func, index) => {
              const Icon = func.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="flex flex-col items-center gap-2 h-auto p-4"
                >
                  <Icon className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-center text-gray-700">{func.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-4">
          <div className="space-y-1">
            {accountOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors ${option.isDestructive ? 'hover:bg-red-50' : ''}`}>
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
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
