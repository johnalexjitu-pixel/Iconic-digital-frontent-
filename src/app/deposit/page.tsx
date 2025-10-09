"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Clock, X, MessageCircle } from "lucide-react";
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
  email: string;
  name: string;
  accountBalance: number;
  walletBalance?: number;
}

export default function DepositPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [showCustomerService, setShowCustomerService] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
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
      const response = await fetch(`/api/user?id=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUserBalance(data.data.accountBalance || data.data.walletBalance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user ? { name: user.name, level: 'user' } : undefined} />
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
                {depositHistory.map((deposit) => (
                  <Card key={deposit._id} className="p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          deposit.status === 'approved' ? 'bg-green-100' :
                          deposit.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <Wallet className={`w-5 h-5 ${
                            deposit.status === 'approved' ? 'text-green-600' :
                            deposit.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {deposit.method === 'bank_transfer' ? 'Bank Transfer' :
                             deposit.method === 'mobile_banking' ? 'Mobile Banking' :
                             deposit.method === 'cash' ? 'Cash' : 'Other'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(deposit.submittedAt).toLocaleDateString()} • {deposit._id.slice(-8)}
                          </p>
                          {deposit.transactionId && (
                            <p className="text-xs text-gray-400">TXN: {deposit.transactionId}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">BDT {deposit.amount.toLocaleString()}</p>
                        <p className={`text-sm ${
                          deposit.status === 'approved' ? 'text-green-600' :
                          deposit.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    {deposit.adminNotes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Admin Note:</strong> {deposit.adminNotes}
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {depositHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No deposit history found</p>
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

