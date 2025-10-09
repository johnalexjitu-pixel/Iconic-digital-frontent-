"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, Award, Star, Crown, Shield, Zap } from "lucide-react";
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";

interface VipLevel {
  _id: string;
  name: string;
  minAmount: number;
  taskCount: number;
  threeTask: string;
  commissionPercentage: number;
  comboCommissionPercentage: number;
  productRangeMin: number;
  productRangeMax: number;
  minwithdrawal: number;
  maxWithdrawal: number;
  completedTasksToWithdraw: number;
  withdrawalFees: number;
  createdAt: string;
  updatedAt: string;
}

export default function MemberLevelPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; level: string; avatar?: string; accountBalance?: number } | null>(null);
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVipLevels = useCallback(async () => {
    try {
      const response = await fetch('/api/vip-levels');
      const data = await response.json();
      
      if (data.success) {
        setVipLevels(data.data);
      } else {
        console.error('Failed to fetch VIP levels:', data.message);
      }
    } catch (error) {
      console.error('Error fetching VIP levels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchVipLevels();
  }, [fetchVipLevels]);

  // Helper function to get icon for level
  const getLevelIcon = (levelName: string) => {
    switch (levelName.toLowerCase()) {
      case 'bronze':
        return <Shield className="w-8 h-8 text-amber-600" />;
      case 'silver':
        return <Star className="w-8 h-8 text-gray-600" />;
      case 'gold':
        return <Crown className="w-8 h-8 text-yellow-600" />;
      case 'platinum':
        return <Zap className="w-8 h-8 text-purple-600" />;
      default:
        return <Award className="w-8 h-8 text-blue-600" />;
    }
  };

  // Helper function to get colors for level
  const getLevelColors = (levelName: string) => {
    switch (levelName.toLowerCase()) {
      case 'bronze':
        return {
          color: "bg-amber-50 border-amber-200",
          textColor: "text-amber-700"
        };
      case 'silver':
        return {
          color: "bg-gray-50 border-gray-200",
          textColor: "text-gray-700"
        };
      case 'gold':
        return {
          color: "bg-yellow-50 border-yellow-200",
          textColor: "text-yellow-700"
        };
      case 'platinum':
        return {
          color: "bg-purple-50 border-purple-200",
          textColor: "text-purple-700"
        };
      default:
        return {
          color: "bg-blue-50 border-blue-200",
          textColor: "text-blue-700"
        };
    }
  };

  // Convert VIP levels to display format
  const memberLevels = vipLevels.map((level, index) => {
    const nextLevel = vipLevels[index + 1];
    const maxAmount = nextLevel ? nextLevel.minAmount - 1 : Infinity;
    
    return {
      ...level,
      icon: getLevelIcon(level.name),
      ...getLevelColors(level.name),
      requirements: `Account Balance: BDT ${(level.minAmount || 0).toLocaleString()}${maxAmount !== Infinity ? ` - BDT ${maxAmount.toLocaleString()}` : '+'}`,
      benefits: [
        `${level.commissionPercentage || 0}% commission rate`,
        `${level.comboCommissionPercentage || 0}% combo commission`,
        `${level.taskCount || 0} tasks available`,
        `Min withdrawal: BDT ${(level.minwithdrawal || 0).toLocaleString()}`,
        `Max withdrawal: BDT ${(level.maxWithdrawal || 0).toLocaleString()}`,
        `${level.completedTasksToWithdraw || 0} tasks to withdraw`,
        (level.withdrawalFees || 0) === 0 ? "No withdrawal fees" : `Withdrawal fees: ${level.withdrawalFees || 0}%`
      ]
    };
  });

  const getCurrentLevel = () => {
    if (!user || memberLevels.length === 0) return null;
    const balance = user.accountBalance || 0;
    
    // Find the appropriate level based on balance
    for (let i = memberLevels.length - 1; i >= 0; i--) {
      if (balance >= memberLevels[i].minAmount) {
        return memberLevels[i];
      }
    }
    
    // If balance is below the minimum level, return the first level
    return memberLevels[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HomepageHeader user={user || undefined} />
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading member levels...</p>
            </div>
          </div>
        </div>
        <HomepageFooter activePage="account" />
      </div>
    );
  }

  const currentLevel = getCurrentLevel();

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-white">
        <HomepageHeader user={user || undefined} />
        <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <div className="text-center py-12">
            <p className="text-gray-600">No member levels available.</p>
          </div>
        </div>
        <HomepageFooter activePage="account" />
      </div>
    );
  }

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
        <Card className={`p-6 mb-6 ${currentLevel?.color || 'bg-gray-50 border-gray-200'} border-2`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full ${currentLevel?.color || 'bg-gray-50'} border`}>
                <span className={`text-sm font-semibold ${currentLevel?.textColor || 'text-gray-700'}`}>
                  {currentLevel?.name || 'Loading...'}
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
                {currentLevel?.icon || <Award className="w-8 h-8 text-blue-600" />}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Current: {currentLevel?.name || 'Loading...'}</h2>
            <p className="text-sm text-gray-600">{currentLevel?.requirements || 'Loading requirements...'}</p>
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
