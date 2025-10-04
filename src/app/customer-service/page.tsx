"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Clock, MessageCircle, Phone, Mail, X } from "lucide-react";
import { Header } from "@/components/Header";

export default function CustomerServicePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

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
      value: "@iconicdigital_support",
      description: "Get instant help via Telegram"
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      name: "Phone",
      value: "+1 (555) 123-4567",
      description: "Call us during business hours"
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      name: "Email",
      value: "support@iconicdigital.site",
      description: "Send us an email anytime"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user || undefined} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
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
                  <p className="text-sm text-gray-600">9:00 AM to 9:00 PM</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 h-12"
            >
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/help')}
              className="flex items-center gap-2 h-12"
            >
              <MessageCircle className="w-5 h-5" />
              FAQ
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('mailto:support@iconicdigital.site')}
              className="flex items-center gap-2 h-12"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </Button>
          </div>
        </Card>

        {/* Contact Us Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Service</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">How can we help you today?</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information:</h4>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Telegram</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Service Hours:</h4>
                  <p className="text-gray-600">Monday - Sunday: 9:00 AM to 9:00 PM</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Contact Us
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
