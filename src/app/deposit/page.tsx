"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Phone, Clock, Info, CheckCircle, AlertCircle } from "lucide-react";
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
}

export default function DepositPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(0);

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
          setUserBalance(data.data.accountBalance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !selectedMethod || !user?._id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user._id,
          amount: parseFloat(depositAmount),
          method: selectedMethod,
          transactionId: transactionId || undefined
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setDepositAmount('');
        setSelectedMethod('');
        setTransactionId('');
        fetchDepositHistory(user._id);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to submit deposit request');
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
      setError('Failed to submit deposit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user ? { name: user.name, level: 'user' } : undefined} />
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Deposit</h1>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="deposit" className="text-sm">Deposit</TabsTrigger>
            <TabsTrigger value="history" className="text-sm">Deposit history</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-6 mt-6">
            {/* Wallet Balance */}
            <Card className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                    <p className="text-2xl font-bold text-teal-600">BDT {userBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit Form */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Make a Deposit</h3>
                
                <div>
                  <Label htmlFor="amount">Deposit Amount (BDT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="method"
                        value="bank_transfer"
                        checked={selectedMethod === 'bank_transfer'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="text-teal-600"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">B</span>
                        </div>
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-gray-500">Direct bank account transfer</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="method"
                        value="mobile_banking"
                        checked={selectedMethod === 'mobile_banking'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="text-teal-600"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">M</span>
                        </div>
                        <div>
                          <p className="font-medium">Mobile Banking</p>
                          <p className="text-sm text-gray-500">bKash, Rocket, Nagad, etc.</p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="method"
                        value="cash"
                        checked={selectedMethod === 'cash'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="text-teal-600"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-sm">C</span>
                        </div>
                        <div>
                          <p className="font-medium">Cash</p>
                          <p className="text-sm text-gray-500">Physical cash deposit</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {(selectedMethod === 'bank_transfer' || selectedMethod === 'mobile_banking') && (
                  <div>
                    <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                    <Input
                      id="transactionId"
                      type="text"
                      placeholder="Enter transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800">Deposit request submitted successfully!</p>
                  </div>
                )}

                <Button
                  onClick={handleDeposit}
                  disabled={!depositAmount || !selectedMethod || loading}
                  className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
                >
                  {loading ? 'Processing...' : 'Submit Deposit Request'}
                </Button>
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-teal-600" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600">Contact customer support for assistance with deposits.</p>
                </div>

                <Button
                  className="w-full h-12 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl"
                >
                  Contact Support
                </Button>
              </div>
            </Card>

            {/* Important Notice */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Important Notice</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-medium">Operation Hours</p>
                        <p>Monday - Sunday: 8:00 AM to 9:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit Methods */}
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Available Deposit Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">B</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bank Transfer</p>
                      <p className="text-sm text-gray-500">Direct bank account transfer</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">U</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">UPI Payment</p>
                      <p className="text-sm text-gray-500">Instant payment via UPI</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">W</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Digital Wallet</p>
                      <p className="text-sm text-gray-500">Coming soon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>Disabled</Button>
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
      <HomepageFooter activePage="account" />
    </div>
  );
}

