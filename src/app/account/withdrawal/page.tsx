"use client";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiClient } from '@/lib/api-client';

export default function WithdrawalInfoPage() {
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string } | null>(null);
  const [formData, setFormData] = useState({
    withdrawalMethod: "Bank Account",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    branch: "",
    amount: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWithdrawal = async () => {
    if (!formData.amount || !formData.accountNumber) return;
    
    setLoading(true);
    try {
      // Save withdrawal info to user profile
      const withdrawalInfoResponse = await apiClient.updateUserProfile({
        withdrawalInfo: {
          method: formData.withdrawalMethod,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          branch: formData.branch,
          documentsUploaded: false
        }
      });

      if (withdrawalInfoResponse.success) {
        // Create withdrawal transaction
        const response = await apiClient.createTransaction({
          type: 'withdrawal',
          amount: parseFloat(formData.amount),
          method: formData.withdrawalMethod,
          status: 'processing',
          description: `Withdrawal to ${formData.bankName} - ${formData.accountNumber}`,
          metadata: {
            accountHolderName: formData.accountHolderName,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            branch: formData.branch
          }
        });

        if (response.success) {
          setSuccess(true);
          setFormData({
            withdrawalMethod: "Bank Account",
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            branch: "",
            amount: ""
          });
          setTimeout(() => setSuccess(false), 3000);
        }
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout user={user || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/account">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Withdrawal Information</h1>
        </div>

        {/* Form */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Description */}
            <p className="text-sm text-gray-600">
              Set up your withdrawal information to enable withdrawals from your account. This
              information will be used when you request to withdraw funds.
            </p>

            {/* Withdrawal Method */}
            <div className="space-y-2">
              <Label htmlFor="method">Withdrawal Method</Label>
              <div className="relative">
                <select
                  id="method"
                  value={formData.withdrawalMethod}
                  onChange={(e) => handleInputChange('withdrawalMethod', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none pr-10"
                >
                  <option value="Bank Account">Bank Account</option>
                  <option value="UPI">UPI</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="holderName">Account Holder Name</Label>
              <Input
                id="holderName"
                placeholder="Enter account holder name"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter Account Number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                placeholder="Enter branch name"
                value={formData.branch}
                onChange={(e) => handleInputChange('branch', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Withdrawal Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount (Rs)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter withdrawal amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Identity Verification Documents */}
            <div className="space-y-3">
              <div>
                <Label>Identity Verification Documents <span className="text-red-500">*</span></Label>
                <p className="text-sm text-gray-600 mt-1">
                  Please submit your valid documentation for verification purpose. (National ID / Passport /
                  Driving License)
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                <p className="text-xs text-gray-500">PNG or JPG up to 10MB each</p>
              </div>

              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Document upload is required for verification</span>
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Withdrawal request submitted successfully!</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleWithdrawal}
              disabled={!formData.amount || !formData.accountNumber || loading}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
            >
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </Button>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Important Notice</h4>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-green-600 mt-2 flex-shrink-0" />
              <p>Please ensure all the information provided is accurate and belongs to you.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-green-600 mt-2 flex-shrink-0" />
              <p>For security reasons, withdrawals can only be made to accounts that match your personal details.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-green-600 mt-2 flex-shrink-0" />
              <p>Changes to your withdrawal information may require verification by our team.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-green-600 mt-2 flex-shrink-0" />
              <p>Processing time for withdrawals is typically 24-48 hours once requested.</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
