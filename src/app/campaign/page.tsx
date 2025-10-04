"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Clock, DollarSign, Star } from "lucide-react";
import { apiClient } from '@/lib/api-client';

export default function CampaignPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const response = await apiClient.getCampaigns();
      if (response.success) {
        setCampaigns(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
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
    <AppLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Available Campaigns</h1>
          <p className="text-gray-600">Join campaigns to earn rewards and grow your account</p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-6">
          {campaigns.length > 0 ? (
            campaigns.map((campaign: any) => (
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
    </AppLayout>
  );
}