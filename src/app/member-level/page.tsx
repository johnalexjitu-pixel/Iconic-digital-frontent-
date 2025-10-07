"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Award, Star, Crown, Shield, Zap } from "lucide-react";
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";

export default function MemberLevelPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string; accountBalance?: number } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const memberLevels = [
    {
      name: "Bronze",
      icon: <Shield className="w-8 h-8 text-amber-600" />,
      color: "bg-amber-50 border-amber-200",
      textColor: "text-amber-700",
      requirements: "Account Balance: BDT 0 - BDT 10,000",
      benefits: [
        "Basic campaign access",
        "Standard support",
        "5% commission rate"
      ]
    },
    {
      name: "Silver",
      icon: <Star className="w-8 h-8 text-gray-600" />,
      color: "bg-gray-50 border-gray-200",
      textColor: "text-gray-700",
      requirements: "Account Balance: BDT 10,001 - BDT 50,000",
      benefits: [
        "Premium campaign access",
        "Priority support",
        "7% commission rate",
        "Daily check-in rewards"
      ]
    },
    {
      name: "Gold",
      icon: <Crown className="w-8 h-8 text-yellow-600" />,
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-700",
      requirements: "Account Balance: BDT 50,001 - BDT 100,000",
      benefits: [
        "Exclusive campaign access",
        "VIP support",
        "10% commission rate",
        "Weekly bonuses",
        "Referral rewards"
      ]
    },
    {
      name: "Platinum",
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
      requirements: "Account Balance: BDT 100,001+",
      benefits: [
        "All campaign access",
        "24/7 dedicated support",
        "15% commission rate",
        "Monthly bonuses",
        "Exclusive events",
        "Priority withdrawal"
      ]
    }
  ];

  const getCurrentLevel = () => {
    if (!user) return memberLevels[0];
    const balance = user.accountBalance || 0;
    if (balance >= 100001) return memberLevels[3];
    if (balance >= 50001) return memberLevels[2];
    if (balance >= 10001) return memberLevels[1];
    return memberLevels[0];
  };

  const currentLevel = getCurrentLevel();

  return (
    <div className="min-h-screen bg-white">
      <HomepageHeader user={user || undefined} />
      
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 font-lexend">Member Introduction</h1>
        </div>

        {/* Current Level Card */}
        <Card className={`p-6 mb-6 ${currentLevel.color} border-2`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full ${currentLevel.color} border`}>
                <span className={`text-sm font-semibold ${currentLevel.textColor}`}>
                  {currentLevel.name}
                </span>
              </div>
              <span className="text-sm text-gray-600">Member Introduction</span>
            </div>
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                {currentLevel.icon}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Current: {currentLevel.name}</h2>
            <p className="text-sm text-gray-600">{currentLevel.requirements}</p>
          </div>
        </Card>

        {/* Introduction Card */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              A staff member's daily income is determined by the individual account balance. 
              The higher the account balance, the higher the price of rated reviews that can be matched. 
              Therefore, the higher the commission ratio per rating review.
            </p>
            <p>
              To ensure the authenticity of the data, a deposit is required to optimize the process. 
              This deposit will be promptly returned after the rating review is completed. 
              To attract a larger audience, the seller requires improved sales data. 
              As a result, this review will generate virtual campaigns that can be converted into consumption data.
            </p>
          </div>
        </Card>

        {/* All Levels */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Member Levels</h3>
          {memberLevels.map((level, index) => (
            <Card key={index} className={`p-4 ${level.color} border`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {level.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${level.textColor}`}>{level.name}</h4>
                  <p className="text-sm text-gray-600">{level.requirements}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Benefits:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {level.benefits.map((benefit, idx) => (
                        <li key={idx}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <HomepageFooter activePage="account" />
    </div>
  );
}
