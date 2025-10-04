"use client";

import { Header } from "./Header";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    level: string;
    avatar?: string;
  };
}

export function AppLayout({ children, user }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="pb-20 px-4 py-6 max-w-4xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
