"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { HomepageHeader } from '@/components/HomepageHeader';
import { HomepageFooter } from '@/components/HomepageFooter';

export default function ContactSupportPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; level: string; avatar?: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Check for success message from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900 font-lexend">Account Verification Required</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Success Message */}
          {successMessage && (
            <div className="lg:col-span-2">
              <Card className="p-6 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-green-800 font-semibold">Registration Successful!</h3>
                    <p className="text-green-700 text-sm">{successMessage}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Verification Status */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">Account Verification</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 font-medium mb-2">Account Status: Inactive</p>
                <p className="text-orange-700 text-sm">
                  Your account has been created successfully but requires verification before you can access the platform.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">What happens next?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">1.</span>
                    <span>Contact our support team via Telegram</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">2.</span>
                    <span>Provide your account details for verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">3.</span>
                    <span>Our team will activate your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">4.</span>
                    <span>You'll be able to login and start earning</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Support</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Telegram Support</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Get instant help via Telegram. Our support team is available to assist you with account verification.
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">t.me/Iconicdigital_customerservice_BD</span>
                </div>
                <Button
                  onClick={() => window.open('https://t.me/Iconicdigital_customerservice_BD', '_blank')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <img src="/Telegram_logo.svg.webp" alt="Telegram" className="w-4 h-4 mr-2" />
                  Contact Support Now
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Service Hours</p>
                  <p className="text-sm text-gray-600">Monday - Sunday: 10:00 AM to 10:00 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Account Information */}
        {user && (
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-medium text-gray-900">{user.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-orange-600">Inactive - Verification Required</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Please provide this information when contacting support for faster verification.
              </p>
            </div>
          </Card>
        )}
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
