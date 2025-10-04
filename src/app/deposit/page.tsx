"use client";

import { useState, useEffect } from 'react';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Phone, Clock, Info, CheckCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from '@/lib/api-client';

interface Deposit {
  _id: string;
  id?: string;
  type: string;
  amount: number;
  method: string;
  status: string;
  description: string;
  createdAt: string;
  date?: string;
}

export default function DepositPage() {
  const [user, setUser] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDepositHistory();
  }, []);

  const fetchDepositHistory = async () => {
    try {
      const response = await apiClient.getTransactions();
      if (response.success && Array.isArray(response.data)) {
        const deposits = response.data.filter((t: Deposit) => t.type === 'deposit') || [];
        setDepositHistory(deposits);
      }
    } catch (error) {
      console.error('Error fetching deposit history:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !selectedMethod) return;
    
    setLoading(true);
    try {
      const response = await apiClient.createTransaction({
        type: 'deposit',
        amount: parseFloat(depositAmount),
        method: selectedMethod,
        status: 'processing',
        description: `Deposit via ${selectedMethod}`
      });

      if (response.success) {
        setSuccess(true);
        setDepositAmount('');
        setSelectedMethod('');
        fetchDepositHistory();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
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
          <h1 className="text-xl font-bold text-gray-900">Deposit</h1>
        </div>

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
                    <p className="text-2xl font-bold text-teal-600">Rs 61,076</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit Form */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Make a Deposit</h3>
                
                <div>
                  <Label htmlFor="amount">Deposit Amount (Rs)</Label>
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
                        value="Bank Transfer"
                        checked={selectedMethod === 'Bank Transfer'}
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
                        value="UPI Payment"
                        checked={selectedMethod === 'UPI Payment'}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="text-teal-600"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">U</span>
                        </div>
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-500">Instant payment via UPI</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

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
                <Card key={deposit.id} className="p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{deposit.method}</p>
                        <p className="text-sm text-gray-500">{deposit.date} • {deposit.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{deposit.amount}</p>
                      <p className="text-sm text-green-600">{deposit.status}</p>
                    </div>
                  </div>
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
