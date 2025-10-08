'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomepageFooter } from '@/components/HomepageFooter';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Users
} from 'lucide-react';

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
  hasConditions?: boolean;
  lossCondition?: boolean;
  customRules?: {
    minBalance?: number;
    maxLoss?: number;
    specialRequirements?: string[];
  };
  campaignId?: string;
  isFromCampaign?: boolean;
}

interface UserStats {
  accountBalance: number;
  campaignsCompleted: number;
  todayCommission: number;
  withdrawalAmount: number;
  dailyCampaignsCompleted: number;
  totalEarnings: number;
}

export default function CampaignPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    accountBalance: 0,
    campaignsCompleted: 0,
    todayCommission: 0,
    withdrawalAmount: 0,
    dailyCampaignsCompleted: 0,
    totalEarnings: 0
  });
  const [tasks, setTasks] = useState<CustomerTask[]>([]);
  const [currentTask, setCurrentTask] = useState<CustomerTask | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            dailyCampaignsCompleted: userData.dailyCampaignsCompleted || 0,
            totalEarnings: userData.totalEarnings || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, [user?.email]);

  // Fetch user's tasks
  const fetchTasks = useCallback(async () => {
    try {
      if (!user?._id) return;
      
      // Check customer tasks first
      const customerTasksResponse = await fetch(`/api/customer-tasks?customerId=${user._id}`);
      let customerTasks = [];
      
      if (customerTasksResponse.ok) {
        const customerData = await customerTasksResponse.json();
        if (customerData.success && Array.isArray(customerData.data)) {
          customerTasks = customerData.data;
        }
      }
      
      // Check if customer tasks have conditions
      const tasksWithConditions = customerTasks.filter((task: CustomerTask) => task.hasConditions);
      const tasksWithoutConditions = customerTasks.filter((task: CustomerTask) => !task.hasConditions);
      
      let finalTasks = [];
      
      if (tasksWithConditions.length > 0) {
        // Use customer tasks with conditions
        finalTasks = tasksWithConditions;
      } else if (tasksWithoutConditions.length > 0) {
        // Use campaigns from DB
        try {
          const campaignsResponse = await fetch('/api/campaigns');
          if (campaignsResponse.ok) {
            const campaignsData = await campaignsResponse.json();
            if (campaignsData.success && Array.isArray(campaignsData.data)) {
              finalTasks = campaignsData.data.map((campaign: any, index: number) => ({
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
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
      } else {
        // No customer tasks - use normal campaigns
        try {
          const campaignsResponse = await fetch('/api/campaigns');
          if (campaignsResponse.ok) {
            const campaignsData = await campaignsResponse.json();
            if (campaignsData.success && Array.isArray(campaignsData.data)) {
              finalTasks = campaignsData.data.map((campaign: any, index: number) => ({
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
              }));
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
      // Mark as claimed locally and ready for completion
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t._id === task._id ? { ...t, isClaimed: true, status: 'active' } : t
        )
      );
      setCurrentTask({ ...task, isClaimed: true, status: 'active' });
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
      // Update user balance in database
      const newBalance = userStats.accountBalance + task.taskCommission;
      const newTotalEarnings = userStats.totalEarnings + task.taskCommission;
      const newCampaignsCompleted = userStats.campaignsCompleted + 1;
      
      const updateResponse = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          accountBalance: newBalance,
          totalEarnings: newTotalEarnings,
          campaignsCompleted: newCampaignsCompleted
        }),
      });

      if (updateResponse.ok) {
        // Update local state
        setUserStats(prev => ({
          ...prev,
          accountBalance: newBalance,
          totalEarnings: newTotalEarnings,
          campaignsCompleted: newCampaignsCompleted,
          todayCommission: prev.todayCommission + task.taskCommission,
          dailyCampaignsCompleted: prev.dailyCampaignsCompleted + 1
        }));

        // Move to next task
        const nextTask = tasks.find(t => t._id !== task._id && t.status === 'pending' && !t.isClaimed);
        if (nextTask) {
          setCurrentTask(nextTask);
        } else {
          setCurrentTask(null);
        }
        
      } else {
        setError('Failed to update account balance');
      }
      
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task');
    } finally {
      setIsCompleting(false);
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
    }
  }, [user, loading, router, fetchUserStats, fetchTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 space-y-6 pt-10">
        
        {/* Hero Video Section */}
        <div className="w-full flex justify-center mb-4 relative min-h-[8rem] sm:min-h-[20rem] md:min-h-[24rem]">
          <video 
            src="/homepage/herovideo.mp4" 
            className="rounded-xl shadow-lg w-full max-w-2xl h-64 sm:h-80 md:h-96 object-cover" 
            autoPlay 
            loop 
            playsInline
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-gray-500 text-sm mb-1">Account Balance</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold">BDT {userStats.accountBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">Campaigns Completed</div>
                <div className="text-xl font-semibold">{userStats.campaignsCompleted}/30</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">Today's Commission</div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-semibold">BDT {userStats.todayCommission.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">Withdrawal Amount</div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-semibold">BDT {userStats.withdrawalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Launch Campaign Button */}
        <div className="pt-4 relative">
          <div className="relative h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 transition-colors duration-300">
            <div className="absolute inset-0 flex items-center justify-center w-full h-full">
              <span className="text-white font-medium text-lg">Launch Campaign</span>
            </div>
            <div className="absolute left-0 top-0 h-full w-16 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer" 
                 onClick={() => currentTask && !currentTask.isClaimed ? claimTask(currentTask) : currentTask && completeTask(currentTask)}>
              <ArrowRight className="w-8 h-8 transition-transform duration-300 text-red-500" />
            </div>
          </div>
        </div>

        {/* Current Task Info */}
        {currentTask && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Current Task</h3>
              <p className="text-gray-600 mb-4">{currentTask.taskTitle}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>Commission: BDT {currentTask.taskCommission.toLocaleString()}</span>
                <span>Platform: {currentTask.platform}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-red-600 text-center">
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* No Tasks Available */}
        {!currentTask && tasks.length === 0 && (
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Tasks Available</h3>
            <p className="text-gray-600">Contact admin to get your tasks assigned.</p>
          </Card>
        )}

      </div>
      
      <HomepageFooter />
    </div>
  );
}