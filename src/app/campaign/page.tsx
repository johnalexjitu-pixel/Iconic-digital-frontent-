"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Users, Calendar, Play, CheckCircle, Clock, AlertCircle } from "lucide-react";
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

  // Fetch user stats from database
  const fetchUserStats = async () => {
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
  };

  // Fetch user's tasks from database
  const fetchTasks = async () => {
    try {
      if (!user?._id) return;
      
      const response = await fetch(`/api/customer-tasks?customerId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setTasks(data.data);
          // Set first active task as current
          const activeTask = data.data.find((t: CustomerTask) => t.status === 'active' && !t.isClaimed);
          if (activeTask) {
            setCurrentTask(activeTask);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Claim task
  const claimTask = async (task: CustomerTask) => {
    if (!user?._id) return;

    setIsCompleting(true);
    setError(null);
    
    try {
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
        // Update local state
        setUserStats(prev => ({
          ...prev,
          accountBalance: data.data.newBalance,
          campaignsCompleted: prev.campaignsCompleted + 1,
          todayCommission: prev.todayCommission + task.taskCommission,
          dailyCampaignsCompleted: prev.dailyCampaignsCompleted + 1
        }));

        // Refresh tasks
        await fetchTasks();
      } else {
        setError(data.message || 'Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task');
    } finally {
      setIsCompleting(false);
      setShowPlatform(false);
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
  }, [user, loading, router]);

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
          <Card className="p-6 mb-8 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Current Task</h3>
              <p className="text-gray-600">{currentTask.taskTitle}</p>
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

      </div>
      
      <HomepageFooter />
    </div>
  );
}