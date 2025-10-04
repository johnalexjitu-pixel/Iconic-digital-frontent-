"use client";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DailyCheckinPage() {
  const user = {
    name: "gokazi",
    level: "Silver",
    avatar: "/placeholder-avatar.jpg"
  };

  const rewards = [
    {
      day: 1,
      amount: "Rs 2000",
      claimed: true
    },
    {
      day: 2,
      amount: "Rs 4000",
      claimed: true
    },
    {
      day: 3,
      amount: "Rs 6000",
      claimed: true
    },
    {
      day: 4,
      amount: "Rs 8000",
      claimed: true
    },
    {
      day: 5,
      amount: "Rs 100000",
      claimed: false
    },
    {
      day: 6,
      amount: "Rs 150000",
      claimed: false
    },
    {
      day: 7,
      amount: "Rs 200000",
      claimed: false
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
          <h1 className="text-xl font-bold text-gray-900">Daily Check-In</h1>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            Earn rewards by checking in daily after completing your work! Claim your rewards below.
          </p>
        </Card>

        {/* Daily Rewards Grid */}
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
              </div>
            </div>
          ))}
        </div>

        {/* Current Status */}
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-teal-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Day 5 Reward</h3>
              <p className="text-2xl font-bold text-teal-600 mb-1">Rs 100,000</p>
              <p className="text-sm text-gray-600">Available to claim</p>
            </div>

            <Button
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl"
            >
              Claim Reward
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
    </AppLayout>
  );
}
