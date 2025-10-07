"use client";

import { useState, useEffect } from 'react';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, CheckCircle, Star } from "lucide-react";
import Link from "next/link";
import { apiClient } from '@/lib/api-client';

interface Reward {
  day: number;
  amount: string;
  claimed: boolean;
}

export default function DailyCheckinPage() {
  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getUserLevel = () => {
    if (!user) return 'Bronze';
    const balance = user.accountBalance || 0;
    if (balance >= 100001) return 'Platinum';
    if (balance >= 50001) return 'Gold';
    if (balance >= 10001) return 'Silver';
    return 'Bronze';
  };

  const userLevel = getUserLevel();
  const canCheckIn = userLevel !== 'Bronze';

  const fetchRewards = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success && response.data) {
        const userData = response.data as Record<string, unknown>;
        const dailyCheckIn = (userData.dailyCheckIn as { streak: number; daysClaimed: number[] }) || { streak: 0, daysClaimed: [] };
        
        // Generate rewards based on user data
        const rewardsData = Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          amount: `Rs ${(i + 1) * 2000}`,
          claimed: dailyCheckIn.daysClaimed.includes(i + 1)
        }));
        
        setRewards(rewardsData);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const handleClaimReward = async (day: number) => {
    setLoading(true);
    try {
      const response = await apiClient.updateUserProfile({
        dailyCheckIn: {
          streak: day,
          daysClaimed: [...rewards.filter(r => r.claimed).map(r => r.day), day]
        }
      });

      if (response.success) {
        setSuccess(true);
        fetchRewards();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentStreak = rewards.filter(r => r.claimed).length;
  const nextReward = rewards.find(r => !r.claimed);

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
          <h1 className="text-xl font-bold text-gray-900">Daily Check-In</h1>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            Earn rewards by checking in daily after completing your work! Claim your rewards below.
          </p>
        </Card>

        {/* Level Requirement Notice */}
        {!canCheckIn && (
          <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Daily Check-In Not Available</h3>
              <p className="text-amber-700 mb-4">
                Daily check-in rewards are available for <strong>Silver level</strong> and above members.
              </p>
              <div className="bg-white rounded-lg p-4 border border-amber-200 mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Level: <strong className="text-amber-600">{userLevel}</strong></p>
                <p className="text-sm text-gray-600 mb-2">Required Level: <strong className="text-green-600">Silver+</strong></p>
                <p className="text-sm text-gray-600">Account Balance Required: <strong>BDT 10,001+</strong></p>
              </div>
              <p className="text-sm text-amber-600">
                Increase your account balance to BDT 10,001+ to unlock daily check-in rewards!
              </p>
            </div>
          </Card>
        )}

        {/* Current Streak */}
        {canCheckIn && (
          <Card className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-bold text-teal-800">Current Streak: {currentStreak} days</h3>
              </div>
              <p className="text-sm text-teal-600">
                {nextReward ? `Next reward: ${nextReward.amount} on day ${nextReward.day}` : 'All rewards claimed!'}
              </p>
            </div>
          </Card>
        )}

        {success && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">Reward claimed successfully!</p>
            </div>
          </Card>
        )}

        {/* Daily Rewards Grid */}
        {canCheckIn && (
          <div className="grid grid-cols-7 gap-2">
            {rewards.map((reward) => (
              <div key={reward.day} className="text-center">
                <div className={`relative p-3 rounded-lg border-2 ${
                  reward.claimed
                    ? 'bg-teal-50 border-teal-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  {/* Gift Icon */}
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    reward.claimed
                      ? 'bg-teal-100'
                      : 'bg-gray-100'
                  }`}>
                    <Gift className={`w-4 h-4 ${
                      reward.claimed ? 'text-teal-600' : 'text-gray-400'
                    }`} />
                  </div>

                  {/* Check Mark for Claimed */}
                  {reward.claimed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Day Label */}
                  <p className="text-xs font-medium text-gray-600 mb-1">Day {reward.day}</p>

                  {/* Amount */}
                  <p className={`text-xs font-bold ${
                    reward.claimed ? 'text-teal-600' : 'text-gray-500'
                  }`}>
                    {reward.amount}
                  </p>

                  {/* Claim Button */}
                  {!reward.claimed && (
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(reward.day)}
                      disabled={loading}
                      className="w-full mt-2 h-6 text-xs"
                    >
                      Claim
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Status */}
        {canCheckIn && (
          <Card className="p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                <Gift className="w-8 h-8 text-teal-600" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Day 5 Reward</h3>
                <p className="text-2xl font-bold text-teal-600 mb-1">BDT 100,000</p>
                <p className="text-sm text-gray-600">Available to claim</p>
              </div>

              <Button
                className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
              >
                Claim Reward
              </Button>
            </div>
          </Card>
        )}

        {/* Progress Info */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Check-in Streak</h4>
              <p className="text-sm text-amber-700">
                You've checked in for 4 consecutive days! Keep going to unlock bigger rewards.
              </p>
            </div>
          </div>
        </Card>

        {/* Rules */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Rules & Guidelines</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>Complete at least one campaign task daily to be eligible for check-in rewards</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>Rewards must be claimed within 24 hours or they will expire</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>Missing a day will reset your check-in streak back to Day 1</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>Bonus rewards are credited directly to your account balance</p>
            </div>
          </div>
        </Card>
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
