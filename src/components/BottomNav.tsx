"use client";

import { Calendar, History, Home, User, Briefcase, PlayCircle, BarChart3, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/services",
    label: "Services",
    icon: Briefcase,
  },
  {
    href: "/campaign",
    label: "Campaign",
    icon: PlayCircle,
    isPrimary: true,
  },
  {
    href: "/history",
    label: "History",
    icon: BarChart3,
  },
  {
    href: "/account",
    label: "Account",
    icon: UserCircle,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 min-w-0 flex-1 rounded-lg transition-all duration-200",
                "text-xs font-semibold",
                isActive
                  ? item.isPrimary
                    ? "text-red-500 bg-red-50"
                    : "text-red-500 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && item.isPrimary && "text-red-500 scale-110",
                  isActive && !item.isPrimary && "text-red-500",
                  !isActive && "text-gray-500"
                )}
              />
              <span className={cn(
                "truncate text-xs font-medium",
                isActive && item.isPrimary && "text-red-500 font-bold",
                isActive && !item.isPrimary && "text-red-500",
                !isActive && "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
