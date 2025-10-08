'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomepageFooter } from '@/components/HomepageFooter';
import { HomepageHeader } from '@/components/HomepageHeader';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Users,
  RefreshCw
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
  const [refreshing, setRefreshing] = useState(false);
  
  // Swipe gesture states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [showPlatformSelection, setShowPlatformSelection] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<any>(null);

  // Handle swipe gestures - improved version
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
    setTouchEnd(touch.clientX);
    setIsDragging(true);
    setDragProgress(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const distance = touch.clientX - touchStart;
    
    // Only allow right swipe (positive distance)
    if (distance < 0) return;
    
    // Calculate progress (0 to 1)
    const maxDistance = 200;
    const progress = Math.min(distance / maxDistance, 1);
    setDragProgress(progress);
    setTouchEnd(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (!touchStart || touchEnd === null) {
      resetSwipe();
      return;
    }
    
    const distance = touchEnd - touchStart;
    const minSwipeDistance = 150; // Reduced for easier swipe
    
    console.log('Swipe distance:', distance, 'Min required:', minSwipeDistance);
    
    if (distance >= minSwipeDistance) {
      // Swipe successful - show platform selection
      console.log('Swipe successful! Showing platform selection...');
      setShowPlatformSelection(true);
    }
    
    resetSwipe();
  };

  const resetSwipe = () => {
    setIsDragging(false);
    setDragProgress(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Platform selection
  const platforms = [
    { id: 'facebook', name: 'Facebook', image: '/campaign/facebook.png' },
    { id: 'instagram', name: 'Instagram', image: '/campaign/instagram.png' },
    { id: 'pinterest', name: 'Pinterest', image: '/campaign/pinterest.png' },
    { id: 'tiktok', name: 'TikTok', image: '/campaign/tiktok.png' },
    { id: 'twitter', name: 'Twitter', image: '/campaign/twitter.png' }
  ];

  const handlePlatformSelect = async (platformId: string) => {
    setSelectedPlatform(platformId);
    setShowPlatformSelection(false);
    setShowLoading(true);
    
    // Simulate loading/connecting to server
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Use real campaign data from currentTask
    const campaignDetails = {
      campaignId: currentTask?.campaignId ? `#${currentTask.campaignId.slice(-6)}` : `#${Math.floor(Math.random() * 900000) + 100000}`,
      brand: currentTask?.taskTitle || 'Unknown Brand',
      brandLogo: '/logo/logo.png',
      amount: currentTask?.taskCommission || 0,
      commission: currentTask?.taskCommission || 0, // Real commission from database
      platform: platforms.find(p => p.id === platformId)?.name || 'Instagram',
      platformIcon: platforms.find(p => p.id === platformId)?.image || '/campaign/instagram.png',
      type: 'Social Campaign',
      status: 'Pending'
    };
    
    setCampaignDetails(campaignDetails);
    setShowLoading(false);
    setShowSuccess(true);
    
    // Only complete task if commission > 0
    if (currentTask && currentTask.taskCommission > 0) {
      if (!currentTask.isClaimed) {
        claimTask(currentTask);
      } else if (currentTask.isClaimed) {
        completeTask(currentTask);
      }
    } else {
      // Task completed but no commission earned
      console.log('Task completed but no commission earned (commission = 0)');
    }
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setTouchStart(e.clientX);
    setTouchEnd(e.clientX);
    setIsDragging(true);
    setDragProgress(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!touchStart || !isDragging) return;
    
    const distance = e.clientX - touchStart;
    if (distance < 0) return;
    
    const maxDistance = 200;
    const progress = Math.min(distance / maxDistance, 1);
    setDragProgress(progress);
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!touchStart || touchEnd === null) {
      resetSwipe();
      return;
    }
    
    const distance = touchEnd - touchStart;
    const minSwipeDistance = 150; // Reduced for easier swipe
    
    if (distance >= minSwipeDistance) {
      // Swipe successful - show platform selection
      setShowPlatformSelection(true);
    }
    
    resetSwipe();
  };

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

  // Fetch tasks using database
  const fetchTasks = useCallback(async (isRefresh = false) => {
    if (!user?._id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      
      console.log('🔍 Fetching next task for user:', user._id);
      
      // Get next available task from database
      const response = await fetch(`/api/next-task?userId=${user._id}`);
      const data = await response.json();
      
      console.log('📊 Next task API response:', data);
      
      if (data.success && data.data && data.data.task) {
        console.log(`✅ Next task loaded: ${data.data.task.taskTitle} (Task #${data.data.task.taskNumber})`);
        console.log(`📈 Progress: ${data.data.completedCount} completed, ${data.data.totalAvailable} available`);
        setCurrentTask(data.data.task);
        
        // Also fetch all tasks for display purposes
        await fetchAllTasks();
      } else {
        console.log('📋 No tasks available - API response:', data);
        setCurrentTask(null);
        setTasks([]);
      }
      
    } catch (error) {
      console.error('Error fetching next task:', error);
      setError('Failed to fetch tasks');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, [user?._id]);

  // Manual refresh function
  const handleRefresh = () => {
    fetchTasks(true);
  };

  // Fetch all tasks for display purposes
  const fetchAllTasks = useCallback(async () => {
    if (!user?._id) return;

    try {
      // Fetch customer tasks
      const tasksResponse = await fetch(`/api/customer-tasks?customerId=${user._id}`);
      const tasksData = await tasksResponse.json();
      
      if (tasksData.success && tasksData.data) {
        setTasks(tasksData.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching all tasks:', error);
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
      console.log('🎯 Completing task:', task.taskTitle, 'Commission:', task.taskCommission);
      
      // Save task completion to database
      const completionResponse = await fetch('/api/campaigns/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          taskId: task._id.toString(),
          taskTitle: task.taskTitle,
          platform: task.platform,
          commission: task.taskCommission || 0,
          amount: task.taskPrice || 0,
          taskType: task.isFromCampaign ? 'campaign' : 'customer_task',
          campaignId: task.campaignId
        }),
      });

      if (completionResponse.ok) {
        const completionData = await completionResponse.json();
        
        if (completionData.success) {
          // Update local state
          const commissionToAdd = task.taskCommission > 0 ? task.taskCommission : 0;
          setUserStats(prev => ({
            ...prev,
            accountBalance: prev.accountBalance + commissionToAdd,
            totalEarnings: prev.totalEarnings + commissionToAdd,
            campaignsCompleted: prev.campaignsCompleted + 1,
            todayCommission: prev.todayCommission + commissionToAdd,
            dailyCampaignsCompleted: prev.dailyCampaignsCompleted + 1
          }));

          // Get next task from database
          await getNextTask();
          
          console.log(`✅ Task completed and saved to database. Commission added: BDT ${commissionToAdd}`);
        } else {
          setError(completionData.message || 'Failed to save task completion');
        }
      } else {
        setError('Failed to save task completion to database');
      }
      
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task');
    } finally {
      setIsCompleting(false);
    }
  };

  // Get next task from database
  const getNextTask = async () => {
    try {
      const response = await fetch(`/api/next-task?userId=${user?._id}`);
      const data = await response.json();
      
      if (data.success && data.data && data.data.task) {
        setCurrentTask(data.data.task);
        console.log(`📋 Next task loaded: ${data.data.task.taskTitle}`);
      } else {
        setCurrentTask(null);
        console.log('📋 No more tasks available');
      }
    } catch (error) {
      console.error('Error getting next task:', error);
      setCurrentTask(null);
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
      <HomepageHeader />
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

        {/* Refresh Button */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Tasks'}
          </Button>
        </div>

        {/* Launch Campaign Button with Swipe Gesture */}
        <div className="pt-4 relative">
          <div 
            className="relative h-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 transition-colors duration-300 select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={resetSwipe}
            style={{ userSelect: 'none', touchAction: 'none' }}
          >
            {/* Background with swipe progress */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-200"
              style={{ 
                width: `${dragProgress * 100}%`,
                opacity: dragProgress > 0.3 ? 0.8 : 0
              }}
            />
            
            {/* Main content */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
              <span className="text-white font-medium text-lg">
                {isDragging ? 'Swipe to Launch' : 'Launch Campaign'}
              </span>
            </div>
            
            {/* Drag handle */}
            <div 
              className="absolute left-0 top-0 h-full w-16 bg-white rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200 z-20"
              style={{ 
                transform: `translateX(${dragProgress * 200}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (currentTask && !currentTask.isClaimed) {
                  claimTask(currentTask);
                } else if (currentTask && currentTask.isClaimed) {
                  completeTask(currentTask);
                }
              }}
            >
              <ArrowRight className="w-8 h-8 transition-transform duration-300 text-red-500" />
                </div>
              </div>
          
          {/* Swipe indicator arrows */}
          <div className="flex justify-center mt-2 space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <ArrowRight 
                key={i}
                className={`w-4 h-4 transition-colors duration-200 ${
                  dragProgress > (i * 0.2) ? 'text-red-500' : 'text-gray-300'
                }`}
              />
            ))}
                </div>
          
            </div>

        {/* Current Task Info */}
        {currentTask && (
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Current Task</h3>
              <p className="text-gray-600 mb-4">{currentTask.taskTitle}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>
                  Commission: {currentTask.taskCommission > 0 ? `BDT ${currentTask.taskCommission.toLocaleString()}` : 'No Commission'}
                </span>
                <span>Platform: {currentTask.platform}</span>
                <span>Task #{currentTask.taskNumber}</span>
              </div>
              {currentTask.isFromCampaign && (
                <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    📋 Task loaded from Campaign Database
                  </p>
                </div>
              )}
              {currentTask.taskCommission === 0 && (
                <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ This task has no commission reward
                  </p>
                </div>
              )}
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

        {/* Platform Selection Modal */}
        {showPlatformSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-sm bg-white rounded-2xl shadow-2xl">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Platform</h3>
                
                {/* Simple Rounded Logo Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformSelect(platform.id)}
                      className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 border-2 border-gray-200 hover:border-blue-500 mx-auto"
                    >
                      <img 
                        src={platform.image} 
                        alt={platform.name}
                        className="w-8 h-8 object-contain rounded-full"
                      />
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowPlatformSelection(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentTask && !currentTask.isClaimed) {
                        claimTask(currentTask);
                      } else if (currentTask && currentTask.isClaimed) {
                        completeTask(currentTask);
                      }
                      setShowPlatformSelection(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Complete Any Platform
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Loading Screen */}
        {showLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              {/* Loading Bar */}
              <div className="w-80 h-4 bg-white rounded-full mx-auto mb-4 overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-3000 ease-out"
                  style={{ width: '45%' }}
                />
              </div>

              {/* Loading Text */}
              <p className="text-white text-lg">Connecting to server...</p>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && campaignDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">{campaignDetails.campaignId}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                    <span className="text-orange-500 font-medium">{campaignDetails.status}</span>
                  </div>
                </div>

                {/* Brand Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={campaignDetails.brandLogo} 
                        alt={campaignDetails.brand}
                        className="w-8 h-8 object-contain"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{campaignDetails.brand}</h4>
                        <p className="text-sm text-gray-600">
                          Commission: {campaignDetails.commission > 0 ? `BDT ${campaignDetails.commission}` : 'No Commission'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${campaignDetails.amount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {campaignDetails.amount > 0 ? `BDT ${campaignDetails.amount.toLocaleString()}` : 'No Reward'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platform Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={campaignDetails.platformIcon} 
                      alt={campaignDetails.platform}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{campaignDetails.platform}</h4>
                      <p className="text-sm text-gray-600">{campaignDetails.type}</p>
                    </div>
                  </div>
                </div>

                {/* Commission Status Message */}
                {campaignDetails.commission === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-yellow-800 text-sm text-center">
                      ⚠️ This task has no commission. You completed it but earned no reward.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowSuccess(false);
                      setCampaignDetails(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSuccess(false);
                      setCampaignDetails(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  >
                    {campaignDetails.commission > 0 ? 'Launch Campaign' : 'Continue'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
      
      <HomepageFooter />
    </div>
  );
}