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
    amount: "",
    withdrawalPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchWithdrawals(parsedUser._id);
    }
  }, []);

  const fetchWithdrawals = async (customerId: string) => {
    setHistoryLoading(true);
    try {
      const response = await apiClient.getWithdrawals(customerId);
      if (response.success) {
        setWithdrawals(response.data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setHistoryLoading(false);
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
    // Validate required fields based on withdrawal method
    let isValid = true;
    let errorMessage = '';
    
    if (!formData.amount || !formData.accountHolderName || uploadedFiles.length === 0) {
      isValid = false;
      errorMessage = 'Please fill all required fields and upload documents';
    }
    
    // Validate method-specific fields
    if (isValid) {
      switch (formData.withdrawalMethod) {
        case 'bkash':
        case 'nagad':
        case 'roket':
          if (!formData.mobileNumber) {
            isValid = false;
            errorMessage = 'Please enter mobile number';
          }
          break;
        case 'bank':
          if (!formData.bankName || !formData.accountNumber || !formData.branch) {
            isValid = false;
            errorMessage = 'Please fill all bank details';
          }
          break;
        case 'usdt':
          if (!formData.usdtAddress) {
            isValid = false;
            errorMessage = 'Please enter USDT wallet address';
          }
          break;
      }
    }
    
    if (!isValid) {
      alert(errorMessage);
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
      let accountDetails: any = {
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
        userId: user._id,
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
          uploadedDocuments: uploadResult.data.uploadedDocuments
        }
      });

      if (withdrawalInfoResponse.success) {
        // Create withdrawal request using the proper withdrawal endpoint
        const response = await apiClient.createWithdrawal({
          customerId: user._id,
          amount: parseFloat(formData.amount),
          method: formData.withdrawalMethod,
          accountDetails: accountDetails
        });

        if (response.success) {
          setSuccess(true);
          setFormData({
            withdrawalMethod: "bkash",
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            branch: "",
            mobileNumber: "",
            usdtAddress: "",
            usdtNetwork: "TRC20",
            amount: "",
            withdrawalPassword: ""
          });
          setUploadedFiles([]);
          // Refresh withdrawal history
          fetchWithdrawals(user._id);
          setTimeout(() => setSuccess(false), 3000);
        }
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      alert('Error creating withdrawal: ' + (error as Error).message);
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
                <p className="text-sm text-gray-600 mb-4">No withdrawal information set.</p>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Submit Withdrawal Information
                </Button>
              </Card>

              {/* Withdrawal Amount */}
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

                  {/* Withdrawal Password */}
                  <Input
                    placeholder="Enter your withdrawal password"
                    type="password"
                    value={formData.withdrawalPassword}
                    onChange={(e) => handleInputChange('withdrawalPassword', e.target.value)}
                    className="h-12"
                  />

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
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}