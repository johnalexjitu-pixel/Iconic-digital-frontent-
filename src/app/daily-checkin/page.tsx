"use client";

import { useState, useEffect } from 'react';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, CheckCircle, Star, Clock } from "lucide-react";
import Link from "next/link";

interface CheckInData {
  canClaimToday: boolean;
  streak: number;
  totalCheckIns: number;
  totalAmountEarned: number;
  bonusAmounts: Array<{
    dayNumber: number;
    amount: number;
  }>;
  history: Array<{
    id: string;
    dayNumber: number;
    amount: number;
    createdAt: string;
  }>;
}

export default function DailyCheckinPage() {
  const [user, setUser] = useState(null);
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCheckInData();
  }, []);

  const fetchCheckInData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      if (!user._id) return;

      const response = await fetch(`/api/daily-checkin?userId=${user._id}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCheckInData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching check-in data:', error);
    }
  };

  const handleClaimReward = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const user = JSON.parse(userData);
      if (!user._id) {
        console.error('No user ID found');
        return;
      }

      const nextDayNumber = (checkInData?.totalCheckIns || 0) + 1;

      const response = await fetch('/api/daily-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          dayNumber: nextDayNumber
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess(true);
        fetchCheckInData();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to claim reward');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      setError('An error occurred while claiming the reward');
    } finally {
      setLoading(false);
    }
  };

  if (!checkInData) {
    return (
      <div className="min-h-screen bg-white">
        <HomepageHeader user={user || undefined} />
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading check-in data...</p>
            </div>
          </div>
        </div>
        <HomepageFooter activePage="account" />
      </div>
    );
  }

  const nextReward = checkInData.bonusAmounts.find(bonus => 
    bonus.dayNumber === (checkInData.totalCheckIns + 1)
  );

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
            Earn rewards by checking in daily! You can claim one bonus per day.
          </p>
        </Card>

        {/* Current Streak */}
        <Card className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-teal-600" />
              <h3 className="text-lg font-bold text-teal-800">Current Streak: {checkInData.streak} days</h3>
            </div>
            <p className="text-sm text-teal-600">
              Total earned: BDT {checkInData.totalAmountEarned.toLocaleString()}
            </p>
            <p className="text-sm text-teal-600">
              Total check-ins: {checkInData.totalCheckIns}
            </p>
          </div>
        </Card>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2">
              <p className="text-red-800">{error}</p>
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

        {/* Daily Check-in Button */}
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-teal-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {checkInData.canClaimToday ? 'Daily Check-in Bonus' : 'Already Claimed Today'}
              </h3>
              {nextReward && (
                <p className="text-2xl font-bold text-teal-600 mb-1">
                  BDT {nextReward.amount.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-600">
                {checkInData.canClaimToday ? 'Available to claim now!' : 'Come back tomorrow for your next reward'}
              </p>
            </div>

            <Button
              onClick={handleClaimReward}
              disabled={loading || !checkInData.canClaimToday}
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl disabled:bg-gray-300"
            >
              {loading ? 'Claiming...' : checkInData.canClaimToday ? 'Claim Daily Bonus' : 'Already Claimed Today'}
            </Button>
          </div>
        </Card>

        {/* Progress Info */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Check-in Streak</h4>
              <p className="text-sm text-amber-700">
                You've checked in for {checkInData.streak} consecutive days! Keep going to maintain your streak.
              </p>
            </div>
          </div>
        </Card>

        {/* Bonus Schedule */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Daily Bonus Schedule</h4>
          <div className="grid grid-cols-2 gap-2">
            {checkInData.bonusAmounts.slice(0, 10).map((bonus, index) => (
              <div key={`bonus-${bonus.dayNumber}-${index}`} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Day {bonus.dayNumber}</span>
                <span className="text-sm font-bold text-teal-600">BDT {bonus.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
          {checkInData.bonusAmounts.length > 10 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              And {checkInData.bonusAmounts.length - 10} more days...
            </p>
          )}
        </Card>

        {/* Rules */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Rules & Guidelines</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>You can claim one daily check-in bonus per day</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>Each day has a different bonus amount as shown in the schedule</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <p>Missing a day will reset your check-in streak</p>
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
