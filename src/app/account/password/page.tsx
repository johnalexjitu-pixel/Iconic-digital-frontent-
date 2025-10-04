"use client";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ChangePasswordPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    avatar: "/placeholder-avatar.jpg"
  };

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log('Password change submitted:', formData);
  };

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/account">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Change Login Password</h1>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
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

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
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

            {/* Confirm New Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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

            {/* Change Password Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
            >
              Change Password
            </Button>
          </form>
        </Card>

        {/* Password Requirements */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">Password Requirements</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Minimum 8 characters long</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Include at least one uppercase letter (A-Z)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Include at least one lowercase letter (a-z)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Include at least one number (0-9)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>Include at least one special character (!@#$%^&*)</p>
            </div>
          </div>
        </Card>

        {/* Security Tips */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3">Security Tips</h4>
          <div className="space-y-2 text-sm text-amber-700">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Use a unique password that you don't use for other accounts</p>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Avoid using personal information like your name or birthday</p>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Consider using a password manager to generate and store strong passwords</p>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>Change your password regularly for better security</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
