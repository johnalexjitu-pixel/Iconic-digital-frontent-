"use client";

import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Clock
} from "lucide-react";

export default function HistoryPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    avatar: "/placeholder-avatar.jpg"
  };

  const transactions = [
    {
      id: "TXN001",
      type: "campaign_earning",
      amount: "+Rs 5,592",
      description: "Campaign P1IT7024 - TACO BELL",
      date: "2024-01-15",
      time: "14:30",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-green-600"
    },
    {
      id: "TXN002",
      type: "withdrawal",
      amount: "-Rs 10,000",
      description: "Withdrawal to Bank Account",
      date: "2024-01-14",
      time: "10:15",
      status: "processing",
      icon: ArrowDownLeft,
      color: "text-red-600"
    },
    {
      id: "TXN003",
      type: "campaign_earning",
      amount: "+Rs 74",
      description: "Campaign P1IT7025 - RENAULT",
      date: "2024-01-13",
      time: "16:45",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-green-600"
    },
    {
      id: "TXN004",
      type: "deposit",
      amount: "+Rs 50,000",
      description: "Bank Deposit - Account Transfer",
      date: "2024-01-12",
      time: "09:20",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-blue-600"
    },
    {
      id: "TXN005",
      type: "campaign_earning",
      amount: "+Rs 74",
      description: "Campaign P1IT7023 - LOUIS PHILLIPPE",
      date: "2024-01-11",
      time: "13:30",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-green-600"
    },
    {
      id: "TXN006",
      type: "daily_bonus",
      amount: "+Rs 100",
      description: "Daily Check-in Bonus - Day 7",
      date: "2024-01-10",
      time: "08:00",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-purple-600"
    }
  ];

  const campaignHistory = [
    {
      id: "P1IT7024",
      brand: "TACO BELL",
      logo: "🌮",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      status: "completed",
      earnings: "Rs 5,592",
      commission: "10%"
    },
    {
      id: "P1IT7025",
      brand: "RENAULT",
      logo: "🚗",
      startDate: "2024-01-13",
      endDate: "2024-01-13",
      status: "completed",
      earnings: "Rs 74",
      commission: "1%"
    },
    {
      id: "P1IT7023",
      brand: "LOUIS PHILLIPPE",
      logo: "👔",
      startDate: "2024-01-11",
      endDate: "2024-01-11",
      status: "completed",
      earnings: "Rs 74",
      commission: "1%"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="all" className="text-sm">All Transactions</TabsTrigger>
            <TabsTrigger value="campaigns" className="text-sm">Campaigns</TabsTrigger>
            <TabsTrigger value="payments" className="text-sm">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {transactions.map((transaction) => {
              const Icon = transaction.icon;
              return (
                <Card key={transaction.id} className="p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <Icon className={`w-4 h-4 ${transaction.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{transaction.date}</span>
                          <Clock className="w-3 h-3" />
                          <span>{transaction.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.color}`}>{transaction.amount}</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4 mt-6">
            {campaignHistory.map((campaign) => (
              <Card key={campaign.id} className="p-4 border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                        {campaign.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{campaign.brand}</h3>
                        <p className="text-sm text-gray-500">Campaign {campaign.id}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {campaign.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="text-gray-900">{campaign.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p className="text-gray-900">{campaign.endDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-teal-600">{campaign.earnings}</p>
                      <p className="text-xs text-gray-500">Commission: {campaign.commission}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 mt-6">
            {transactions.filter(t => t.type === 'withdrawal' || t.type === 'deposit').map((transaction) => {
              const Icon = transaction.icon;
              return (
                <Card key={transaction.id} className="p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <Icon className={`w-4 h-4 ${transaction.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{transaction.date}</span>
                          <Clock className="w-3 h-3" />
                          <span>{transaction.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.color}`}>{transaction.amount}</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
