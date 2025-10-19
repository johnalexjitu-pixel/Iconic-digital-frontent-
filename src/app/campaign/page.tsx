'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomepageFooter } from '@/components/HomepageFooter';
import { HomepageHeader } from '@/components/HomepageHeader';
import { AccountStatusChecker } from '@/components/AccountStatusChecker';
import { ProfessionalLoadingScreen } from '@/components/ProfessionalLoadingScreen';
import { toast } from 'sonner';
import { calculateCommission, getCommissionTier, getMinCommission, getMaxCommission } from '@/lib/commission-calculator';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Users,
  RefreshCw,
  Gift,
  X,
  Star,
  Crown,
  Loader2,
  MessageCircle,
  CreditCard,
  ArrowRight
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

// Professional Reward Modal Component - Conditional Design
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

  const isNegativeCommission = rewardData.commission < 0;
  const taskId = Math.floor(Math.random() * 900000) + 100000;

  // Show SocialTrend-style design only for negative commission from customer tasks
  if (isNegativeCommission) {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm bg-gradient-to-b from-yellow-50 to-pink-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M10 0h10v10H10V0zM0 10h10v10H0V10z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative z-10 p-6">
            {/* Header Section */}
            <div className="text-center mb-6">
              {/* Company Logo */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <span className="text-gray-800 font-bold text-lg">ICONIC DIGITAL</span>
              </div>
              
              {/* Main Message */}
              <h2 className="text-2xl font-bold mb-2 text-amber-700">
                Congratulations!
              </h2>
              
              <p className="text-gray-600 text-sm">
                You got a special campaign
              </p>
            </div>

            {/* Campaign Details */}
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm">Campaign #{taskId}</span>
                <div className="flex items-center gap-1 bg-yellow-100 rounded-full px-2 py-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-700">Completed</span>
                </div>
              </div>

              {/* Brand Section */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  {rewardData.logo ? (
                    <img 
                      src={rewardData.logo} 
                      alt={rewardData.brand || rewardData.taskTitle}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">$</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {rewardData.brand || rewardData.taskTitle}
                  </h3>
                  <p className="text-gray-600 text-sm">Company Profit</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-600">
                    BDT {Math.abs(rewardData.companyProfit).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>


              {/* Platform Section */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Facebook</p>
                  <p className="text-xs text-gray-600">Social Campaign</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={onClose}
                variant="outline" 
                className="flex-1 h-10 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.open('https://wa.me/8801750577439', '_blank')}
                className="flex-1 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original professional design for positive commissions
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4 text-white relative">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">#{Math.floor(Math.random() * 900000) + 100000}</h3>
              <p className="text-blue-100 text-sm">Task completed successfully!</p>
            </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Your Commission Section - Compact */}
          {rewardData.commission >= 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    {rewardData.logo ? (
                      <img 
                        src={rewardData.logo} 
                        alt={rewardData.brand || rewardData.taskTitle}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Crown className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{rewardData.brand || rewardData.taskTitle}</h4>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Your Commission
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    BDT {rewardData.commission.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Earned</p>
                </div>
              </div>
            </div>
          )}

          {/* Company Profit Section - Compact */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">$</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Company Profit</h4>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Base Amount
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  BDT {rewardData.companyProfit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>
          </div>

          {/* Platform Section - Compact */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Facebook</h4>
                <p className="text-xs text-gray-600">Social Campaign</p>
              </div>
              <div className="flex items-center gap-1.5 bg-green-100 rounded-full px-2 py-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-700">Active</span>
              </div>
            </div>
          </div>

          {/* Commission Status Message - Compact */}
          {rewardData.commission === 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-yellow-800 text-xs text-center flex items-center justify-center gap-2">
                <span className="text-sm">⚠️</span>
                This task has no commission. You completed it but earned no reward.
              </p>
            </div>
          )}

          {/* Action Buttons - Compact */}
          <div className="flex gap-3 pt-1">
            <Button 
              onClick={onClose}
              variant="outline" 
              className="flex-1 h-10 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
            >
              Close
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1 h-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {rewardData.commission > 0 ? 'Launch Campaign' : 'Continue'}
            </Button>
          </div>
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
  trialBalance: number;
  requiredTask: number;
  campaignSet: number[];
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
    totalEarnings: 0,
    trialBalance: 0,
    requiredTask: 30,
    campaignSet: []
  });
  const [todayCommission, setTodayCommission] = useState<number>(0);
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
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch today's commission
  const fetchTodayCommission = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      const response = await fetch(`/api/daily-commission?userId=${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setTodayCommission(data.data.totalCommission);
        console.log(`📊 Today's commission loaded: ${data.data.totalCommission} BDT`);
      } else {
        console.error('Failed to fetch today\'s commission:', data.message);
        setTodayCommission(0);
      }
    } catch (error) {
      console.error('Error fetching today\'s commission:', error);
      setTodayCommission(0);
    }
  }, [user?._id]);

  // Enhanced swipe gesture handling with better error handling
  const handleTouchStart = (e: React.TouchEvent) => {
    try {
    e.preventDefault();
      e.stopPropagation();
      
      if (!e.touches || e.touches.length === 0) {
        console.warn('No touch data available');
        return;
      }
      
    const touch = e.touches[0];
      if (!touch || typeof touch.clientX !== 'number') {
        console.warn('Invalid touch data');
        return;
      }
      
    setTouchStart(touch.clientX);
    setTouchEnd(touch.clientX);
    setIsDragging(true);
    setDragProgress(0);
      
      console.log('Touch start:', touch.clientX);
      
      // Start hold timer - if user holds for 1 second, auto-complete
      const timer = setTimeout(() => {
        console.log('Hold timer triggered - auto-completing swipe');
        setShowPlatformSelection(true);
        resetSwipe();
      }, 1000);
      setHoldTimer(timer);
    } catch (error) {
      console.error('Error in handleTouchStart:', error);
      resetSwipe();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    try {
    e.preventDefault();
      e.stopPropagation();
      
      if (!touchStart || !e.touches || e.touches.length === 0) {
        return;
      }
    
    const touch = e.touches[0];
      if (!touch || typeof touch.clientX !== 'number') {
        return;
      }
      
    const distance = touch.clientX - touchStart;
    
    // Only allow right swipe (positive distance)
    if (distance < 0) return;
    
      // Calculate progress (0 to 1) - Allow full width swiping
      const maxDistance = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 300; // Use 80% of screen width for full swipe
    const progress = Math.min(distance / maxDistance, 1);
    setDragProgress(progress);
    setTouchEnd(touch.clientX);
    } catch (error) {
      console.error('Error in handleTouchMove:', error);
      resetSwipe();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    try {
    e.preventDefault();
      e.stopPropagation();
    
    if (!touchStart || touchEnd === null) {
      resetSwipe();
      return;
    }
    
    const distance = touchEnd - touchStart;
      const minSwipeDistance = typeof window !== 'undefined' ? window.innerWidth * 0.15 : 50; // Reduced to 15% for easier swipe
    
      console.log('Touch end - distance:', distance, 'min required:', minSwipeDistance);
    
    if (distance >= minSwipeDistance) {
      // Swipe successful - show platform selection
        console.log('Swipe successful, showing platform selection');
      setShowPlatformSelection(true);
      } else if (distance > 20) { // If user moved at least 20px, auto-complete after a short delay
        console.log('Partial swipe detected, auto-completing...');
        setTimeout(() => {
          setShowPlatformSelection(true);
        }, 200); // 200ms delay for auto-completion
      } else {
        console.log('Swipe not far enough');
    }
    
    resetSwipe();
    } catch (error) {
      console.error('Error in handleTouchEnd:', error);
      resetSwipe();
    }
  };

  const resetSwipe = () => {
    try {
    setIsDragging(false);
    setDragProgress(0);
    setTouchStart(null);
    setTouchEnd(null);
      
      // Clear hold timer if it exists
      if (holdTimer) {
        clearTimeout(holdTimer);
        setHoldTimer(null);
      }
    } catch (error) {
      console.error('Error in resetSwipe:', error);
    }
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
    
    // Fetch tasks after platform selection
    console.log('🎯 Platform selected, fetching tasks...');
    await fetchTasks();
    
    // Simulate loading/connecting to server
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowLoading(false);
    
    // Complete task regardless of commission (new workflow handles all tasks)
    if (currentTask) {
      console.log('✅ Current task available, proceeding with completion');
      
      // Check if this is a golden egg task
      if (currentTask.hasGoldenEgg) {
        setShowGoldenEggModal(true);
      } else {
        // Directly complete the task (no claiming needed in new workflow)
        completeTask(currentTask);
      }
    } else {
      console.log('❌ No current task available, cannot complete');
      toast.error('No task available to complete. Please try again.');
    }
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setTouchStart(e.clientX);
    setTouchEnd(e.clientX);
    setIsDragging(true);
    setDragProgress(0);
    
    // Start hold timer - if user holds for 1 second, auto-complete
    const timer = setTimeout(() => {
      console.log('Hold timer triggered - auto-completing mouse swipe');
      setShowPlatformSelection(true);
      resetSwipe();
    }, 1000);
    setHoldTimer(timer);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!touchStart || !isDragging) return;
    
    const distance = e.clientX - touchStart;
    if (distance < 0) return;
    
    const maxDistance = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 300; // Use 80% of screen width for full swipe
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
    const minSwipeDistance = typeof window !== 'undefined' ? window.innerWidth * 0.15 : 50; // Reduced to 15% for easier swipe
    
    if (distance >= minSwipeDistance) {
      // Swipe successful - show platform selection
      setShowPlatformSelection(true);
    } else if (distance > 20) { // If user moved at least 20px, auto-complete after a short delay
      console.log('Partial mouse swipe detected, auto-completing...');
      setTimeout(() => {
        setShowPlatformSelection(true);
      }, 200); // 200ms delay for auto-completion
    }
    
    resetSwipe();
  };

  // Fetch user stats from database
  const fetchUserStats = useCallback(async () => {
    try {
      if (!user?.username || !user?._id) return;
      
      // Fetch user data
      const userResponse = await fetch(`/api/user?username=${encodeURIComponent(user.username)}`);
      if (!userResponse.ok) return;
      
      const userData = await userResponse.json();
      if (!userData.success || !userData.data) return;
      
      let userInfo = userData.data;
      
      // Check if 24 hours have passed since last commission reset
      const lastReset = userInfo.lastCommissionReset ? new Date(userInfo.lastCommissionReset) : null;
      const now = new Date();
      const hoursSinceReset = lastReset ? (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60) : 999;
      
      if (hoursSinceReset >= 24) {
        // 24 hours passed - reset campaignCommission to 0
        console.log(`🔄 24 hours passed since last reset. Resetting campaignCommission...`);
        
        const resetResponse = await fetch('/api/user/reset-commission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
        
        if (resetResponse.ok) {
          const resetData = await resetResponse.json();
          if (resetData.success) {
            // Update userInfo with reset commission
            userInfo = { ...userInfo, campaignCommission: 0, lastCommissionReset: new Date() };
            console.log(`✅ Today commission reset to 0`);
          }
        }
      }
      
      // Check actual deposits from deposits collection
      const depositsResponse = await fetch('/api/deposits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      
      let actualDepositCount = 0;
      let hasActualDeposits = false;
      
      if (depositsResponse.ok) {
        const depositsData = await depositsResponse.json();
        if (depositsData.success) {
          actualDepositCount = depositsData.data.depositCount;
          hasActualDeposits = depositsData.data.hasDeposits;
        }
      }
          
      // Calculate account balance and withdrawal amount based on new negative commission system
      let displayAccountBalance = userInfo.accountBalance || 0;
      let withdrawableAmount = 0; // Always 0 unless negative commission scenario
      
      // Check if user has negative commission (new system)
      const negativeCommission = userInfo.negativeCommission || 0;
      const holdAmount = userInfo.holdAmount || 0;
      const withdrawalBalance = userInfo.withdrawalBalance || 0;
      
      console.log(`📊 User Balance Info:`, {
        accountBalance: userInfo.accountBalance,
        negativeCommission,
        holdAmount,
        withdrawalBalance,
        trialBalance: userInfo.trialBalance
      });
      
      // Check if user has negative balance but missing negativeCommission field (old data)
      const hasNegativeBalance = (userInfo.accountBalance || 0) < 0;
      const actualNegativeCommission = negativeCommission > 0 ? negativeCommission : (hasNegativeBalance ? Math.abs(userInfo.accountBalance) : 0);
      const hasHoldOrWithdrawal = holdAmount > 0 || withdrawalBalance > 0;
      
      if (actualNegativeCommission > 0 || hasNegativeBalance || hasHoldOrWithdrawal) {
        // ⚠️ User has negative commission - show negative balance and withdrawal amount (hold amount)
        displayAccountBalance = userInfo.accountBalance; // Already negative in DB
        
        // If withdrawalBalance is not set (old data), calculate it from hold amount
        if (withdrawalBalance === 0 && holdAmount > 0) {
          withdrawableAmount = holdAmount;
          console.log(`⚠️ Using holdAmount as withdrawableAmount: ${holdAmount}`);
        } else if (withdrawalBalance > 0) {
          withdrawableAmount = withdrawalBalance;
          console.log(`⚠️ Using withdrawalBalance: ${withdrawalBalance}`);
        } else {
          // Fallback: calculate from trial balance and loss
          const trialBalance = userInfo.trialBalance || 0;
          const lossAmount = Math.abs(userInfo.accountBalance || 0);
          const calculatedHold = trialBalance + lossAmount;
          withdrawableAmount = calculatedHold;
          console.log(`⚠️ OLD DATA DETECTED - Calculated from trial balance: ${trialBalance} + ${lossAmount} = ${calculatedHold}`);
          
          // Auto-fix the user data in background
          if (user?._id) {
            fetch('/api/fix-negative-balance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user._id })
            }).then(r => r.json()).then(data => {
              console.log(`✅ Auto-fix result:`, data);
              // Refresh user stats after fix
              setTimeout(() => fetchUserStats(), 1000);
            }).catch(err => console.error('Auto-fix error:', err));
          }
        }
        
        console.log(`⚠️ Negative Commission Detected: ${actualNegativeCommission}`);
        console.log(`Display Balance: ${displayAccountBalance}`);
        console.log(`Withdrawable Amount (Hold): ${withdrawableAmount}`);
      } else if (withdrawalBalance > 0 && hasActualDeposits) {
        // ✅ User deposited and cleared negative - show hold balance as withdrawable
        displayAccountBalance = userInfo.accountBalance || 0;
        withdrawableAmount = withdrawalBalance; // Show hold amount until next task
        console.log(`✅ Hold Balance Available: ${withdrawableAmount}`);
      } else {
        // Normal user - withdrawal amount is always 0
        displayAccountBalance = userInfo.accountBalance || 0;
        withdrawableAmount = 0; // Always 0 for normal users
        console.log(`✅ Normal User - Withdrawal Amount: 0`);
      }
          
      setUserStats({
        accountBalance: displayAccountBalance,
        campaignsCompleted: userInfo.campaignsCompleted || 0,
        campaignCommission: userInfo.campaignCommission || 0,
        todayCommission: userInfo.campaignCommission || 0,
        withdrawalAmount: withdrawableAmount,
        dailyCampaignsCompleted: userInfo.campaignsCompleted || 0,
        totalEarnings: userInfo.totalEarnings || 0,
        trialBalance: userInfo.trialBalance || 0,
        requiredTask: userInfo.requiredTask || 30,
        campaignSet: userInfo.campaignSet || []
      });
      
      // Auto-reset trial balance if user has exactly 30 tasks and trial balance > 0
      // Only for users with NO deposits (depositCount === 0)
      if (userInfo.campaignsCompleted === 30 && userInfo.trialBalance > 0 && user?.depositCount === 0) {
        console.log(`🔄 Auto-resetting trial balance for user at exactly 30 tasks`);
        try {
          const resetResponse = await fetch('/api/manual-trial-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
          });
          
          if (resetResponse.ok) {
            const resetData = await resetResponse.json();
            if (resetData.success) {
              console.log(`✅ Trial balance auto-reset: ${resetData.data.previousTrialBalance} → 0`);
              console.log(`📊 Account balance deducted: ${resetData.data.previousAccountBalance} → ${resetData.data.newAccountBalance} BDT`);
              // Update the userStats to reflect both trial balance reset and account balance deduction
              setUserStats(prev => ({
                ...prev,
                trialBalance: 0,
                accountBalance: resetData.data.newAccountBalance
              }));
            }
          }
        } catch (error) {
          console.error('Auto-reset trial balance failed:', error);
        }
      }
      
      // Note: User state will be updated in localStorage by other components
      
      return userInfo; // Return the fresh data
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
    return null;
  }, [user?.username, user?._id, user?.depositCount]);

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
      
      
      // Get fresh user data directly from API instead of using stale userStats
      const freshUserData = await fetchUserStats();
      if (!freshUserData) {
        return;
      }
      
      const campaignsCompleted = freshUserData.campaignsCompleted || 0;
      
      // First check customerTasks collection - match customerCode with membershipId
      const customerTasksResponse = await fetch(`/api/customer-tasks?customerCode=${user.membershipId}&status=pending`);
      const customerTasksData = await customerTasksResponse.json();
      
      // Check if customer task was found
      let customerTaskFound = false;
      
      if (customerTasksData.success && customerTasksData.data && customerTasksData.data.length > 0) {
        // Find the next task based on fresh campaignsCompleted + 1
        const nextTaskNumber = campaignsCompleted + 1;
        
        // First try to find the exact next task number
        const task = customerTasksData.data.find((t: CustomerTaskFromAPI) => t.taskNumber === nextTaskNumber);
        
        if (task) {
          
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
          
          customerTaskFound = true;
          console.log('✅ Customer task found and set as current task:', task.taskNumber);
      } else {
          console.log('❌ No customer task found for task number:', nextTaskNumber);
        }
      } else {
        console.log('❌ No customer tasks available');
      }
      
      // Only call campaign API if no customer task was found
      if (!customerTaskFound) {
        const campaignsResponse = await fetch('/api/campaigns');
        const campaignsData = await campaignsResponse.json();
        
        if (campaignsData.success && campaignsData.data && campaignsData.data.length > 0) {
          // Randomly select a campaign for variety
          const randomIndex = Math.floor(Math.random() * campaignsData.data.length);
          const campaign = campaignsData.data[randomIndex];
          
          // Calculate commission based on user's account balance using tiered system
          const balanceBasedCommission = calculateCommission(user.accountBalance || 0);
          const taskCommission = balanceBasedCommission;
          
          const nextTaskNumber = campaignsCompleted + 1;
          
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
          
          setCurrentTask(newTask);
          console.log('✅ Campaign task found and set as current task:', newTask.taskNumber);
        } else {
          console.log('❌ No campaigns available');
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
  }, [user?.membershipId, user?._id, user?.depositCount, user?.accountBalance, fetchUserStats]);

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
      setShowLoading(false);
      setIsCompleting(false);
    }
  };

  // Handle golden egg selection
  const handleEggSelect = (eggNumber: number) => {
    setSelectedEgg(eggNumber);
    
    // Complete the task with the same commission (just for show)
    if (currentTask) {
      // For completed tasks, we don't need to call completeTask again
      if (currentTask.status === 'completed') {
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

    // Check if user has reached the 30-task limit for new users (lock them until manual reset)
    // Exclude VIP users in Set 3 who can complete 32 tasks
    if (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) {
      setError('You have completed 30 tasks and are now locked. Please contact customer service to reset your account and continue.');
      toast.error('Account locked at 30 tasks. Contact customer service for reset.');
      return;
    }

    // Check if VIP user in Set 3 has reached the 32-task limit
    if (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32) {
      setError('You have completed all 32 tasks for VIP Set 3. Please contact customer service to reset your account and continue.');
      toast.error('VIP Set 3 completed. Contact customer service for reset.');
      return;
    }

    setIsCompleting(true);
    setError(null);
    
    // Start professional loading screen during task completion
    setShowLoading(true);
    setLoadingProgress(20);
    
    try {
      

      // Complete task based on source
      setLoadingProgress(50);
      let completionResponse;
      if (task.source === 'customerTasks') {
        // Complete customer task
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
          
          // Complete loading animation
          setLoadingProgress(100);
          
          // Show reward modal after a short delay
          setTimeout(() => {
            setShowLoading(false);
            setRewardData({
              commission: completionData.data.commission || task.taskCommission,
              taskTitle: task.taskTitle,
              brand: task.brand,
              logo: task.logo,
              isGoldenEgg: completionData.data.isGoldenEgg || task.hasGoldenEgg,
              companyProfit: task.taskPrice
            });
            setShowRewardModal(true);
          }, 1000);
          
          // Update user stats immediately with API response data
          const earnedCommission = completionData.data.commission || task.taskCommission;
          const newBalance = completionData.data.accountBalance || completionData.data.newBalance;
          
          // For customer tasks: use tasksCompleted (taskNumber), for campaign tasks: increment by 1
          let newCampaignsCompleted;
          if (completionData.data.tasksCompleted !== undefined) {
            // Customer task completion - use the taskNumber
            newCampaignsCompleted = completionData.data.tasksCompleted;
          } else {
            // Campaign task completion - increment by 1
            newCampaignsCompleted = userStats.campaignsCompleted + 1;
          }
          
          // Don't update stats here - let fetchUserStats handle it to get accurate data
          // setUserStats will be called by fetchUserStats below
          
          // Add a small delay to ensure database is updated
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Refresh user stats from database to ensure accuracy
          await fetchUserStats();
          
          // Get next task from database
          await fetchTasks();
          
          // Refresh today's commission
          await fetchTodayCommission();
          
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
      setShowLoading(false);
      setIsCompleting(false);
    }
  };


  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user?.membershipId) {
      // Initialize data only once when component mounts (without fetching tasks)
      const initializeData = async () => {
        await fetchUserStats();
        await fetchTodayCommission();
      };
      initializeData();
    }
  }, [user?.membershipId, loading, fetchUserStats, fetchTasks, fetchTodayCommission, router, user]); // Only depend on essential values

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
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-24">
      <HomepageHeader user={user} />
      
      {/* Professional Loading Animation */}
      {loadingState !== 'idle' && (
        <ProfessionalLoadingAnimation 
          state={loadingState} 
          progress={loadingProgress} 
        />
      )}
      
      <div className="max-w-2xl mx-auto p-4 space-y-6 pt-6">
      
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
          <Card className={`p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 ${
            userStats.accountBalance < 0 
              ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className={`text-sm mb-1 font-medium ${
                      userStats.accountBalance < 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>Account Balance</div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xl font-semibold ${
                        userStats.accountBalance < 0 ? 'text-red-800' : 'text-blue-800'
                      }`}>BDT {userStats.accountBalance.toLocaleString()}</span>
              </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center animate-pulse ${
                    userStats.accountBalance < 0 ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <DollarSign className="w-5 h-5 text-white" />
            </div>
                    </div>
                  </div>
            </div>
          </Card>
          
          {/* Trial Balance Card - Only show if trial balance > 0 */}
          {userStats.trialBalance > 0 && (
            <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-start justify-between">
                <div className="flex flex-row items-end justify-between w-full">
                  <div className="flex flex-row w-full items-end">
                    <div className="flex flex-col justify-end flex-1">
                      <div className="text-yellow-600 text-sm mb-1 font-medium">Trial Balance</div>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-semibold text-yellow-800">BDT {userStats.trialBalance.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-green-600 text-sm mb-1 font-medium">Campaigns Completed</div>
                    <div className="text-xl font-semibold text-green-800">
                      {userStats.campaignsCompleted}/{userStats.requiredTask || 30}
                    </div>
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
                    <div className="text-purple-600 text-sm mb-1 font-medium">Today Commission</div>
                <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold text-purple-800">BDT {todayCommission.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
                    </div>
          </Card>
          
          <Card className="p-4 rounded-lg ring-1 ring-primary ring-opacity-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 col-span-2 flex justify-center">
            <div className="flex items-start justify-between w-full max-w-xs">
              <div className="flex flex-row items-end justify-between w-full">
                <div className="flex flex-row w-full items-end">
                  <div className="flex flex-col justify-end flex-1">
                    <div className="text-orange-600 text-sm mb-1 font-medium">Withdrawable Amount</div>
                <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold text-orange-800">
                        BDT {Math.abs(userStats.withdrawalAmount || 0).toLocaleString()}
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
                  <h4 className="text-sm font-medium text-gray-500">Exclusive Campaign</h4>
                  <p className="text-lg font-semibold text-red-900">You got an exclusive campaign</p>
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


        {/* Contact Support Alert Message */}
        <div className="flex justify-center gap-4 mb-4">
          {/* Show alert message only if user has completed 30 tasks in current set */}
          {user && user.campaignsCompleted > 0 && (user.campaignsCompleted % 30) === 0 && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg text-center w-full">
              <h3 className="text-lg font-semibold mb-2">🚫 Task Limit Reached!</h3>
              <p className="mb-3">You have completed all available tasks. To continue earning:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.open('https://wa.me/8801750577439', '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Customer Support
                </Button>
                <Button
                  onClick={() => window.open('/account', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Make a Deposit
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Launch Campaign Button with Swipe Gesture */}
        <div className="pt-4 pb-6 relative">
          {user && user.campaignStatus === 'inactive' ? (
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
          ) : user && user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3) ? (
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
              className={`relative h-14 sm:h-16 rounded-full overflow-hidden flex items-center justify-center transition-colors duration-300 select-none ${
                user && (user.campaignStatus === 'inactive' || 
                  (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                  (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32))
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              onTouchStart={user && (user.campaignStatus === 'inactive' || 
                (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32)) ? undefined : handleTouchStart}
              onTouchMove={user && (user.campaignStatus === 'inactive' || 
                (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32)) ? undefined : handleTouchMove}
              onTouchEnd={user && (user.campaignStatus === 'inactive' || 
                (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32)) ? undefined : handleTouchEnd}
              onMouseDown={user && (user.campaignStatus === 'inactive' || 
                (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32)) ? undefined : handleMouseDown}
              onMouseMove={user && (user.campaignStatus === 'inactive' || 
                (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32)) ? undefined : handleMouseMove}
              onMouseUp={user && (user.campaignStatus === 'inactive' || 
                (user.depositCount === 0 && userStats.campaignsCompleted >= 30 && !(userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3)) ||
                (userStats.accountBalance >= 1000000 && userStats.campaignSet && userStats.campaignSet.length === 3 && userStats.campaignsCompleted >= 32)) ? undefined : handleMouseUp}
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
              <span className={`text-white font-bold text-base sm:text-lg transition-all duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}>
                {isDragging ? 'Swipe to Launch' : 'Launch Campaign'}
              </span>
            </div>
            
            {/* Drag handle */}
            <div 
              className="absolute left-0 top-0 h-full w-14 sm:w-16 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 z-20 hover:shadow-xl"
              style={{ 
                transform: `translateX(${dragProgress * (typeof window !== 'undefined' ? window.innerWidth * 0.8 - (window.innerWidth < 640 ? 56 : 64) : 236)}px) scale(${isDragging ? 1.1 : 1})`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
              onClick={async (e) => {
                e.stopPropagation();
                if (currentTask) {
                  console.log('✅ Current task available, proceeding with completion');
                  if (!currentTask.isClaimed) {
                    claimTask(currentTask);
                  } else {
                    completeTask(currentTask);
                  }
                } else {
                  console.log('❌ No current task available, fetching tasks first...');
                  await fetchTasks();
                  toast.info('Tasks fetched. Please try again.');
                }
              }}
            >
              <ArrowRight className="w-6 h-6 text-gray-600" />
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
                    onClick={async () => {
                      // Fetch tasks first
                      console.log('🎯 Complete Any Platform clicked, fetching tasks...');
                      await fetchTasks();
                      
                      if (currentTask) {
                        console.log('✅ Current task available, proceeding with completion');
                        if (!currentTask.isClaimed) {
                          claimTask(currentTask);
                        } else {
                          completeTask(currentTask);
                        }
                      } else {
                        console.log('❌ No current task available, cannot complete');
                        toast.error('No task available to complete. Please try again.');
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

        {/* Professional Loading Screen */}
        <ProfessionalLoadingScreen 
          isVisible={showLoading}
          progress={loadingProgress}
          message="Connecting to server..."
          onComplete={() => {
            setShowLoading(false);
            setLoadingProgress(0);
          }}
        />


      </div>
      
      {/* Golden Egg Modal */}
      <GoldenEggModal
        isOpen={showGoldenEggModal}
        onClose={() => setShowGoldenEggModal(false)}
        onEggSelect={handleEggSelect}
        taskTitle={currentTask?.taskTitle || ''}
        commission={currentTask?.taskCommission || 0}
        estimatedNegativeAmount={currentTask?.estimatedNegativeAmount || 0}
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