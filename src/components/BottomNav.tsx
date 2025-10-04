"use client";

import { Calendar, History, Home, User, Briefcase } from "lucide-react";
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
    icon: Calendar,
    isPrimary: true,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
  {
    href: "/account",
    label: "Account",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 bottom-nav-shadow">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 min-w-0 flex-1",
                "text-xs font-medium transition-colors",
                isActive
                  ? item.isPrimary
                    ? "text-teal-500"
                    : "text-teal-500"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive && item.isPrimary && "text-teal-500"
                )}
              />
              <span className={cn(
                "truncate",
                isActive && item.isPrimary && "text-teal-500"
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
