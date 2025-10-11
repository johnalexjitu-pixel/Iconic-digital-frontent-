'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomepageFooter } from '@/components/HomepageFooter';
import { HomepageHeader } from '@/components/HomepageHeader';
import { AccountStatusChecker } from '@/components/AccountStatusChecker';
import { toast } from 'sonner';
import { getCommissionTier, getMinCommission, getMaxCommission } from '@/lib/commission-calculator';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Users,
  RefreshCw,
  Gift,
  X,
  Star,
  Crown,
  Loader2
} from 'lucide-react';

// Professional Loading Animation Component
const ProfessionalLoadingAnimation = ({ 
  state, 
  progress 
}: { 
  state: 'idle' | 'fetching' | 'connecting' | 'connected';
  progress: number;
}) => {
  const getStateInfo = () => {
    switch (state) {
      case 'fetching':
        return { 
          text: 'Fetching Task Data...', 
          color: 'text-blue-600', 
          icon: Loader2,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          pulseColor: 'bg-blue-100',
          gradientFrom: 'from-blue-400',
          gradientTo: 'to-blue-600'
        };
      case 'connecting':
        return { 
          text: 'Connecting to Server...', 
          color: 'text-yellow-600', 
          icon: Loader2,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          pulseColor: 'bg-yellow-100',
          gradientFrom: 'from-yellow-400',
          gradientTo: 'to-yellow-600'
        };
      case 'connected':
        return { 
          text: 'Connected Successfully!', 
          color: 'text-green-600', 
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          pulseColor: 'bg-green-100',
          gradientFrom: 'from-green-400',
          gradientTo: 'to-green-600'
        };
      default:
        return { 
          text: 'Ready', 
          color: 'text-gray-600', 
          icon: CheckCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          pulseColor: 'bg-gray-100',
          gradientFrom: 'from-gray-400',
          gradientTo: 'to-gray-600'
        };
    }
  };

  const { text, color, icon: Icon, bgColor, borderColor, pulseColor, gradientFrom, gradientTo } = getStateInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-500">
      <div className={`bg-white rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl border-2 ${borderColor} animate-in zoom-in slide-in-from-bottom-4 duration-700`}>
        <div className="text-center">
          {/* Enhanced Animated Icon with Multiple Layers */}
          <div className="mb-10 flex justify-center">
            <div className={`relative ${state === 'connected' ? 'animate-bounce' : ''}`}>
              {/* Outer glow effect */}
              <div className={`absolute -inset-4 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-20 animate-pulse`}></div>
              {/* Outer pulse ring */}
              <div className={`absolute inset-0 rounded-full ${pulseColor} animate-ping opacity-30`}></div>
              {/* Inner pulse ring */}
              <div className={`absolute inset-2 rounded-full ${pulseColor} animate-pulse opacity-40`}></div>
              {/* Main icon container with gradient */}
              <div className={`relative w-20 h-20 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center border-2 ${borderColor} shadow-2xl`}>
                <Icon className={`w-10 h-10 text-white ${state !== 'connected' ? 'animate-spin' : 'animate-pulse'}`} />
                {state === 'connected' && (
                  <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-500">
                    <CheckCircle className="w-12 h-12 text-white animate-pulse" />
                  </div>
                )}
              </div>
              {/* Floating particles effect */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping opacity-60"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full animate-ping opacity-40 delay-300"></div>
            </div>
          </div>

          {/* Enhanced Progress Bar with Glow Effect */}
          <div className="mb-8">
            <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner border border-gray-300">
              <div 
                className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full transition-all duration-1500 ease-out relative ${
                  progress > 0 ? 'animate-pulse shadow-lg' : ''
                }`}
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-30 blur-sm`}></div>
              </div>
              {/* Progress percentage overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-full shadow-sm">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            
            {/* Enhanced Progress dots with animation */}
            <div className="flex justify-between mt-4">
              {[0, 25, 50, 75, 100].map((dot, index) => (
                <div 
                  key={dot}
                  className={`w-3 h-3 rounded-full transition-all duration-700 ${
                    progress >= dot 
                      ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} animate-pulse shadow-lg` 
                      : 'bg-gray-300'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Enhanced Status Text with Typing Effect */}
          <h3 className={`text-2xl font-bold ${color} mb-4 animate-in slide-in-from-top-2 duration-700`}>
            <span className="inline-block animate-pulse">{text}</span>
          </h3>

          {/* Enhanced Professional Status Messages with Staggered Animation */}
          <div className="space-y-4 text-sm text-gray-600">
            {state === 'fetching' && (
              <>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-100">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Retrieving campaign data from database</span>
                </div>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Validating user permissions and access</span>
                </div>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-300">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Preparing task details and commission data</span>
                </div>
              </>
            )}
            {state === 'connecting' && (
              <>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-100">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Establishing secure SSL connection</span>
                </div>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-200">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Synchronizing user data and preferences</span>
                </div>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-300">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Finalizing task assignment and rewards</span>
                </div>
              </>
            )}
            {state === 'connected' && (
              <>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Task loaded successfully from server</span>
                </div>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">Ready for task completion and rewards</span>
                </div>
                <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-300">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                  <span className="font-medium">All systems operational and verified</span>
                </div>
              </>
            )}
          </div>

          {/* Connection Status Indicator */}
          <div className="mt-8 flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ${state === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'} mr-2`}></div>
            <span className="text-xs text-gray-500 font-medium">
              {state === 'connected' ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reward Modal Component - Shows after task completion
const RewardModal = ({ 
  isOpen, 
  onClose, 
  rewardData 
}: { 
  isOpen: boolean;
  onClose: () => void;
  rewardData: {
    commission: number;
    taskTitle: string;
    brand?: string;
    logo?: string;
    isGoldenEgg?: boolean;
    companyProfit: number;
  } | null;
}) => {
  if (!isOpen || !rewardData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              {rewardData.isGoldenEgg && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-yellow-800" />
                </div>
              )}
            </div>
          </div>

          {/* Task Image */}
          {rewardData.logo && (
            <div className="mb-4 flex justify-center">
              <img 
                src={rewardData.logo} 
                alt={rewardData.brand || rewardData.taskTitle}
                className="w-16 h-16 object-contain rounded-lg border border-gray-200 shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {rewardData.isGoldenEgg ? '🥚 Golden Egg Completed!' : '🎯 Task Completed!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {rewardData.brand || rewardData.taskTitle}
          </p>

          {/* Reward Details */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-sm text-green-600 font-medium mb-1">Your Reward</div>
                <div className="text-2xl font-bold text-green-700">
                  BDT {rewardData.commission.toLocaleString()}
                </div>
                {rewardData.isGoldenEgg && (
                  <div className="text-xs text-green-500 mt-1">Golden Egg Bonus!</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-sm text-blue-600 font-medium mb-1">Company Profit</div>
                <div className="text-2xl font-bold text-blue-700">
                  BDT {rewardData.companyProfit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

import GoldenEggModal from '@/components/GoldenEggModal';

interface CustomerTask {
  _id: string;
  customerId: string;
  taskNumber: number;
  taskPrice: number;
  taskCommission: number;
  estimatedNegativeAmount?: number;
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
  source?: string; // Added source field for new workflow
  logo?: string; // Base64 image data
  brand?: string; // Brand name
}

interface CustomerTaskFromAPI {
  _id: string;
  customerId: string;
  customerCode: string;
  taskNumber: number;
  taskPrice: number;
  taskCommission: number;
  estimatedNegativeAmount?: number;
  hasGoldenEgg?: boolean;
  campaignId?: string;
  status: string;
  logo?: string; // Base64 image data
  brand?: string; // Brand name
}

interface UserStats {
  accountBalance: number;
  campaignsCompleted: number;
  campaignCommission: number;
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
    campaignCommission: 0,
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
  const [showGoldenEggModal, setShowGoldenEggModal] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'fetching' | 'connecting' | 'connected'>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState<{
    commission: number;
    taskTitle: string;
    brand?: string;
    logo?: string;
    isGoldenEgg?: boolean;
    companyProfit: number;
  } | null>(null);
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null);
  
  // Swipe gesture states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [showPlatformSelection, setShowPlatformSelection] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<{
    campaignId: string;
    brand: string;
    brandLogo: string;
    amount: number;
    commission: number;
    platform: string;
    platformIcon: string;
    type: string;
    status: string;
  } | null>(null);

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
    
    // Complete task regardless of commission (new workflow handles all tasks)
    if (currentTask) {
      console.log(`🎯 Platform selected: ${platformId}, Task: ${currentTask.taskTitle}, Commission: ${currentTask.taskCommission}`);
      console.log(`📝 Task source: ${currentTask.source || 'customerTasks'}`);
      
      // Check if this is a golden egg task
      if (currentTask.hasGoldenEgg) {
        console.log(`🥚 Golden Egg task detected! Showing egg selection modal`);
        console.log(`📊 Task status: ${currentTask.status}, Commission: ${currentTask.taskCommission}`);
        setShowGoldenEggModal(true);
      } else {
        // Directly complete the task (no claiming needed in new workflow)
        completeTask(currentTask);
      }
    } else {
      console.log('❌ No current task available');
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
      if (!user?.username) return;
      
      const response = await fetch(`/api/user?username=${encodeURIComponent(user.username)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const userData = data.data;
          setUserStats({
            accountBalance: userData.accountBalance || 0,
            campaignsCompleted: userData.campaignsCompleted || 0,
            campaignCommission: userData.campaignCommission || 0,
            todayCommission: userData.campaignCommission || 0, // Use campaignCommission as today's commission for now
            withdrawalAmount: user?.depositCount === 0 ? (userData.campaignCommission || 0) : (userData.accountBalance || 0),
            dailyCampaignsCompleted: userData.campaignsCompleted || 0,
            totalEarnings: userData.totalEarnings || 0
          });
          return userData; // Return the fresh data
        }
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
    return null;
  }, [user?.username, user?.depositCount]);

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

  // Fetch tasks using customerTasks system
  const fetchTasks = useCallback(async (isRefresh = false) => {
    if (!user?.membershipId) return;
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      
      console.log('🔍 Fetching next task for membershipId:', user.membershipId);
      
      // Get fresh user data directly from API instead of using stale userStats
      const freshUserData = await fetchUserStats();
      if (!freshUserData) {
        console.log('❌ Failed to fetch fresh user data');
        return;
      }
      
      const campaignsCompleted = freshUserData.campaignsCompleted || 0;
      console.log('🔍 Fresh campaigns completed:', campaignsCompleted);
      console.log('🔍 User deposit count:', user.depositCount);
      
      // First check customerTasks collection - match customerCode with membershipId
      const customerTasksResponse = await fetch(`/api/customer-tasks?customerCode=${user.membershipId}&status=pending`);
      const customerTasksData = await customerTasksResponse.json();
      console.log('🔍 Customer tasks response:', customerTasksData);
      console.log('🔍 Searching for customerCode:', user.membershipId, 'in customerTasks collection');
      
      // Check if customer task was found
      let customerTaskFound = false;
      
      if (customerTasksData.success && customerTasksData.data && customerTasksData.data.length > 0) {
        // Find the next task based on fresh campaignsCompleted + 1
        const nextTaskNumber = campaignsCompleted + 1;
        console.log(`🔍 Looking for Task #${nextTaskNumber} in customer tasks (based on fresh campaignsCompleted: ${campaignsCompleted})`);
        
        // First try to find the exact next task number
        const task = customerTasksData.data.find((t: CustomerTaskFromAPI) => t.taskNumber === nextTaskNumber);
        
        if (task) {
          console.log(`✅ Customer task found: Task #${task.taskNumber}`);
          console.log(`💰 Commission: ${task.taskCommission}`);
          console.log(`🥚 Has Golden Egg: ${task.hasGoldenEgg}`);
          console.log(`📊 Estimated Negative Amount: ${task.estimatedNegativeAmount || 0}`);
          console.log(`💎 Total Commission: ${(task.estimatedNegativeAmount || 0) + (task.taskCommission || 0)} BDT`);
          
          setCurrentTask({
            _id: task._id,
            customerId: task.customerId,
            taskNumber: task.taskNumber,
            taskPrice: task.taskPrice,
            taskCommission: task.taskCommission,
            estimatedNegativeAmount: task.estimatedNegativeAmount,
            taskTitle: `Task #${task.taskNumber}`,
            taskDescription: `Complete this task to earn BDT ${(task.estimatedNegativeAmount || 0) + (task.taskCommission || 0)}`,
            platform: 'instagram', // Default platform
            status: 'pending',
            isClaimed: false,
            hasGoldenEgg: task.hasGoldenEgg,
            campaignId: task.campaignId,
            source: 'customerTasks',
            logo: task.logo, // Base64 image data
            brand: task.brand // Brand name
          });
          
          console.log(`🎯 Customer task set successfully: Task #${task.taskNumber}`);
          customerTaskFound = true;
      } else {
          console.log(`❌ Task #${nextTaskNumber} not found in customer tasks, will show campaign task instead`);
        }
      } else {
        console.log(`❌ No pending customer tasks found, falling back to campaigns`);
      }
      
      // Only call campaign API if no customer task was found
      if (!customerTaskFound) {
        console.log('🔍 No customer task found, falling back to campaigns collection...');
        const campaignsResponse = await fetch('/api/campaigns');
        const campaignsData = await campaignsResponse.json();
        console.log('🔍 Campaigns response:', campaignsData);
        
        if (campaignsData.success && campaignsData.data && campaignsData.data.length > 0) {
          // Randomly select a campaign for variety
          const randomIndex = Math.floor(Math.random() * campaignsData.data.length);
          const campaign = campaignsData.data[randomIndex];
          console.log(`✅ Campaign task loaded: ${campaign.title} (random selection)`);
          
          // Calculate commission based on user type
          let taskCommission;
          if (user.depositCount === 0) {
            // New user: random commission between 20-50 BDT (part of 1000 BDT total)
            taskCommission = Math.floor(Math.random() * 31) + 20; // 20-50 BDT
          } else {
            // Deposited user: use campaign limits
            taskCommission = Math.floor(Math.random() * (campaign.maxCommission - campaign.minCommission + 1)) + campaign.minCommission;
          }
          
          const nextTaskNumber = campaignsCompleted + 1;
          console.log(`🔍 Creating campaign task #${nextTaskNumber} for user (fresh campaignsCompleted: ${campaignsCompleted})`);
          
          const newTask = {
            _id: campaign._id,
            customerId: user._id,
            taskNumber: nextTaskNumber,
            taskPrice: campaign.baseAmount,
            taskCommission: taskCommission,
            taskTitle: campaign.title,
            taskDescription: campaign.description,
            platform: campaign.platform,
            status: 'pending' as const,
            isClaimed: false,
            hasGoldenEgg: campaign.hasGoldenEgg,
            campaignId: campaign._id,
            source: 'campaigns',
            logo: campaign.logo, // Base64 image data
            brand: campaign.brand // Brand name
          };
          
          console.log('🎯 Setting new campaign task:', newTask);
          setCurrentTask(newTask);
        } else {
          console.log('📋 No tasks available');
        setCurrentTask(null);
        }
      }
      
    } catch (error) {
      console.error('Error fetching next task:', error);
      setError('Failed to fetch tasks');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, [user?.membershipId, user?._id, userStats.campaignsCompleted, user?.depositCount]);

  // Manual refresh function
  const handleRefresh = () => {
    fetchTasks(true);
  };

  // Task reset function
  const handleTaskReset = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch('/api/customer-tasks/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Task reset successful');
          toast.success('Tasks reset successfully! You can now complete more tasks.');
          await fetchUserStats();
          await fetchTasks();
        } else {
          setError(data.error || 'Failed to reset tasks');
          toast.error(data.error || 'Failed to reset tasks');
        }
      } else {
        setError('Failed to reset tasks');
        toast.error('Failed to reset tasks');
      }
    } catch (error) {
      console.error('Error resetting tasks:', error);
      setError('Failed to reset tasks');
    }
  };

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

  // Handle golden egg selection
  const handleEggSelect = (eggNumber: number) => {
    console.log(`🥚 Egg ${eggNumber} selected for golden egg task`);
    console.log(`📊 Task status: ${currentTask?.status}, Commission: ${currentTask?.taskCommission}`);
    setSelectedEgg(eggNumber);
    
    // Complete the task with the same commission (just for show)
    if (currentTask) {
      // For completed tasks, we don't need to call completeTask again
      if (currentTask.status === 'completed') {
        console.log(`✅ Golden egg task already completed, just showing result`);
        // Close modal after showing result
        setTimeout(() => {
          setShowGoldenEggModal(false);
        }, 2000);
      } else {
        // Pass the selected egg to completeTask
        completeTask(currentTask, eggNumber);
      }
    }
  };

  // Complete task
  const completeTask = async (task: CustomerTask, selectedEgg?: number) => {
    if (!user?._id) return;

    // Check if user has negative balance
    if ((userStats.accountBalance || 0) < 0) {
      setError('Your account balance is negative. Please contact customer support or make a deposit to continue.');
      toast.error('Negative balance detected. Contact support or make a deposit.');
      return;
    }

    // Check if user's campaign status is inactive
    if (user.campaignStatus === 'inactive') {
      setError('Your campaign status is inactive. Please contact customer service to start tasks.');
      toast.error('Campaign status is inactive. Contact customer service to start tasks.');
      return;
    }

    // Check if user has reached the 30-task limit for new users
    if (user.depositCount === 0 && userStats.campaignsCompleted >= 30) {
      setError('You have completed the maximum 30 tasks. Please contact customer service to get more tasks or make a deposit.');
      toast.error('You have reached the 30-task limit. Contact customer service for assistance.');
      return;
    }

    setIsCompleting(true);
    setError(null);
    
    // Start connection animation during task completion
    setLoadingState('connecting');
    setLoadingProgress(20);
    
    try {
      console.log('🎯 Completing task:', task.taskTitle, 'Commission:', task.taskCommission);
      console.log('🥚 Selected egg:', selectedEgg || 'N/A');
      
      console.log(`🎯 Completing task: ${task.taskTitle} (ID: ${task._id})`);
      console.log(`👤 User ID: ${user._id}`);
      console.log(`📋 Task data:`, {
        _id: task._id,
        taskTitle: task.taskTitle,
        platform: task.platform,
        taskCommission: task.taskCommission,
        taskPrice: task.taskPrice,
        source: task.source
      });

      // Complete task based on source
      setLoadingProgress(50);
      let completionResponse;
      if (task.source === 'customerTasks') {
        // Complete customer task
        console.log(`📤 Sending customer task completion request`);
        completionResponse = await fetch('/api/customer-tasks/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            taskId: task._id,
            userId: user._id
          }),
        });
      } else {
        // Complete campaign task directly
        console.log(`📤 Sending campaign task completion request`);
        const requestData = {
          userId: user._id,
          taskId: task._id,
          taskTitle: task.taskTitle,
          platform: task.platform,
          commission: task.taskCommission,
          amount: task.taskPrice,
          taskType: 'campaign',
          campaignId: task._id,
          taskPrice: task.taskPrice,
          taskNumber: task.taskNumber
        };
        console.log(`📤 Request data:`, requestData);
        
        completionResponse = await fetch('/api/campaigns/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
      }

      // Update progress to 80% after API call
      setLoadingProgress(80);

      if (completionResponse.ok) {
        const completionData = await completionResponse.json();
        
        if (completionData.success) {
          console.log(`✅ Task completed successfully: ${completionData.message}`);
          console.log(`📊 Commission earned: ${completionData.data.commission || task.taskCommission}`);
          console.log(`💳 New balance: ${completionData.data.accountBalance || completionData.data.newBalance}`);
          
          // Complete loading animation
          setLoadingProgress(100);
          setLoadingState('connected');
          
          // Show reward modal after a short delay
          setTimeout(() => {
            setLoadingState('idle');
            setRewardData({
              commission: completionData.data.commission || task.taskCommission,
              taskTitle: task.taskTitle,
              brand: task.brand,
              logo: task.logo,
              isGoldenEgg: completionData.data.isGoldenEgg || task.hasGoldenEgg,
              companyProfit: task.taskPrice
            });
            setShowRewardModal(true);
          }, 1500);
          
          // Update user stats immediately with API response data
          const earnedCommission = completionData.data.commission || task.taskCommission;
          const newBalance = completionData.data.accountBalance || completionData.data.newBalance;
          
          // For customer tasks: use tasksCompleted (taskNumber), for campaign tasks: increment by 1
          let newCampaignsCompleted;
          if (completionData.data.tasksCompleted !== undefined) {
            // Customer task completion - use the taskNumber
            newCampaignsCompleted = completionData.data.tasksCompleted;
            console.log(`📋 Customer task completed - using taskNumber: ${newCampaignsCompleted}`);
          } else {
            // Campaign task completion - increment by 1
            newCampaignsCompleted = userStats.campaignsCompleted + 1;
            console.log(`🎯 Campaign task completed - incrementing: ${userStats.campaignsCompleted} → ${newCampaignsCompleted}`);
          }
          
          setUserStats(prevStats => ({
            ...prevStats,
            accountBalance: newBalance,
            campaignsCompleted: newCampaignsCompleted,
            campaignCommission: prevStats.campaignCommission + earnedCommission,
            todayCommission: prevStats.todayCommission + earnedCommission,
            withdrawalAmount: user?.depositCount === 0 ? (prevStats.campaignCommission + earnedCommission) : newBalance,
            totalEarnings: prevStats.totalEarnings + earnedCommission
          }));
          
          // Add a small delay to ensure database is updated
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh user stats from database to ensure accuracy
          await fetchUserStats();
          
          // Get next task from database
          console.log(`🔄 Loading next task after completion...`);
          await fetchTasks();
          
          console.log(`✅ Task completed and next task loaded`);
        } else {
          console.error(`❌ Task completion failed: ${completionData.message}`);
          setError(completionData.error || 'Failed to save task completion');
        }
      } else {
        const errorData = await completionResponse.json();
        console.error(`❌ API Error (${completionResponse.status}):`, errorData);
        
        // Handle specific error types
        if (errorData.errorType === 'negative_balance') {
          setError('Your account balance is negative. Please contact customer support or make a deposit to continue.');
          toast.error('Negative balance detected. Contact support or make a deposit.');
        } else {
          setError(errorData.message || 'Failed to save task completion to database');
        }
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
    
    if (user?.membershipId) {
      // Initialize data only once when component mounts
      const initializeData = async () => {
        await fetchUserStats();
        await fetchTasks();
      };
      initializeData();
    }
  }, [user?.membershipId, loading]); // Only depend on essential values

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
    <AccountStatusChecker>
    <div className="min-h-screen bg-gray-50">
      <HomepageHeader />
      
      {/* Professional Loading Animation */}
      {loadingState !== 'idle' && (
        <ProfessionalLoadingAnimation 
          state={loadingState} 
          progress={loadingProgress} 
        />
      )}
      
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
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-blue-600 text-sm mb-1 font-medium">Account Balance</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold text-blue-800">BDT {userStats.accountBalance.toLocaleString()}</span>
              </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <DollarSign className="w-5 h-5 text-white" />
            </div>
                    </div>
                  </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-green-600 text-sm mb-1 font-medium">Campaigns Completed</div>
                    <div className="text-xl font-semibold text-green-800">{userStats.campaignsCompleted}/{user?.depositCount > 0 ? 90 : 30}</div>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-purple-600 text-sm mb-1 font-medium">Total Commission</div>
                <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold text-purple-800">BDT {userStats.campaignCommission?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
                    </div>
          </Card>
          
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-orange-600 text-sm mb-1 font-medium">Withdrawable Amount</div>
                <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold text-orange-800">
                        BDT {user?.depositCount === 0 ? (userStats.campaignCommission?.toLocaleString() || '0') : userStats.accountBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
                    </div>
          </Card>
                  </div>


        {/* Negative Balance Warning Card */}
        {userStats.accountBalance < 0 && (
          <Card className="p-4 mb-8 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Balance Issue</h4>
                  <p className="text-lg font-semibold text-red-900">Negative Balance Detected</p>
                  <p className="text-sm text-red-700">
                    Current Balance: BDT {userStats.accountBalance.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => window.location.href = '/contact-support'}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Contact Support
                </Button>
                <Button
                  onClick={() => window.location.href = '/deposit'}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Make Deposit
                </Button>
              </div>
            </div>
          </Card>
        )}


        {/* Reset Button */}
        <div className="flex justify-center gap-4 mb-4">
          {/* Show reset button only if user has completed 30 tasks in current set */}
          {user && user.campaignsCompleted > 0 && (user.campaignsCompleted % 30) === 0 && (
            <Button
              onClick={handleTaskReset}
              variant="default"
              size="sm"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Tasks
            </Button>
          )}
        </div>

        {/* Launch Campaign Button with Swipe Gesture */}
        <div className="pt-4 relative">
          {/* Check if user has negative balance */}
          {userStats.accountBalance < 0 ? (
            <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">⚠️ Negative Balance Detected!</h3>
              <p className="mb-3">Your account balance is negative (BDT {userStats.accountBalance.toLocaleString()}). Please contact customer support or make a deposit to continue.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.href = '/contact-support'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Contact Customer Support
                </Button>
                <Button
                  onClick={() => window.location.href = '/deposit'}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Make Deposit
                </Button>
              </div>
            </div>
          ) : user && user.campaignStatus === 'inactive' ? (
            <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">🚫 Campaign Status Inactive!</h3>
              <p className="mb-3">Your campaign status is currently inactive. Please contact customer service to start tasks.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.href = '/contact-support'}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Contact Customer Service
                </Button>
              </div>
            </div>
          ) : user && user.depositCount === 0 && userStats.campaignsCompleted >= 30 ? (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">🎯 Task Limit Reached!</h3>
              <p className="mb-3">You have completed the maximum 30 tasks. To continue earning:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleTaskReset}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Reset Tasks (Contact Customer Service)
                </Button>
                <Button
                  onClick={() => window.location.href = '/deposit'}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Make a Deposit
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className={`relative h-16 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 select-none ${
                user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30))
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              onTouchStart={user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30)) ? undefined : handleTouchStart}
              onTouchMove={user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30)) ? undefined : handleTouchMove}
              onTouchEnd={user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30)) ? undefined : handleTouchEnd}
              onMouseDown={user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30)) ? undefined : handleMouseDown}
              onMouseMove={user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30)) ? undefined : handleMouseMove}
              onMouseUp={user && (user.campaignStatus === 'inactive' || (user.depositCount === 0 && userStats.campaignsCompleted >= 30)) ? undefined : handleMouseUp}
            onMouseLeave={resetSwipe}
            style={{ userSelect: 'none', touchAction: 'none' }}
          >
            {/* Background with swipe progress */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ease-out"
              style={{ 
                width: `${dragProgress * 100}%`,
                opacity: dragProgress > 0.3 ? 0.9 : 0
              }}
            />
            
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transition-all duration-500"
              style={{ 
                transform: `translateX(${dragProgress * 100 - 100}%)`,
                opacity: dragProgress > 0.5 ? 0.3 : 0
              }}
            />
            
            {/* Main content */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
              <span className={`text-white font-bold text-lg transition-all duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                {isDragging ? 'Swipe to Launch' : 'Launch Campaign'}
              </span>
            </div>
            
            {/* Drag handle */}
            <div 
              className="absolute left-0 top-0 h-full w-16 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 z-20 hover:shadow-xl"
              style={{ 
                transform: `translateX(${dragProgress * 200}px) scale(${isDragging ? 1.1 : 1})`,
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
              <ArrowRight className={`w-8 h-8 transition-all duration-300 text-red-500 ${isDragging ? 'scale-110' : 'scale-100'}`} />
              </div>
          
          {/* Swipe indicator arrows */}
          <div className="flex justify-center mt-2 space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <ArrowRight 
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  dragProgress > (i * 0.2) ? 'text-red-500 scale-125 animate-pulse' : 'text-gray-300 scale-100'
                }`}
              />
            ))}
                </div>
          </div>
          )}
            </div>


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

        {/* Enhanced Loading Screen */}
        {showLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-500">
            <div className="text-center">
              {/* Enhanced Loading Animation Container */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  {/* Outer glow effect */}
                  <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-red-400 to-red-600 opacity-20 animate-pulse"></div>
                  {/* Outer pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30"></div>
                  {/* Inner pulse ring */}
                  <div className="absolute inset-2 rounded-full bg-red-400 animate-pulse opacity-40"></div>
                  {/* Main loading icon */}
                  <div className="relative w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  {/* Floating particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping opacity-60"></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full animate-ping opacity-40 delay-300"></div>
                </div>
              </div>

              {/* Enhanced Loading Bar */}
              <div className="w-96 h-6 bg-gray-800 rounded-full mx-auto mb-6 overflow-hidden shadow-inner border border-gray-600">
                <div 
                  className="h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-full transition-all duration-3000 ease-out relative animate-pulse"
                  style={{ width: '45%' }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-30 blur-sm"></div>
                </div>
                {/* Progress percentage overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white bg-black bg-opacity-50 px-2 py-1 rounded-full">
                    45%
                  </span>
                </div>
              </div>

              {/* Enhanced Loading Text with Typing Effect */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white animate-pulse">
                  Connecting to server...
                </h3>
                
                {/* Professional Status Messages */}
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-100">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                    <span className="font-medium">Establishing secure connection</span>
                  </div>
                  <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-200">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                    <span className="font-medium">Authenticating user credentials</span>
                  </div>
                  <div className="flex items-center justify-center animate-in slide-in-from-left-2 duration-500 delay-300">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-4 shadow-lg"></div>
                    <span className="font-medium">Synchronizing campaign data</span>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="mt-6 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
                  <span className="text-xs text-gray-400 font-medium">
                    Connecting...
                  </span>
                </div>
              </div>
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
      
      {/* Golden Egg Modal */}
      <GoldenEggModal
        isOpen={showGoldenEggModal}
        onClose={() => setShowGoldenEggModal(false)}
        onEggSelect={handleEggSelect}
        taskTitle={currentTask?.taskTitle || ''}
        commission={currentTask?.taskCommission || 0}
      />
      
      {/* Reward Modal - Shows after task completion */}
      <RewardModal
        isOpen={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          setRewardData(null);
          // Refresh tasks after closing reward modal
          fetchTasks();
        }}
        rewardData={rewardData}
      />
      
      <HomepageFooter />
    </div>
    </AccountStatusChecker>
  );
}