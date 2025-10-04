"use client";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Package } from "lucide-react";

export default function CampaignPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    avatar: "/placeholder-avatar.jpg"
  };

  const campaigns = [
    {
      id: "P1IT7024",
      code: "WPE02",
      brand: "TACO BELL",
      logo: "🌮",
      commission: "Rs 55,924",
      commissionRate: "10%",
      profit: "Rs 5,592",
      taskCode: "WPE02",
      status: "Completed"
    },
    {
      id: "P1IT7025",
      code: "OWEXPS",
      brand: "RENAULT",
      logo: "🚗",
      commission: "Rs 7,450",
      commissionRate: "1%",
      profit: "Rs 74",
      taskCode: "OWEXPS",
      status: "Completed"
    },
    {
      id: "P1IT7023",
      code: "V17EOB",
      brand: "LOUIS PHILLIPPE",
      logo: "👔",
      commission: "Rs 7,444",
      commissionRate: "1%",
      profit: "Rs 74",
      taskCode: "V17EOB",
      status: "Completed"
    },
    {
      id: "P1IT7022",
      code: "2024MZ",
      brand: "SHISEIDO",
      logo: "💄",
      commission: "Rs 7,184",
      commissionRate: "1%",
      profit: "Rs 71",
      taskCode: "2024MZ",
      status: "Completed"
    },
    {
      id: "P1IT7021",
      code: "CX135",
      brand: "ROCHAS",
      logo: "🌸",
      commission: "Rs 7,087",
      commissionRate: "1%",
      profit: "Rs 70",
      taskCode: "CX135",
      status: "Completed"
    },
    {
      id: "P1IT7020",
      code: "HZ7P05",
      brand: "INTEL",
      logo: "💻",
      commission: "Rs 6,871",
      commissionRate: "1%",
      profit: "Rs 68",
      taskCode: "HZ7P05",
      status: "Completed"
    },
    {
      id: "P1IT7019",
      code: "HZ6274",
      brand: "STELLA MCCARTNEY",
      logo: "👗",
      commission: "Rs 7,454",
      commissionRate: "1%",
      profit: "Rs 74",
      taskCode: "HZ6274",
      status: "Completed"
    },
    {
      id: "P1IT5276",
      code: "Y066A8",
      brand: "KAO",
      logo: "🧴",
      commission: "Rs 7,377",
      commissionRate: "1%",
      profit: "Rs 73",
      taskCode: "Y066A8",
      status: "Completed"
    }
  ];

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Product Campaigns</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Pending</TabsTrigger>
            <TabsTrigger value="completed" className="text-sm">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 border border-gray-200">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Campaign {campaign.id}</span>
                      <span className="text-sm text-gray-500">Code: {campaign.code}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {campaign.status}
                    </Badge>
                  </div>

                  {/* Brand Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {campaign.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.brand}</h3>
                      <p className="text-sm text-gray-500">@{campaign.brand.toLowerCase().replace(' ', '')}</p>
                    </div>
                  </div>

                  {/* Task Code and Profit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Task Code</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.taskCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.profit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-teal-600">{campaign.commission}</p>
                      <p className="text-xs text-gray-500">Commission: {campaign.commissionRate}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No pending campaigns</p>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 border border-gray-200">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Campaign {campaign.id}</span>
                      <span className="text-sm text-gray-500">Code: {campaign.code}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {campaign.status}
                    </Badge>
                  </div>

                  {/* Brand Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {campaign.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.brand}</h3>
                      <p className="text-sm text-gray-500">@{campaign.brand.toLowerCase().replace(' ', '')}</p>
                    </div>
                  </div>

                  {/* Task Code and Profit */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Task Code</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.taskCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Profit</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.profit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-teal-600">{campaign.commission}</p>
                      <p className="text-xs text-gray-500">Commission: {campaign.commissionRate}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
