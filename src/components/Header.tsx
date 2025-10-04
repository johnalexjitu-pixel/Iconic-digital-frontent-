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
      <div className="flex items-center">
        <div className="w-48 relative">
          <Image
            src="/logo/logo.png"
            alt="Iconic Digital"
            width={500}
            height={500}
            className="object-contain"
          />
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
