"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, LogIn, UserPlus } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 relative mx-auto mb-4">
              <Image
                src="/logo/logo.png"
                alt="Iconic Digital"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <p className="text-gray-600">Award-winning creative & performance marketing agency</p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <Link href="/auth/login">
                <Button className="w-full h-12 text-lg">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
              
              <Link href="/auth/register">
                <Button variant="outline" className="w-full h-12 text-lg">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                Admin Dashboard
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Account Balance",
      value: "Rs 61,076",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    },
    {
      label: "Number of Campaigns",
      value: "8/30",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    },
    {
      label: "Today's Commission",
      value: "Rs 0",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    },
    {
      label: "Withdrawal Amount",
      value: "Rs 0",
      bgColor: "bg-teal-50 border-teal-200",
      textColor: "text-teal-600"
    }
  ];

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Video Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200 h-64">
          <div className="absolute inset-0 bg-black/20">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop"
              alt="Campaign preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Play className="w-6 h-6 text-white mr-2" />
              <span className="text-white">Play Video</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className={`p-4 ${stat.bgColor} border-2`}>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Launch Campaign Button */}
        <div className="pt-4">
          <Button
            className="w-full h-14 text-lg font-semibold socialtrend-secondary text-white rounded-2xl flex items-center justify-center gap-3"
          >
            <ArrowRight className="w-6 h-6" />
            Launch Campaign
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
