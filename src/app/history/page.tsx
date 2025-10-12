"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HomepageHeader } from "@/components/HomepageHeader";
import { HomepageFooter } from "@/components/HomepageFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { apiClient } from '@/lib/api-client';

interface TaskHistory {
  _id: string;
  membershipId: string;
  customerCode?: string;
  taskId: string;
  taskNumber: number;
  taskTitle: string;
  taskDescription?: string;
  platform: string;
  commissionEarned: number;
  taskPrice: number;
  source: 'customerTasks' | 'campaigns';
  campaignId?: string;
  hasGoldenEgg?: boolean;
  selectedEgg?: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  logo?: string; // Base64 image data
  brand?: string; // Brand name
}

interface HistorySummary {
  totalTasks: number;
  totalCommission: number;
  tasksBySource: {
    customerTasks: number;
    campaigns: number;
  };
  membershipId: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ _id: string; membershipId?: string } | null>(null);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTaskHistory = useCallback(async (isRefresh = false) => {
    try {
      if (!user?.membershipId) return;
      
      if (isRefresh) {
        setRefreshing(true);
      }
      
      console.log('📚 Fetching task history for membershipId:', user.membershipId);
      
      // Fetch user's completed task history
      const historyResponse = await fetch(`/api/user-task-history?membershipId=${user.membershipId}`);
      const historyData = await historyResponse.json();
      
      console.log('📊 History response:', historyData);
      
      if (historyData.success && historyData.data) {
        const { tasks, summary } = historyData.data;
        console.log(`📋 Found ${tasks.length} completed tasks`);
        console.log(`💰 Total commission earned: ${summary.totalCommission}`);
        console.log(`📈 Tasks by source: CustomerTasks: ${summary.tasksBySource.customerTasks}, Campaigns: ${summary.tasksBySource.campaigns}`);
        
        setTaskHistory(tasks);
        setSummary(summary);
      } else {
        setTaskHistory([]);
        setSummary(null);
      }
    } catch (error) {
      console.error('Error fetching task history:', error);
      setTaskHistory([]);
      setSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.membershipId]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTaskHistory();
      
      // Auto-refresh task history every 30 seconds
      const interval = setInterval(() => {
        fetchTaskHistory();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      router.push('/auth/login');
    }
  }, [router, fetchTaskHistory]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchTaskHistory(true);
  };

  // Helper function to generate task codes
  const generateTaskCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper function to get random logo for customer tasks
  const getRandomLogo = () => {
    const randomLogos = [
      'https://taanimagestore.online/SD01C03_422.png',
      'https://taanimagestore.online/SD01C03_419.png',
      'https://taanimagestore.online/SD01C03_189.png',
      'https://taanimagestore.online/SD01C03_364.png',
      'https://taanimagestore.online/SD01C03_485.png',
      'https://taanimagestore.online/SD01C03_383.png',
      'https://taanimagestore.online/SD01C03_326.png',
      'https://taanimagestore.online/SD01C03_101.png',
      'https://taanimagestore.online/SD01C03_179.png',
      'https://taanimagestore.online/SD01C03_52.png',
      'https://taanimagestore.online/SD01C03_24.png',
      'https://taanimagestore.online/SD01C03_69.png',
      'https://taanimagestore.online/SD01C03_132.png'
    ];
    
    return randomLogos[Math.floor(Math.random() * randomLogos.length)];
  };

  // Helper function to get logo based on task source
  const getTaskLogo = (task: TaskHistory) => {
    if (task.source === 'campaigns') {
      // For campaign tasks, try to get logo from task data first
      if (task.logo) {
        return task.logo; // Use original campaign logo
      }
      // If no logo in task data, try to get from brand name
      if (task.brand) {
        return getBrandLogo(task.brand);
      }
      // Try to extract brand name from task title for campaign tasks
      if (task.taskTitle) {
        // Extract brand name from task title (e.g., "NIKON Campaign" -> "NIKON")
        const brandFromTitle = task.taskTitle.split(' ')[0].toUpperCase();
        return getBrandLogo(brandFromTitle);
      }
      // Fallback to random logo for campaign tasks
      return getRandomLogo();
    } else if (task.source === 'customerTasks') {
      // For customer tasks, try to get brand logo if brand is available
      if (task.brand) {
        return getBrandLogo(task.brand);
      }
      // Try to extract brand name from task title for customer tasks
      if (task.taskTitle) {
        const brandFromTitle = task.taskTitle.split(' ')[0].toUpperCase();
        return getBrandLogo(brandFromTitle);
      }
      return getRandomLogo(); // Use random logo for customer tasks
    }
    return '/logo/logo.png'; // Final fallback
  };

  // Helper function to get brand logo based on brand name
  const getBrandLogo = (brandName: string) => {
    const brandLogos: { [key: string]: string } = {
      'NIKON': 'https://taanimagestore.online/SD01C03_422.png',
      'PEPSICO': 'https://taanimagestore.online/SD01C03_422.png',
      'JAEGER-LECOULTRE': 'https://taanimagestore.online/SD01C03_419.png',
      'MAESA': 'https://taanimagestore.online/SD01C03_189.png',
      'CHANEL': 'https://taanimagestore.online/SD01C03_364.png',
      'DANIEL WELLINGTON': 'https://taanimagestore.online/SD01C03_485.png',
      'TACO BELL': 'https://taanimagestore.online/SD01C03_383.png',
      'RENAULT': 'https://taanimagestore.online/SD01C03_326.png',
      'LOUIS-PHILLIPPE': 'https://taanimagestore.online/SD01C03_101.png',
      'SHISEIDO': 'https://taanimagestore.online/SD01C03_179.png',
      'ROCHAS': 'https://taanimagestore.online/SD01C03_52.png',
      'INTEL': 'https://taanimagestore.online/SD01C03_24.png',
      'STELLA MCCARTNEY': 'https://taanimagestore.online/SD01C03_69.png',
      'KAO': 'https://taanimagestore.online/SD01C03_132.png'
    };
    
    return brandLogos[brandName.toUpperCase()] || getRandomLogo();
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredTasks = taskHistory; // Show all tasks without filtering

  return (
    <div className="min-h-screen bg-gray-50">
      <HomepageHeader />
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Task History</h1>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Summary Stats */}
          {summary && (
            <div className="py-4 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-teal-600">{summary.totalTasks}</p>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">BDT {(summary.totalCommission || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Earned</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{summary.membershipId}</p>
                  <p className="text-sm text-gray-600">Member ID</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Task History List */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task._id} className="bg-white rounded-lg overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              {/* Task Header */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">Task #{task.taskNumber}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-xs text-gray-500">Source: {task.source}</span>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className="justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 flex items-center gap-1 text-green-600 bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Completed
                  </Badge>
                </div>
              </div>

              {/* Task Content */}
              <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 h-40 sm:h-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      alt={task.source === 'campaigns' ? (task.brand || task.taskTitle) : 'Customer Task'} 
                      className="w-full h-full object-contain" 
                      src={getTaskLogo(task)}
                      onError={(e) => {
                        e.currentTarget.src = '/logo/logo.png';
                      }}
                    />
                  </div>
                  <div className="flex flex-1 justify-between mt-2 sm:mt-0">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {task.source === 'campaigns' ? (task.brand || task.taskTitle) : 'Customer Task'}
                      </h3>
                      <span className="text-sm text-gray-500 font-medium">{task.platform}</span>
                      {task.hasGoldenEgg && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-yellow-600 font-medium">🥚 Golden Egg Task</span>
                          {task.selectedEgg && (
                            <span className="text-xs text-yellow-700 font-semibold">
                              (Egg {task.selectedEgg})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-semibold">BDT {(task.taskPrice || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Commission: BDT {(task.commissionEarned || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-gray-100"></div>

                {/* Task Details */}
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">Completed</p>
                    </div>
                    <p>{new Date(task.completedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="font-medium">Commission</p>
                    </div>
                    <p className="text-green-600">BDT {(task.commissionEarned || 0).toLocaleString()}</p>
                  </div>
                  {task.hasGoldenEgg && task.selectedEgg && (
                    <div className="flex flex-col gap-1 text-sm text-gray-600 col-span-2">
                      <div className="flex items-center">
                        <span className="text-yellow-600 mr-2">🥚</span>
                        <p className="font-medium">Golden Egg Selection</p>
                      </div>
                      <p className="text-yellow-700 font-semibold">Selected Egg #{task.selectedEgg}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-600 mb-4">Your completed task history will appear here</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </Card>
        )}
      </div>
      
      <HomepageFooter activePage="history" />
    </div>
  );
}