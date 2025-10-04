"use client";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Wallet, Phone, Clock, Info } from "lucide-react";
import Link from "next/link";

export default function DepositPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    avatar: "/placeholder-avatar.jpg"
  };

  const depositHistory = [
    {
      id: "DEP001",
      amount: "Rs 50,000",
      method: "Bank Transfer",
      date: "2024-01-12",
      status: "Completed"
    },
    {
      id: "DEP002",
      amount: "Rs 25,000",
      method: "UPI Payment",
      date: "2024-01-05",
      status: "Completed"
    }
  ];

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

            {/* Contact Support */}
            <Card className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-teal-600" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Contact customer support for assistance with deposits.</h3>
                </div>

                <Button
                  className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
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
    </AppLayout>
  );
}
