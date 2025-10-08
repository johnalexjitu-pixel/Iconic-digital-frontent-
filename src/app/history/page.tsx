"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar, DollarSign, RefreshCw } from "lucide-react";
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
  const [user, setUser] = useState<{ _id: string } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchCampaigns = useCallback(async (isRefresh = false) => {
    try {
      if (!user?._id) return;
      
      if (isRefresh) {
        setRefreshing(true);
      }
      
      console.log('🔄 Fetching completed tasks from database...');
      
      // Fetch completed campaign claims (this shows all completed tasks)
      const claimsResponse = await fetch(`/api/campaigns/complete?customerId=${user._id}`);
      const claimsData = await claimsResponse.json();
      
      console.log('📊 Claims response:', claimsData);
      
      if (claimsData.success && claimsData.data) {
        const claims = claimsData.data;
        console.log(`📋 Found ${claims.length} completed tasks`);
        
        // Convert completed claims to campaign format for history
        const campaignData: Campaign[] = claims.map((claim: Record<string, unknown>, index: number) => {
          const commissionEarned = typeof claim.commissionEarned === 'number' ? claim.commissionEarned : 0;
          const taskPrice = typeof claim.taskPrice === 'number' ? claim.taskPrice : 0;
          const commissionPercentage = commissionEarned > 0 && taskPrice > 0 ? Math.round((commissionEarned / taskPrice) * 100) : 0;
          
          console.log(`📝 Processing claim: ${claim.taskTitle} - Commission: ${commissionEarned}`);
          
          return {
            _id: typeof claim._id === 'object' && claim._id !== null ? claim._id.toString() : String(index),
            campaignId: typeof claim.campaignId === 'string' ? claim.campaignId : `CAMP-${index + 1}`,
            taskCode: generateTaskCode(),
            brand: typeof claim.taskTitle === 'string' ? claim.taskTitle : 'Completed Task',
            brandLogo: getBrandLogo(typeof claim.taskTitle === 'string' ? claim.taskTitle : ''),
            amount: taskPrice,
            commission: commissionEarned,
            commissionPercentage: commissionPercentage,
            profit: commissionEarned,
            status: 'completed',
            platform: typeof claim.platform === 'string' ? claim.platform : 'General',
            createdAt: typeof claim.claimedAt === 'string' ? claim.claimedAt : new Date().toISOString()
          };
        });
        
        console.log(`✅ Processed ${campaignData.length} campaigns for history`);
        setCampaigns(campaignData);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchCampaigns();
      
      // Auto-refresh campaigns every 30 seconds
      const interval = setInterval(() => {
        fetchCampaigns();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      router.push('/auth/login');
    }
  }, [router, fetchCampaigns]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchCampaigns(true);
  };

  // Helper function to generate task codes
  const generateTaskCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper function to get brand logo based on task title
  const getBrandLogo = (taskTitle: string) => {
    const brandLogos: { [key: string]: string } = {
      'PEPSICO': 'https://taanimagestore.online/SD01C03_422.png',
      'JAEGER-LECOULTRE': 'https://taanimagestore.online/SD01C03_419.png',
      'MAESA': 'https://taanimagestore.online/SD01C03_189.png',
      'CHANEL': 'https://taanimagestore.online/SD01C03_364.png',
      'DANIEL WELLINGTON': 'https://taanimagestore.online/SD01C03_485.png',
      'TACO BELL': 'https://taanimagestore.online/SD01C03_383.png',
      'RENAULT': 'https://taanimagestore.online/SD01C03_326.png',
      'LOUIS-PHILLIPPE': 'https://taanimagestore.online/SD01C03_101.png',
      'SHISEIDO': 'https://taanimagestore.online/SD01C03_179.png',
      'ROCHAS': 'https://taanimagestore.online/SD01C03_52.png',
      'INTEL': 'https://taanimagestore.online/SD01C03_24.png',
      'STELLA MCCARTNEY': 'https://taanimagestore.online/SD01C03_69.png',
      'KAO': 'https://taanimagestore.online/SD01C03_132.png'
    };
    
    return brandLogos[taskTitle] || '/logo/logo.png';
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
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
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
            <p className="text-gray-600 mb-4">Your campaign history will appear here</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </Card>
        )}
      </div>
      
      <HomepageFooter activePage="history" />
    </div>
  );
}