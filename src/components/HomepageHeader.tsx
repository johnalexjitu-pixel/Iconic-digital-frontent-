"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Crown, HelpCircle, Headphones, LogIn, LogOut } from "lucide-react";

interface HomepageHeaderProps {
  user?: {
    name: string;
    level: string;
    avatar?: string;
  } | null;
}

export function HomepageHeader({ user }: HomepageHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <span className="text-xl font-bold text-gray-900 font-lexend">ICONIC DIGITAL</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-lexend text-gray-600">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/member-level')}
            className="flex items-center gap-1"
          >
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">Member Level</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/help')}
            className="flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/customer-service')}
            className="flex items-center gap-1"
          >
            <Headphones className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </Button>

          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem('user');
                window.location.reload();
              }}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/auth/login')}
              className="flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
