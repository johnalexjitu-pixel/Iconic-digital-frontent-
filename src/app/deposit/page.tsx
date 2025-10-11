"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Clock, X, MessageCircle, Calendar, CreditCard, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Deposit {
  _id: string;
  customerId: string;
  amount: number;
  method: 'bank_transfer' | 'mobile_banking' | 'cash' | 'other';
  transactionId?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  accountBalance: number;
  walletBalance?: number;
}

export default function DepositPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [showCustomerService, setShowCustomerService] = useState(false);

  // Helper function to format dates properly
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Helper function to get method display name
  const getMethodDisplayName = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'mobile_banking': return 'Mobile Banking';
      case 'cash': return 'Cash';
      case 'nagad': return 'Nagad';
      case 'bkash': return 'bKash';
      case 'rocket': return 'Rocket';
      case 'bank': return 'Bank Transfer';
      default: return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  // Helper function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Completed'
        };
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: 'Pending'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Rejected'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: status.charAt(0).toUpperCase() + status.slice(1)
        };
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('👤 User data from localStorage:', parsedUser);
      setUser(parsedUser);
      
      // Set balance from localStorage first
      if (parsedUser.accountBalance !== undefined) {
        console.log('💵 Setting balance from localStorage:', parsedUser.accountBalance);
        setUserBalance(parsedUser.accountBalance);
      }
      
      fetchDepositHistory(parsedUser._id);
      fetchUserBalance(parsedUser._id);
    }
  }, []);

  const fetchDepositHistory = async (customerId: string) => {
    try {
      const response = await fetch(`/api/deposits?customerId=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setDepositHistory(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching deposit history:', error);
    }
  };

  const fetchUserBalance = async (customerId: string) => {
    try {
      console.log('💰 Fetching user balance for customerId:', customerId);
      const response = await fetch(`/api/user?id=${customerId}`);
      console.log('📊 User balance response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📈 User balance data:', data);
        
        if (data.success && data.data) {
          const balance = data.data.accountBalance || data.data.walletBalance || 0;
          console.log('💵 Setting user balance to:', balance);
          setUserBalance(balance);
        }
      } else {
        console.error('❌ Failed to fetch user balance:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user ? { username: user.username, level: 'user' } : undefined} />
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Deposit</h1>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="deposit" className="text-sm">Deposit</TabsTrigger>
              <TabsTrigger value="history" className="text-sm">Deposit history</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-6 mt-6">
              {/* Wallet Balance Card */}
              <Card className="p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-600">BDT {userBalance.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              {/* Contact Customer Support Card */}
              <Card className="p-6 border border-gray-200">
                <div className="text-center space-y-4">
                  <p className="text-gray-700">Contact customer support for assistance with deposits.</p>
                  <Button
                    onClick={() => setShowCustomerService(true)}
                    className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
                  >
                    Contact Support
                  </Button>
                </div>
              </Card>

              {/* Important Notice Card */}
              <Card className="p-6 border border-gray-200">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Important Notice</h3>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-700">Operation Hours</p>
                      <p className="text-sm text-gray-600">Monday - Sunday: 10:00 AM to 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              <div className="space-y-4">
                {depositHistory.map((deposit) => {
                  const statusInfo = getStatusInfo(deposit.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <Card key={deposit._id} className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        {/* Header Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusInfo.bgColor}`}>
                              <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {getMethodDisplayName(deposit.method)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Transaction ID: {deposit._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              BDT {deposit.amount.toLocaleString()}
                            </p>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.text}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                          {/* Time Information */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Deposit Time</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">
                              {formatDate(deposit.submittedAt || deposit.createdAt)}
                            </p>
                            
                            {deposit.processedAt && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">Processed Time</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">
                                  {formatDate(deposit.processedAt)}
                                </p>
                              </>
                            )}
                          </div>

                          {/* Method & Reference Information */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Payment Method</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">
                              {getMethodDisplayName(deposit.method)}
                            </p>
                            
                            {deposit.transactionId && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Wallet className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">Reference</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6 font-mono">
                                  {deposit.transactionId}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Admin Notes */}
                        {deposit.adminNotes && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Admin Note</span>
                            </div>
                            <p className="text-sm text-blue-700">{deposit.adminNotes}</p>
                          </div>
                        )}

                        {/* Processed By */}
                        {deposit.processedBy && (
                          <div className="mt-2 text-xs text-gray-500">
                            Processed by: {deposit.processedBy}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {depositHistory.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Deposit History</h3>
                  <p className="text-sm text-gray-500">You haven't made any deposits yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Customer Service Popup */}
      {showCustomerService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Customer Service</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomerService(false)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-gray-600">How can we help you today?</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Contact Information:</p>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700">Telegram</span>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-2">Service Hours:</p>
                  <p className="text-gray-600">Monday - Sunday: 10:00 AM to 10:00 PM</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Contact Information:</p>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700">Telegram: t.me/Iconicdigital_customerservice_BD</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setShowCustomerService(false)}
                className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
              >
                Contact Us
              </Button>
            </div>
          </Card>
        </div>
      )}

      <HomepageFooter activePage="account" />
    </div>
  );
}

