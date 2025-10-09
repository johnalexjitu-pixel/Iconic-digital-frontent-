"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";

export default function CustomerServicePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
      name: "Telegram",
      value: "t.me/Iconicdigital_customerservice_BD",
      description: "Get instant help via Telegram"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user || undefined} />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-lexend">Customer Service</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {method.icon}
                  <div>
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.value}</p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Service Hours */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Hours</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Monday - Sunday</p>
                  <p className="text-sm text-gray-600">10:00 AM to 10:00 PM</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Our support team is available 7 days a week to assist you with any questions or issues.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => window.open('https://t.me/Iconicdigital_customerservice_BD', '_blank')}
              className="flex items-center gap-2 h-12 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <img src="/Telegram_logo.svg.webp" alt="Telegram" className="w-5 h-5" />
              Telegram Support
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/help')}
              className="flex items-center gap-2 h-12"
            >
              <MessageCircle className="w-5 h-5" />
              FAQ
            </Button>
          </div>
        </Card>

      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
