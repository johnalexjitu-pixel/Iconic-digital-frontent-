"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Users, Calendar, Play, CheckCircle, Clock, AlertCircle, Gift, Star } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface CustomerTask {
  _id: string;
  customerId: string;
  taskNumber: number;
  taskPrice: number;
  taskCommission: number;
  taskTitle: string;
  taskDescription: string;
  platform: string;
  status: 'pending' | 'active' | 'completed' | 'claimed';
  claimedAt?: string;
  completedAt?: string;
  isClaimed: boolean;
  hasGoldenEgg?: boolean;
  // Admin conditions
  hasConditions?: boolean;
  lossCondition?: boolean;
  customRules?: {
    minBalance?: number;
    maxLoss?: number;
    specialRequirements?: string[];
  };
  // Campaign fallback
  campaignId?: string;
  isFromCampaign?: boolean;
}

interface UserStats {
  accountBalance: number;
  campaignsCompleted: number;
  todayCommission: number;
  withdrawalAmount: number;
  dailyCampaignsCompleted: number;
}

export default function CampaignPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    accountBalance: 0,
    campaignsCompleted: 0,
    todayCommission: 0,
    withdrawalAmount: 0,
    dailyCampaignsCompleted: 0
  });
  const [tasks, setTasks] = useState<CustomerTask[]>([]);
  const [currentTask, setCurrentTask] = useState<CustomerTask | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showPlatform, setShowPlatform] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoldenEggModal, setShowGoldenEggModal] = useState(false);
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null);
  const [goldenEggReward, setGoldenEggReward] = useState<number | null>(null);
  const [isSelectingEgg, setIsSelectingEgg] = useState(false);

  // Fetch user stats from database
  const fetchUserStats = useCallback(async () => {
    try {
      if (!user?.email) return;
      
      const response = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const userData = data.data;
          setUserStats({
            accountBalance: userData.accountBalance || 0,
            campaignsCompleted: userData.campaignsCompleted || 0,
            todayCommission: userData.todayCommission || 0,
            withdrawalAmount: userData.withdrawalAmount || 0,
            dailyCampaignsCompleted: userData.dailyCampaignsCompleted || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, [user?.email]);

  // Fetch user's tasks with priority logic
  const fetchTasks = useCallback(async () => {
    try {
      if (!user?._id) return;
      
      // Step 1: Check customer tasks first (admin assigned)
      const customerTasksResponse = await fetch(`/api/customer-tasks?customerId=${user._id}`);
      let customerTasks = [];
      
      if (customerTasksResponse.ok) {
        const customerData = await customerTasksResponse.json();
        if (customerData.success && Array.isArray(customerData.data)) {
          customerTasks = customerData.data;
        }
      }
      
      // Step 2: Check if customer tasks have conditions
      const tasksWithConditions = customerTasks.filter((task: CustomerTask) => task.hasConditions);
      const tasksWithoutConditions = customerTasks.filter((task: CustomerTask) => !task.hasConditions);
      
      let finalTasks = [];
      
      if (tasksWithConditions.length > 0) {
        // Admin has set conditions - use customer tasks with conditions
        console.log('Using customer tasks with admin conditions');
        finalTasks = tasksWithConditions;
        
        // Check each task's conditions
        finalTasks = finalTasks.map((task: CustomerTask) => {
          if (task.lossCondition) {
            // Apply loss condition logic
            return {
              ...task,
              taskDescription: `${task.taskDescription} (Loss Condition Applied)`,
              customRules: task.customRules
            };
          }
          return task;
        });
        
      } else if (tasksWithoutConditions.length > 0) {
        // Customer tasks exist but no conditions - use them normally
        console.log('Using customer tasks without conditions');
        finalTasks = tasksWithoutConditions;
        
      } else {
        // No customer tasks - fallback to normal campaigns
        console.log('No customer tasks found, using normal campaigns');
        try {
          const campaignsResponse = await fetch('/api/campaigns');
          if (campaignsResponse.ok) {
            const campaignsData = await campaignsResponse.json();
            console.log('Campaigns API response:', campaignsData);
            if (campaignsData.success && Array.isArray(campaignsData.data)) {
              console.log(`Found ${campaignsData.data.length} campaigns`);
              // Convert campaigns to task format
              finalTasks = campaignsData.data.map((campaign: any, index: number) => {
                console.log(`Converting campaign ${index + 1}:`, {
                  brand: campaign.brand,
                  title: campaign.title,
                  baseAmount: campaign.baseAmount,
                  commissionAmount: campaign.commissionAmount,
                  type: campaign.type,
                  platform: campaign.platform
                });
                return {
                  _id: `campaign-${campaign._id}`,
                  customerId: user._id,
                  taskNumber: index + 1,
                  taskPrice: campaign.baseAmount || campaign.taskPrice || 0,
                  taskCommission: campaign.commissionAmount || campaign.taskCommission || campaign.commission || 0,
                  taskTitle: campaign.brand || campaign.title || campaign.taskTitle || `Campaign Task ${index + 1}`,
                  taskDescription: campaign.description || campaign.taskDescription || 'Complete this campaign task',
                  platform: campaign.type || campaign.platform || 'General',
                  status: 'pending',
                  isClaimed: false,
                  hasGoldenEgg: campaign.hasGoldenEgg || false,
                  hasConditions: false,
                  lossCondition: false,
                  isFromCampaign: true,
                  campaignId: campaign._id
                };
              });
              console.log('Converted tasks:', finalTasks.slice(0, 2));
            }
          }
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
      }
      
      setTasks(finalTasks);
      
      // Set first available task as current
      const availableTask = finalTasks.find((t: CustomerTask) => 
        t.status === 'pending' && !t.isClaimed
      );
      if (availableTask) {
        setCurrentTask(availableTask);
      }
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [user?._id]);

  // Claim task
  const claimTask = async (task: CustomerTask) => {
    if (!user?._id) return;

    setIsCompleting(true);
    setError(null);
    
    try {
      // Check if task is from campaign or customer task
      if (task.isFromCampaign) {
        // Handle campaign task claiming
        console.log('Claiming campaign task:', task.campaignId);
        // For now, just mark as claimed locally
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t._id === task._id ? { ...t, isClaimed: true, status: 'active' } : t
          )
        );
        setCurrentTask({ ...task, isClaimed: true, status: 'active' });
      } else {
        // Handle customer task claiming
        const response = await fetch('/api/customer-tasks/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: user._id,
            taskId: task._id
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Refresh tasks and stats
          await fetchTasks();
          await fetchUserStats();
        } else {
          if (data.redirectTo === '/deposit') {
            router.push('/deposit');
          } else {
            setError(data.message || 'Failed to claim task');
          }
        }
      }
    } catch (error) {
      console.error('Error claiming task:', error);
      setError('Failed to claim task');
    } finally {
      setIsCompleting(false);
    }
  };

  // Complete task
  const completeTask = async (task: CustomerTask) => {
    if (!user?._id) return;

    setIsCompleting(true);
    setError(null);
    
    try {
      // Show platform first
      setShowPlatform(true);
      
      // Wait 2 seconds to simulate completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if task is from campaign or customer task
      if (task.isFromCampaign) {
        // Handle campaign task completion
        console.log('Completing campaign task:', task.campaignId);
        
        // Simulate campaign task completion
        setUserStats(prev => ({
          ...prev,
          accountBalance: prev.accountBalance + task.taskCommission,
          campaignsCompleted: prev.campaignsCompleted + 1,
          todayCommission: prev.todayCommission + task.taskCommission,
          dailyCampaignsCompleted: prev.dailyCampaignsCompleted + 1
        }));

        // Update task status
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t._id === task._id 
              ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
              : t
          )
        );
        setCurrentTask(null);
        
      } else {
        // Handle customer task completion
        const response = await fetch('/api/customer-tasks/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: user._id,
            taskId: task._id
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Check if task has golden egg
          if (task.hasGoldenEgg) {
            setShowGoldenEggModal(true);
          } else {
            // Regular task completion
            setUserStats(prev => ({
              ...prev,
              accountBalance: data.data.newBalance,
              campaignsCompleted: prev.campaignsCompleted + 1,
              todayCommission: prev.todayCommission + task.taskCommission,
              dailyCampaignsCompleted: prev.dailyCampaignsCompleted + 1
            }));

            // Refresh tasks
            await fetchTasks();
          }
        } else {
          setError(data.message || 'Failed to complete task');
        }
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task');
    } finally {
      setIsCompleting(false);
      setShowPlatform(false);
    }
  };

  // Select golden egg
  const selectGoldenEgg = async (eggNumber: number) => {
    setIsSelectingEgg(true);
    setSelectedEgg(eggNumber);
    
    try {
      // Simulate egg selection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate random bonus (you can customize this range)
      const bonuses = [500, 1000, 1500, 2000, 2500, 3000, 5000, 10000];
      const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)];
      
      setGoldenEggReward(randomBonus);
      
      // Complete the task after golden egg selection
      setTimeout(async () => {
        try {
          const response = await fetch('/api/customer-tasks/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerId: user?._id,
              taskId: currentTask?._id,
              goldenEggReward: randomBonus
            }),
          });

          const data = await response.json();
          
          if (data.success) {
            setUserStats(prev => ({
              ...prev,
              accountBalance: data.data.newBalance,
              campaignsCompleted: prev.campaignsCompleted + 1,
              todayCommission: prev.todayCommission + (currentTask?.taskCommission || 0) + randomBonus,
              dailyCampaignsCompleted: prev.dailyCampaignsCompleted + 1
            }));

            // Refresh tasks
            await fetchTasks();
          }
        } catch (error) {
          console.error('Error completing golden egg task:', error);
        }
        
        // Close modal after 3 seconds
        setTimeout(() => {
          setShowGoldenEggModal(false);
          setSelectedEgg(null);
          setGoldenEggReward(null);
          setIsSelectingEgg(false);
        }, 3000);
      }, 2000);
      
    } catch (error) {
      console.error('Error selecting golden egg:', error);
      setIsSelectingEgg(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      fetchUserStats();
      fetchTasks();
      
      // Auto-refresh every 5 seconds
      const interval = setInterval(() => {
        fetchUserStats();
        fetchTasks();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user, loading, router, fetchUserStats, fetchTasks]);

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
      
      <div className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {/* Hero Video Section */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl h-64 md:h-80 flex items-center justify-center overflow-hidden">
            <video 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop
              playsInline
            >
              <source src="/homepage/herovideo.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">ICONIC DIGITAL</h1>
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto"></div>
              </div>
            </div>
                    </div>
                  </div>

        {/* User Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-teal-50 border-teal-200">
            <div className="text-center">
              <p className="text-sm text-teal-600 font-medium mb-1">Account Balance</p>
              <p className="text-xl font-bold text-teal-800">BDT {userStats.accountBalance.toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium mb-1">Number of Campaigns</p>
              <p className="text-xl font-bold text-blue-800">{userStats.dailyCampaignsCompleted}/30</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium mb-1">Today's Commission</p>
              <p className="text-xl font-bold text-green-800">BDT {userStats.todayCommission.toLocaleString()}</p>
                    </div>
          </Card>
          
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-center">
              <p className="text-sm text-orange-600 font-medium mb-1">Withdrawal Amount</p>
              <p className="text-xl font-bold text-orange-800">BDT {userStats.withdrawalAmount.toLocaleString()}</p>
                    </div>
          </Card>
                  </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Current Task Section */}
        {currentTask && (
          <Card className={`p-6 mb-8 bg-gradient-to-r ${
            currentTask.hasGoldenEgg 
              ? 'from-yellow-50 to-orange-50 border-yellow-200' 
              : currentTask.hasConditions
              ? 'from-red-50 to-pink-50 border-red-200'
              : currentTask.isFromCampaign
              ? 'from-blue-50 to-indigo-50 border-blue-200'
              : 'from-red-50 to-pink-50 border-red-200'
          }`}>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-800">Current Task</h3>
                {currentTask.hasGoldenEgg && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-700">Golden Egg</span>
                  </div>
                )}
                {currentTask.hasConditions && (
                  <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-700">Admin Conditions</span>
                  </div>
                )}
                {currentTask.isFromCampaign && (
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700">Campaign</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{currentTask.taskTitle}</p>
              {currentTask.hasGoldenEgg && (
                <p className="text-sm text-yellow-700 mt-2 font-medium">
                  🎉 This task contains a golden egg bonus reward!
                </p>
              )}
              {currentTask.hasConditions && currentTask.lossCondition && (
                <p className="text-sm text-red-700 mt-2 font-medium">
                  ⚠️ Loss condition applied - special rules in effect
                </p>
              )}
              {currentTask.isFromCampaign && (
                <p className="text-sm text-blue-700 mt-2 font-medium">
                  📋 This is a standard campaign task
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Commission</span>
                </div>
                <p className="font-bold text-green-600">BDT {currentTask.taskCommission.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Platform</span>
                </div>
                <p className="font-bold text-blue-600">{currentTask.platform}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Task Price</span>
                </div>
                <p className="font-bold text-orange-600">BDT {currentTask.taskPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 text-center">{currentTask.taskDescription}</p>
            </div>

            {/* Action Button */}
            <Button 
              className={`w-full py-4 text-white font-bold rounded-lg transition-all duration-300 ${
                userStats.dailyCampaignsCompleted >= 30 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : isCompleting 
                    ? 'bg-yellow-500 animate-pulse' 
                    : currentTask.isClaimed
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
              }`}
              onClick={() => currentTask.isClaimed ? completeTask(currentTask) : claimTask(currentTask)}
              disabled={userStats.dailyCampaignsCompleted >= 30 || isCompleting}
            >
              {isCompleting ? (
                <>
                  <Play className="w-5 h-5 mr-2 animate-spin" />
                  {showPlatform ? `Completing ${currentTask.platform} Task...` : 'Processing...'}
                </>
              ) : userStats.dailyCampaignsCompleted >= 30 ? (
                'Daily Limit Reached (30/30)'
              ) : currentTask.isClaimed ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Task
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Claim Task
                </>
              )}
            </Button>

            {userStats.dailyCampaignsCompleted >= 30 && (
              <p className="text-center text-sm text-gray-500 mt-2">
                You've completed your daily limit. Come back tomorrow!
              </p>
            )}
          </Card>
        )}

        {/* No Tasks Available */}
        {tasks.length === 0 && (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Tasks Available</h3>
            <p className="text-gray-600">Contact admin to get your tasks assigned.</p>
          </Card>
        )}

        {/* Golden Egg Modal */}
        {showGoldenEggModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-yellow-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Golden Egg Reward! 🎉</h3>
                <p className="text-gray-600 mb-6">
                  Congratulations! You found a golden egg! Choose one of the three eggs below to reveal your bonus reward.
                </p>

                {!goldenEggReward ? (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((eggNumber) => (
                      <button
                        key={eggNumber}
                        onClick={() => selectGoldenEgg(eggNumber)}
                        disabled={isSelectingEgg}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                          selectedEgg === eggNumber
                            ? 'bg-yellow-400 text-white scale-110'
                            : isSelectingEgg
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 hover:scale-105'
                        }`}
                      >
                        🥚
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <span className="text-3xl">🎁</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-lg font-bold text-green-600 mb-1">
                        Bonus Reward: BDT {goldenEggReward.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Added to your account balance!
                      </p>
                    </div>
                  </div>
                )}

                {isSelectingEgg && !goldenEggReward && (
                  <div className="mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Revealing your reward...</p>
                  </div>
                )}

                {goldenEggReward && (
                  <Button
                    onClick={() => {
                      setShowGoldenEggModal(false);
                      setSelectedEgg(null);
                      setGoldenEggReward(null);
                      setIsSelectingEgg(false);
                    }}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Continue
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

      </div>
      
      <HomepageFooter />
    </div>
  );
}