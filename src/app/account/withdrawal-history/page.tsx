"use client";

import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, DollarSign, Calendar } from "lucide-react";
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

export default function WithdrawalHistoryPage() {
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string } | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchWithdrawals(JSON.parse(userData)._id);
    }
  }, []);

  const fetchWithdrawals = async (customerId: string) => {
    try {
      const response = await apiClient.getWithdrawals(customerId);
      if (response.success) {
        setWithdrawals(response.data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
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
        return <XCircle className="w-4 h-4 text-red-500" />;
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

  const getAccountDetailsDisplay = (withdrawal: WithdrawalRecord) => {
    switch (withdrawal.method) {
      case 'bkash':
      case 'nagad':
      case 'roket':
        return `Mobile: ${withdrawal.accountDetails.mobileNumber}`;
      case 'bank':
        return `${withdrawal.accountDetails.bankName} - ${withdrawal.accountDetails.accountNumber}`;
      case 'usdt':
        return `${withdrawal.accountDetails.usdtNetwork}: ${withdrawal.accountDetails.usdtAddress?.slice(0, 10)}...`;
      default:
        return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HomepageHeader user={user || undefined} />
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading withdrawal history...</p>
            </div>
          </div>
        </div>
        <HomepageFooter activePage="account" />
      </div>
    );
  }

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
            <h1 className="text-xl font-bold text-gray-900">Withdrawal History</h1>
          </div>

          {/* Withdrawals List */}
          {withdrawals.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Withdrawals Yet</h3>
              <p className="text-gray-600 mb-4">You haven't made any withdrawal requests yet.</p>
              <Link href="/account/withdrawal">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  Make First Withdrawal
                </Button>
              </Link>
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
                          {getAccountDetailsDisplay(withdrawal)}
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
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p className="font-semibold text-gray-900">{withdrawal.accountDetails.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-semibold text-gray-900">{getMethodDisplayName(withdrawal.method)}</p>
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

          {/* Summary Stats */}
          {withdrawals.length > 0 && (
            <Card className="p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Withdrawal Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{withdrawals.length}</p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {withdrawals.filter(w => w.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {withdrawals.filter(w => w.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {withdrawals.filter(w => w.status === 'processing').length}
                  </p>
                  <p className="text-sm text-gray-600">Processing</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
