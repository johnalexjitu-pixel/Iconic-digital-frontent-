"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Menu, Phone, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user?: {
    name: string;
    level: string;
    avatar?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white"
            fill="currentColor"
          >
            <path d="M13 0.5L23.5 6v12L13 23.5 2.5 18V6L13 0.5z M13 2.8L4.8 7.2v9.6L13 21.2l8.2-4.4V7.2L13 2.8z M13 6l6 3.5v7L13 20l-6-3.5v-7L13 6z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">SOCIALTREND.</h1>
        </div>
      </div>

      {/* Right side menu */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{user.level} Member</span>
          </div>
        )}

        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Help</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Support</span>
        </Button>

        {user && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
