"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar, DollarSign } from "lucide-react";
import { apiClient } from '@/lib/api-client';

interface Campaign {
  _id: string;
  campaignId: string;
  taskCode: string;
  brand: string;
  brandLogo: string;
  amount: number;
  commission: number;
  commissionPercentage: number;
  profit: number;
  status: 'pending' | 'completed';
  platform: string;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchCampaigns();
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const fetchCampaigns = async () => {
    try {
      // Mock campaign data for demonstration
      const mockCampaigns: Campaign[] = [
        {
          _id: '1',
          campaignId: '1117084',
          taskCode: 'TX36S7',
          brand: 'PEPSICO',
          brandLogo: 'https://taanimagestore.online/SD01C03_422.png',
          amount: 19239,
          commission: 1,
          commissionPercentage: 1,
          profit: 192,
          status: 'pending',
          platform: 'Instagram',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          campaignId: '1117083',
          taskCode: 'FV49S5',
          brand: 'JAEGER-LECOULTRE',
          brandLogo: 'https://taanimagestore.online/SD01C03_419.png',
          amount: 16489,
          commission: 1,
          commissionPercentage: 1,
          profit: 164,
          status: 'completed',
          platform: 'Facebook',
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          campaignId: '1117082',
          taskCode: 'VW19J2',
          brand: 'MAESA',
          brandLogo: 'https://taanimagestore.online/SD01C03_189.png',
          amount: 31512,
          commission: 1,
          commissionPercentage: 1,
          profit: 315,
          status: 'completed',
          platform: 'Pinterest',
          createdAt: new Date().toISOString()
        },
        {
          _id: '4',
          campaignId: '1117081',
          taskCode: 'MN38O2',
          brand: 'CHANEL',
          brandLogo: 'https://taanimagestore.online/SD01C03_364.png',
          amount: 63317,
          commission: 10,
          commissionPercentage: 10,
          profit: 6331,
          status: 'completed',
          platform: 'TikTok',
          createdAt: new Date().toISOString()
        },
        {
          _id: '5',
          campaignId: '1117080',
          taskCode: 'KG91E7',
          brand: 'DANIEL WELLINGTON',
          brandLogo: 'https://taanimagestore.online/SD01C03_485.png',
          amount: 24168,
          commission: 1,
          commissionPercentage: 1,
          profit: 241,
          status: 'completed',
          platform: 'Twitter',
          createdAt: new Date().toISOString()
        },
        {
          _id: '6',
          campaignId: '1117024',
          taskCode: 'YP58S2',
          brand: 'TACO BELL',
          brandLogo: 'https://taanimagestore.online/SD01C03_383.png',
          amount: 55524,
          commission: 10,
          commissionPercentage: 10,
          profit: 5552,
          status: 'completed',
          platform: 'Instagram',
          createdAt: new Date().toISOString()
        },
        {
          _id: '7',
          campaignId: '1117025',
          taskCode: 'WW48P5',
          brand: 'RENAULT',
          brandLogo: 'https://taanimagestore.online/SD01C03_326.png',
          amount: 7450,
          commission: 1,
          commissionPercentage: 1,
          profit: 74,
          status: 'completed',
          platform: 'Facebook',
          createdAt: new Date().toISOString()
        },
        {
          _id: '8',
          campaignId: '1117023',
          taskCode: 'XY19D8',
          brand: 'LOUIS-PHILLIPPE',
          brandLogo: 'https://taanimagestore.online/SD01C03_101.png',
          amount: 7444,
          commission: 1,
          commissionPercentage: 1,
          profit: 74,
          status: 'completed',
          platform: 'Pinterest',
          createdAt: new Date().toISOString()
        },
        {
          _id: '9',
          campaignId: '1117022',
          taskCode: 'ZQ24H2',
          brand: 'SHISEIDO',
          brandLogo: 'https://taanimagestore.online/SD01C03_179.png',
          amount: 7184,
          commission: 1,
          commissionPercentage: 1,
          profit: 71,
          status: 'completed',
          platform: 'TikTok',
          createdAt: new Date().toISOString()
        },
        {
          _id: '10',
          campaignId: '1117021',
          taskCode: 'CK13J5',
          brand: 'ROCHAS',
          brandLogo: 'https://taanimagestore.online/SD01C03_52.png',
          amount: 7087,
          commission: 1,
          commissionPercentage: 1,
          profit: 70,
          status: 'completed',
          platform: 'Twitter',
          createdAt: new Date().toISOString()
        },
        {
          _id: '11',
          campaignId: '1117020',
          taskCode: 'HZ79Q5',
          brand: 'INTEL',
          brandLogo: 'https://taanimagestore.online/SD01C03_24.png',
          amount: 8821,
          commission: 1,
          commissionPercentage: 1,
          profit: 88,
          status: 'completed',
          platform: 'Instagram',
          createdAt: new Date().toISOString()
        },
        {
          _id: '12',
          campaignId: '1117019',
          taskCode: 'HC92Y4',
          brand: 'STELLA MCCARTNEY',
          brandLogo: 'https://taanimagestore.online/SD01C03_69.png',
          amount: 7454,
          commission: 1,
          commissionPercentage: 1,
          profit: 74,
          status: 'completed',
          platform: 'Facebook',
          createdAt: new Date().toISOString()
        },
        {
          _id: '13',
          campaignId: '1115276',
          taskCode: 'YQ66A6',
          brand: 'KAO',
          brandLogo: 'https://taanimagestore.online/SD01C03_132.png',
          amount: 7377,
          commission: 1,
          commissionPercentage: 1,
          profit: 73,
          status: 'completed',
          platform: 'Pinterest',
          createdAt: new Date().toISOString()
        }
      ];
      
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCampaigns = () => {
    switch (activeTab) {
      case 'pending':
        return campaigns.filter(c => c.status === 'pending');
      case 'completed':
        return campaigns.filter(c => c.status === 'completed');
      default:
        return campaigns;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <div className="min-h-screen bg-gray-50">
      <HomepageHeader />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Product Campaigns</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 cursor-pointer py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`flex-1 cursor-pointer py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pending' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`flex-1 cursor-pointer py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => (
            <Card key={campaign._id} className="bg-white rounded-lg overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              {/* Campaign Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">Campaign #{campaign.campaignId}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-xs text-gray-500">Code: {campaign.taskCode}</span>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={`justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    campaign.status === 'pending' 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-green-600 bg-green-50'
                  }`}>
                    {campaign.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {campaign.status === 'pending' ? 'Pending' : 'Completed'}
                  </Badge>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden">
                    <img 
                      alt={campaign.brand} 
                      className="w-full h-full object-cover" 
                      src={campaign.brandLogo}
                    />
                  </div>
                  <div className="flex flex-1 justify-between mt-2 sm:mt-0">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-gray-800 text-lg">{campaign.brand}</h3>
                      <span className="text-sm text-gray-500 font-medium">gokazi</span>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-semibold">BDT {campaign.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Commission: {campaign.commissionPercentage}%</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100"></div>

                {/* Task Details */}
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">Task Code</p>
                    </div>
                    <p>{campaign.taskCode}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">Profit</p>
                    </div>
                    <p className="text-green-600">BDT {campaign.profit.toLocaleString()}</p>
                  </div>
                </div>

                {/* Action Button - Only for pending campaigns */}
                {campaign.status === 'pending' && (
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                      Continue Campaign
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600">Your campaign history will appear here</p>
          </Card>
        )}
      </div>
      
      <HomepageFooter activePage="history" />
    </div>
  );
}