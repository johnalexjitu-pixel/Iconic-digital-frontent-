"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from '@/lib/api-client';

export default function WithdrawalPasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    currentWithdrawalPassword: "",
    newWithdrawalPassword: "",
    confirmWithdrawalPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.newWithdrawalPassword !== formData.confirmWithdrawalPassword) {
      setError('New withdrawal passwords do not match');
      return;
    }

    if (formData.newWithdrawalPassword.length < 6) {
      setError('New withdrawal password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.updateUserProfile({
        currentWithdrawalPassword: formData.currentWithdrawalPassword,
        newWithdrawalPassword: formData.newWithdrawalPassword
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          currentWithdrawalPassword: "",
          newWithdrawalPassword: "",
          confirmWithdrawalPassword: ""
        });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to change withdrawal password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user} />
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/account">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Change Withdrawal Password</h1>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Withdrawal Password */}
            <div className="space-y-2">
              <Label htmlFor="currentWithdrawalPassword">Current Withdrawal Password</Label>
              <div className="relative">
                <Input
                  id="currentWithdrawalPassword"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter your current withdrawal password"
                  value={formData.currentWithdrawalPassword}
                  onChange={(e) => handleInputChange('currentWithdrawalPassword', e.target.value)}
                  className="h-12 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* New Withdrawal Password */}
            <div className="space-y-2">
              <Label htmlFor="newWithdrawalPassword">New Withdrawal Password</Label>
              <div className="relative">
                <Input
                  id="newWithdrawalPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter your new withdrawal password"
                  value={formData.newWithdrawalPassword}
                  onChange={(e) => handleInputChange('newWithdrawalPassword', e.target.value)}
                  className="h-12 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm New Withdrawal Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmWithdrawalPassword">Confirm New Withdrawal Password</Label>
              <div className="relative">
                <Input
                  id="confirmWithdrawalPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm your new withdrawal password"
                  value={formData.confirmWithdrawalPassword}
                  onChange={(e) => handleInputChange('confirmWithdrawalPassword', e.target.value)}
                  className="h-12 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Withdrawal password changed successfully!</p>
              </div>
            )}

            {/* Change Password Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
            >
              {loading ? 'Changing Withdrawal Password...' : 'Change Withdrawal Password'}
            </Button>
          </form>
        </Card>

        {/* Password Requirements */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">Withdrawal Password Requirements</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Minimum 6 characters long</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Use a combination of letters and numbers</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Do not use common words or personal information</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Keep your withdrawal password secure and private</p>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Security Notice</h4>
              <p className="text-sm text-yellow-700">
                Your withdrawal password is used to authorize all withdrawal transactions. 
                Keep it secure and never share it with anyone. If you suspect your password 
                has been compromised, change it immediately.
              </p>
            </div>
          </div>
        </Card>
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
