"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { apiClient } from '@/lib/api-client';

export default function WithdrawalPasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ _id: string; username?: string; level?: string; avatar?: string; withdrawalPassword?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    newWithdrawalPassword: "",
    confirmWithdrawalPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Use the user data directly from localStorage first
          setUser(parsedUser);
          
          // Then fetch fresh user data to check withdrawal password status
          try {
            const response = await fetch(`/api/user?username=${encodeURIComponent(parsedUser.username)}`);
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setUser(data.data);
              } else {
                console.warn('Failed to fetch fresh user data:', data.error);
                // Keep using localStorage data if API fails
              }
            } else if (response.status === 404) {
              console.warn('User endpoint not found. This might be a deployment issue.');
              // Keep using localStorage data if API fails
            } else {
              console.warn('API request failed:', response.status);
              // Keep using localStorage data if API fails
            }
          } catch (apiError) {
            console.warn('Error fetching fresh user data:', apiError);
            // Keep using localStorage data if API fails
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
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
      setError('Withdrawal passwords do not match');
      return;
    }

    if (formData.newWithdrawalPassword.length < 6) {
      setError('Withdrawal password must be at least 6 characters');
      return;
    }

    // Check if user already has a withdrawal password
    if (user?.withdrawalPassword) {
      setError('Withdrawal password already exists. Only admin can change it. Contact support for assistance.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.updateUserProfile({
        _id: user?._id,
        userId: user?._id,
        newWithdrawalPassword: formData.newWithdrawalPassword
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          newWithdrawalPassword: "",
          confirmWithdrawalPassword: ""
        });
        // Refresh user data
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          try {
            const refreshResponse = await fetch(`/api/user?username=${encodeURIComponent(parsedUser.username)}`);
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success) {
                setUser(refreshData.data);
              }
            } else if (refreshResponse.status === 404) {
              console.warn('User endpoint not found during refresh. This might be a deployment issue.');
            }
          } catch (refreshError) {
            console.warn('Error refreshing user data:', refreshError);
          }
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.error || 'Failed to create withdrawal password');
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
      <HomepageHeader user={{ 
        username: user.username || 'User', 
        level: user.level || 'Bronze', 
        avatar: user.avatar 
      }} />
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/account">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {user?.withdrawalPassword ? 'Withdrawal Password' : 'Create Withdrawal Password'}
          </h1>
        </div>

        {/* Form */}
        <Card className="p-6">
          {user?.withdrawalPassword ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Withdrawal password is set</span>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Password Protection Active</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your withdrawal password is set and cannot be changed by you. 
                      Contact admin support if you need assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Create Withdrawal Password</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Set a withdrawal password to secure your withdrawal requests. 
                      This password will be required for all withdrawal transactions and cannot be changed once set.
                    </p>
                  </div>
                </div>
              </div>

            {/* New Withdrawal Password */}
            <div className="space-y-2">
              <Label htmlFor="newWithdrawalPassword">Withdrawal Password</Label>
              <div className="relative">
                <Input
                  id="newWithdrawalPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter your withdrawal password"
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
              <Label htmlFor="confirmWithdrawalPassword">Confirm Withdrawal Password</Label>
              <div className="relative">
                <Input
                  id="confirmWithdrawalPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm your withdrawal password"
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
                <p className="text-green-800">Withdrawal password created successfully!</p>
              </div>
            )}

            {/* Create Password Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
            >
              {loading ? 'Creating Withdrawal Password...' : 'Create Withdrawal Password'}
            </Button>
          </form>
          )}
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
