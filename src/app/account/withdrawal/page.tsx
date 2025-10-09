"use client";

import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, AlertCircle, CheckCircle, X, FileImage, DollarSign, Clock, History, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiClient } from '@/lib/api-client';
import { useToastHelpers } from '@/components/ui/toast';

interface WithdrawalRecord {
  _id: string;
  customerId: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'roket' | 'bank' | 'usdt';
  accountDetails: {
    accountNumber?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
    accountHolderName?: string;
    branch?: string;
    usdtAddress?: string;
    usdtNetwork?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function WithdrawalInfoPage() {
  const { success: showSuccess, error: showError, info: showInfo } = useToastHelpers();
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string; _id?: string; accountBalance?: number } | null>(null);
  const [formData, setFormData] = useState({
    withdrawalMethod: "bkash",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    branch: "",
    mobileNumber: "",
    usdtAddress: "",
    usdtNetwork: "TRC20",
    amount: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showWithdrawalSetup, setShowWithdrawalSetup] = useState(false);
  const [withdrawalInfo, setWithdrawalInfo] = useState<{
    method: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    branch?: string;
    mobileNumber?: string;
    usdtAddress?: string;
    usdtNetwork?: string;
    documentsUploaded?: boolean;
    uploadedDocuments?: unknown[];
    setupCompleted?: boolean;
    setupDate?: Date;
  } | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchWithdrawals(parsedUser._id);
      fetchUserWithdrawalInfo(parsedUser._id);
    }
  }, []);

  const fetchWithdrawals = async (customerId: string) => {
    setHistoryLoading(true);
    try {
      const response = await apiClient.getWithdrawals(customerId);
      if (response.success) {
        setWithdrawals(response.data as WithdrawalRecord[]);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchUserWithdrawalInfo = async (userId: string) => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const parsedUser = JSON.parse(userData);
      const response = await fetch(`/api/user?email=${parsedUser.email}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.withdrawalInfo) {
          console.log('Fetched withdrawal info:', data.data.withdrawalInfo);
          setWithdrawalInfo(data.data.withdrawalInfo);
        } else {
          console.log('No withdrawal info found for user');
        }
      }
    } catch (error) {
      console.error('Error fetching withdrawal info:', error);
    }
  };

  const handleWithdrawalSetup = async () => {
    setSetupLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }
      const user = JSON.parse(userData);

      // Upload documents to MongoDB first
      const formDataToUpload = new FormData();
      formDataToUpload.append('userId', user._id);
      uploadedFiles.forEach(file => {
        formDataToUpload.append('files', file);
      });

      const uploadResponse = await fetch('/api/upload/documents', {
        method: 'POST',
        body: formDataToUpload
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Failed to upload documents');
      }

      // Prepare account details based on method
      const accountDetails: Record<string, unknown> = {
        accountHolderName: formData.accountHolderName,
        uploadedDocuments: uploadResult.data.uploadedDocuments
      };

      switch (formData.withdrawalMethod) {
        case 'bkash':
        case 'nagad':
        case 'roket':
          accountDetails.mobileNumber = formData.mobileNumber;
          accountDetails.provider = formData.withdrawalMethod;
          break;
        case 'bank':
          accountDetails.accountNumber = formData.accountNumber;
          accountDetails.bankName = formData.bankName;
          accountDetails.branch = formData.branch;
          break;
        case 'usdt':
          accountDetails.usdtAddress = formData.usdtAddress;
          accountDetails.usdtNetwork = formData.usdtNetwork;
          break;
      }

      // Save withdrawal info to user profile
      const withdrawalInfoResponse = await apiClient.updateUserProfile({
        _id: user._id,
        withdrawalInfo: {
          method: formData.withdrawalMethod,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          branch: formData.branch,
          mobileNumber: formData.mobileNumber,
          usdtAddress: formData.usdtAddress,
          usdtNetwork: formData.usdtNetwork,
          documentsUploaded: true,
          uploadedDocuments: uploadResult.data.uploadedDocuments,
          setupCompleted: true,
          setupDate: new Date()
        }
      });

      if (withdrawalInfoResponse.success) {
        setWithdrawalInfo({
          method: formData.withdrawalMethod,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          branch: formData.branch,
          mobileNumber: formData.mobileNumber,
          usdtAddress: formData.usdtAddress,
          usdtNetwork: formData.usdtNetwork,
          documentsUploaded: true,
          uploadedDocuments: uploadResult.data.uploadedDocuments,
          setupCompleted: true,
          setupDate: new Date()
        });
        setShowWithdrawalSetup(false);
        setSuccess(true);
        showSuccess('Withdrawal information saved successfully!', 'Setup Complete');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // Show API error message as toast
        showError(withdrawalInfoResponse.message || 'Failed to save withdrawal information', 'Setup Failed');
      }
    } catch (error) {
      console.error('Error setting up withdrawal info:', error);
      showError('Error setting up withdrawal info: ' + (error as Error).message, 'Setup Error');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const isValidType = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodDisplayName = (method: string) => {
    switch (method) {
      case 'bkash':
        return 'Bkash';
      case 'nagad':
        return 'Nagad';
      case 'roket':
        return 'Roket';
      case 'bank':
        return 'Bank Transfer';
      case 'usdt':
        return 'USDT';
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWithdrawal = async () => {
    // Validate required fields
    if (!formData.amount) {
      showError('Please enter withdrawal amount', 'Validation Error');
      return;
    }

    if (!withdrawalInfo?.setupCompleted) {
      showError('Please complete withdrawal information setup first', 'Setup Required');
      return;
    }
    
    setLoading(true);
    try {
      // Get user data to get customerId
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User not found');
      }
      const user = JSON.parse(userData);

      // Use saved withdrawal information
      const accountDetails = {
        accountHolderName: withdrawalInfo.accountHolderName,
        bankName: withdrawalInfo.bankName,
        accountNumber: withdrawalInfo.accountNumber,
        branch: withdrawalInfo.branch,
        mobileNumber: withdrawalInfo.mobileNumber,
        provider: withdrawalInfo.method,
        usdtAddress: withdrawalInfo.usdtAddress,
        usdtNetwork: withdrawalInfo.usdtNetwork,
        uploadedDocuments: withdrawalInfo.uploadedDocuments
      };

      // Create withdrawal request using the saved withdrawal information
      const response = await apiClient.createWithdrawal({
        customerId: user._id,
          amount: parseFloat(formData.amount),
        method: withdrawalInfo.method,
        accountDetails: accountDetails
        });

        if (response.success) {
          setSuccess(true);
        showSuccess('Withdrawal request submitted successfully!', 'Success');
          setFormData({
          withdrawalMethod: "bkash",
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            branch: "",
          mobileNumber: "",
          usdtAddress: "",
          usdtNetwork: "TRC20",
            amount: ""
          });
        // Refresh withdrawal history
        fetchWithdrawals(user._id);
          setTimeout(() => setSuccess(false), 3000);
      } else {
        // Show API error message as toast
        showError(response.message || 'Withdrawal request failed', 'Withdrawal Failed');
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      showError('Error creating withdrawal: ' + (error as Error).message, 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user || undefined} />
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/account">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
            <h1 className="text-xl font-bold text-gray-900">Withdrawal</h1>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="withdrawal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
              <TabsTrigger value="history">Withdrawal History</TabsTrigger>
            </TabsList>

            {/* Withdrawal Tab */}
            <TabsContent value="withdrawal" className="space-y-6">
              {/* Wallet Balance */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wallet Balance</p>
                      <p className="text-lg font-semibold text-gray-900">BDT {user?.accountBalance?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Withdrawal Information */}
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Withdrawal Information</h3>
        </div>

                {!withdrawalInfo?.setupCompleted ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">No withdrawal information set.</p>
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => setShowWithdrawalSetup(true)}
                    >
                      Submit Withdrawal Information
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">Setup Complete</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {getMethodDisplayName(withdrawalInfo.method)}
                        </Badge>
                      </div>
                      <div className="text-sm text-green-700">
                        <p><strong>Account Holder:</strong> {withdrawalInfo.accountHolderName}</p>
                        {withdrawalInfo.method === 'bank' && (
                          <>
                            <p><strong>Bank:</strong> {withdrawalInfo.bankName}</p>
                            <p><strong>Account:</strong> {withdrawalInfo.accountNumber}</p>
                            <p><strong>Branch:</strong> {withdrawalInfo.branch}</p>
                          </>
                        )}
                        {(withdrawalInfo.method === 'bkash' || withdrawalInfo.method === 'nagad' || withdrawalInfo.method === 'roket') && (
                          <p><strong>Mobile:</strong> {withdrawalInfo.mobileNumber}</p>
                        )}
                        {withdrawalInfo.method === 'usdt' && (
                          <>
                            <p><strong>Address:</strong> {withdrawalInfo.usdtAddress?.slice(0, 20)}...</p>
                            <p><strong>Network:</strong> {withdrawalInfo.usdtNetwork}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => showInfo('To edit withdrawal information, please contact our admin support team.', 'Edit Information')}
                      >
                        Edit Information
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => showInfo('Contact Admin: admin@iconicdigital.com\nPhone: +880-XXX-XXXXXX', 'Contact Admin')}
                      >
                        Contact Admin
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Withdrawal Amount */}
              {withdrawalInfo?.setupCompleted ? (
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Amount:</h3>
                  
                    {/* Amount Input */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <Button variant="outline" className="h-12 px-4">
                          All
                        </Button>
        </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 h-12 bg-teal-500 hover:bg-teal-600 text-white"
                          onClick={handleWithdrawal}
                          disabled={loading}
                        >
                          {loading ? 'Processing...' : 'Withdraw'}
                        </Button>
                        <Button variant="outline" className="h-12 px-6">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                </Card>
              ) : (
                <Card className="p-4 bg-gray-50">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Setup Required</h3>
                    <p className="text-gray-600 mb-4">Please complete your withdrawal information setup first.</p>
                    <Button 
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={() => setShowWithdrawalSetup(true)}
                    >
                      Setup Withdrawal Information
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Withdrawal History Tab */}
            <TabsContent value="history" className="space-y-6">
              {historyLoading ? (
                <Card className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading withdrawal history...</p>
                </Card>
              ) : withdrawals.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Withdrawals Yet</h3>
                  <p className="text-gray-600 mb-4">You haven't made any withdrawal requests yet.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <Card key={withdrawal._id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {getMethodDisplayName(withdrawal.method)} Withdrawal
                            </h3>
            <p className="text-sm text-gray-600">
                              {withdrawal.accountDetails.accountHolderName}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(withdrawal.status)} border`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(withdrawal.status)}
                            <span className="capitalize">{withdrawal.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-semibold text-gray-900">BDT {withdrawal.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-semibold text-gray-900">{formatDate(withdrawal.submittedAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Method</p>
                          <p className="font-semibold text-gray-900">{getMethodDisplayName(withdrawal.method)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-semibold text-gray-900 capitalize">{withdrawal.status}</p>
                        </div>
                      </div>

                      {withdrawal.processedAt && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Processed</p>
                          <p className="font-semibold text-gray-900">{formatDate(withdrawal.processedAt)}</p>
                        </div>
                      )}

                      {withdrawal.adminNotes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Admin Notes:</p>
                          <p className="text-sm text-gray-800">{withdrawal.adminNotes}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Withdrawal Setup Modal */}
          {showWithdrawalSetup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Setup Withdrawal Information</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowWithdrawalSetup(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
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
                          <option value="bkash">Bkash</option>
                          <option value="nagad">Nagad</option>
                          <option value="roket">Roket</option>
                          <option value="bank">Bank</option>
                          <option value="usdt">USDT</option>
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

                    {/* Conditional Fields Based on Withdrawal Method */}
                    {formData.withdrawalMethod === 'bkash' && (
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Bkash Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="Enter Bkash mobile number (e.g., 01712345678)"
                          value={formData.mobileNumber}
                          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                          className="h-12"
                        />
                      </div>
                    )}

                    {formData.withdrawalMethod === 'nagad' && (
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Nagad Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="Enter Nagad mobile number (e.g., 01712345678)"
                          value={formData.mobileNumber}
                          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                          className="h-12"
                        />
                      </div>
                    )}

                    {formData.withdrawalMethod === 'roket' && (
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Roket Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="Enter Roket mobile number (e.g., 01712345678)"
                          value={formData.mobileNumber}
                          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                          className="h-12"
                        />
                      </div>
                    )}

                    {formData.withdrawalMethod === 'bank' && (
                      <>
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
                      </>
                    )}

                    {formData.withdrawalMethod === 'usdt' && (
                      <>
            <div className="space-y-2">
                          <Label htmlFor="usdtAddress">USDT Wallet Address</Label>
              <Input
                            id="usdtAddress"
                            placeholder="Enter USDT wallet address"
                            value={formData.usdtAddress}
                            onChange={(e) => handleInputChange('usdtAddress', e.target.value)}
                className="h-12"
              />
            </div>
                        <div className="space-y-2">
                          <Label htmlFor="usdtNetwork">USDT Network</Label>
                          <div className="relative">
                            <select
                              id="usdtNetwork"
                              value={formData.usdtNetwork}
                              onChange={(e) => handleInputChange('usdtNetwork', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none pr-10"
                            >
                              <option value="TRC20">TRC20 (Tron)</option>
                              <option value="ERC20">ERC20 (Ethereum)</option>
                              <option value="BEP20">BEP20 (BSC)</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

            {/* Identity Verification Documents */}
            <div className="space-y-3">
              <div>
                <Label>Identity Verification Documents <span className="text-red-500">*</span></Label>
                <p className="text-sm text-gray-600 mt-1">
                          Please submit your valid documentation for verification purpose. (National ID / Passport / Driving License)
                </p>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-teal-400 bg-teal-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                  <p className="text-xs text-gray-500">PNG or JPG up to <span className="text-blue-600 font-semibold">10MB</span> each</p>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Uploaded Documents:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileImage className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Document upload is required for verification</span>
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">Withdrawal information saved successfully!</p>
              </div>
            )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        className="flex-1 h-12 bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={handleWithdrawalSetup}
                        disabled={setupLoading || !formData.accountHolderName || uploadedFiles.length === 0}
                      >
                        {setupLoading ? 'Saving...' : 'Save Withdrawal Information'}
                      </Button>
            <Button
                        variant="outline" 
                        className="h-12 px-6"
                        onClick={() => setShowWithdrawalSetup(false)}
                      >
                        Cancel
            </Button>
          </div>
            </div>
          </div>
        </Card>
            </div>
          )}
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}