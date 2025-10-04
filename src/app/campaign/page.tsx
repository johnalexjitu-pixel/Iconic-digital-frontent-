"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Clock, DollarSign, Star, ArrowRight, Gift } from "lucide-react";
import { apiClient } from '@/lib/api-client';

interface Campaign {
  _id: string;
  title: string;
  description: string;
  status: string;
  reward: number;
  participants: number;
  duration: number;
  createdAt: string;
}

interface UserStats {
  accountBalance: number;
  campaignsCompleted: number;
  totalEarnings: number;
  todayCommission: number;
  withdrawalAmount: number;
}

export default function CampaignPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    accountBalance: 0,
    campaignsCompleted: 0,
    totalEarnings: 0,
    todayCommission: 0,
    withdrawalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);
      fetchCampaigns();
      fetchUserStats();
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const fetchCampaigns = async () => {
    try {
      const response = await apiClient.getCampaigns();
      if (response.success && Array.isArray(response.data)) {
        setCampaigns(response.data);
      } else {
        // If API fails, show empty state
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success && response.data) {
        const userData = response.data as Record<string, unknown>;
        setUserStats({
          accountBalance: (userData.accountBalance as number) || 0,
          campaignsCompleted: (userData.campaignsCompleted as number) || 0,
          totalEarnings: (userData.totalEarnings as number) || 0,
          todayCommission: 0, // This would be calculated from today's transactions
          withdrawalAmount: 0 // This would be calculated from pending withdrawals
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleJoinCampaign = async (campaignId: string) => {
    try {
      const response = await apiClient.joinCampaign(campaignId);
      if (response.success) {
        fetchCampaigns(); // Refresh campaigns
      }
    } catch (error) {
      console.error('Error joining campaign:', error);
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

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user} />
      
      {/* Mobile Video Background */}
      <div className="relative bg-gray-800 py-8 md:hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/homepage/herovideo.mp4" type="video/mp4" />
        </video>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white mb-2 font-lexend">Campaign Center</h1>
          <p className="text-white/90 font-lexend">Join campaigns to earn rewards and grow your account</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        <div className="space-y-6">
        {/* Desktop Header */}
        <div className="text-center hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Campaigns</h1>
          <p className="text-gray-600">Join campaigns to earn rewards and grow your account</p>
        </div>

        {/* User Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-teal-50 border-teal-200">
            <div className="text-center">
              <p className="text-sm text-teal-600 font-medium mb-1">Account Balance</p>
              <p className="text-xl font-bold text-teal-800">Rs {userStats.accountBalance.toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium mb-1">Campaigns</p>
              <p className="text-xl font-bold text-blue-800">{userStats.campaignsCompleted}/30</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium mb-1">Today's Commission</p>
              <p className="text-xl font-bold text-green-800">Rs {userStats.todayCommission.toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-center">
              <p className="text-sm text-orange-600 font-medium mb-1">Withdrawal</p>
              <p className="text-xl font-bold text-orange-800">Rs {userStats.withdrawalAmount.toLocaleString()}</p>
            </div>
          </Card>
        </div>

        {/* Daily Check-in Campaign */}
        <Card className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Check-In Rewards</h3>
            <p className="text-gray-600 mb-4">Earn rewards by checking in daily after completing your work!</p>
            
            {/* Daily Rewards */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {[2000, 4000, 6000, 8000, 100000, 150000, 200000].map((amount, index) => (
                <div key={index} className="bg-white rounded-lg p-3 text-center border border-teal-200">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Day {index + 1}</p>
                  <p className="text-sm font-bold text-teal-600">Rs {amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => router.push('/daily-checkin')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3"
            >
              <Gift className="w-5 h-5 mr-2" />
              Claim Daily Rewards
            </Button>
          </div>
        </Card>

        {/* Launch Campaign Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => router.push('/deposit')}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg font-semibold"
          >
            <ArrowRight className="w-6 h-6 mr-2" />
            Launch Campaign
          </Button>
        </div>

        {/* Available Campaigns */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Campaigns</h2>
          {campaigns.length > 0 ? (
            campaigns.map((campaign: Campaign) => (
              <Card key={campaign._id} className="p-6">
                <div className="space-y-4">
                  {/* Campaign Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>
                      <p className="text-gray-600">{campaign.description}</p>
                    </div>
                    <Badge className={`${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </Badge>
                  </div>

                  {/* Campaign Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Reward</span>
                    </div>
                      <p className="font-bold text-green-600">Rs {campaign.reward}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Participants</span>
                      </div>
                      <p className="font-bold text-blue-600">{campaign.participants || 0}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">Duration</span>
                    </div>
                      <p className="font-bold text-orange-600">{campaign.duration} days</p>
                    </div>
                  </div>

                  {/* Campaign Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleJoinCampaign(campaign._id)}
                      disabled={campaign.status !== 'active'}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      {campaign.status === 'active' ? 'Join Campaign' : 'Campaign Ended'}
                    </Button>
                    <Button variant="outline" className="px-4">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Available</h3>
              <p className="text-gray-600">Check back later for new campaigns to join!</p>
            </Card>
          )}
        </div>
        </div>
      </div>
      <HomepageFooter activePage="campaign" />
    </div>
  );
}