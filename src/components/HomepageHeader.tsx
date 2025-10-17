"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Crown, HelpCircle, Headphones, LogIn, LogOut, Menu, X } from "lucide-react";
import Image from 'next/image';

interface HomepageHeaderProps {
  user?: {
    username: string;
    level: string;
    avatar?: string;
  } | null;
}

export function HomepageHeader({ user }: HomepageHeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 max-h-[92px] relative">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/')}
        >
          <div className="flex items-center">
            <Image 
              src="/final-logo.png" 
              alt="ICONIC DIGITAL Logo" 
              width={200}
              height={60}
              className="h-12 sm:h-16 w-auto"
              priority
            />
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-lexend text-gray-600">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/member-level')}
            className="flex items-center gap-1"
          >
            <Crown className="w-4 h-4" />
            <span>Member Level</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/help')}
            className="flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/customer-service')}
            className="flex items-center gap-1"
          >
            <Headphones className="w-4 h-4" />
            <span>Support</span>
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
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/auth/login')}
              className="flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-6 py-4 space-y-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                router.push('/member-level');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full justify-start text-sm font-lexend text-gray-600"
            >
              <Crown className="w-4 h-4" />
              <span>Member Level</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                router.push('/help');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full justify-start text-sm font-lexend text-gray-600"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                router.push('/customer-service');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full justify-start text-sm font-lexend text-gray-600"
            >
              <Headphones className="w-4 h-4" />
              <span>Support</span>
            </Button>

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.reload();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full justify-start text-sm font-lexend text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push('/auth/login');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full justify-start text-sm font-lexend text-gray-600"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
