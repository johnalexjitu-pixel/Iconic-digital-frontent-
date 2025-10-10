'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HomepageHeader } from '@/components/HomepageHeader';
import { HomepageFooter } from '@/components/HomepageFooter';
import { AccountStatusChecker } from '@/components/AccountStatusChecker';

interface TestResult {
  success: boolean;
  data?: {
    userId: string;
    username: string;
    membershipId: string;
    beforeUpdate: {
      accountBalance: number;
      campaignsCompleted: number;
      campaignCommission: number;
      totalEarnings: number;
    };
    afterUpdate: {
      accountBalance: number;
      campaignsCompleted: number;
      campaignCommission: number;
      totalEarnings: number;
    };
    updateResult: {
      matchedCount: number;
      modifiedCount: number;
      acknowledged: boolean;
    };
    apiTestResults: Record<string, unknown>;
    testCommission: number;
  };
  error?: string;
}

export default function TestTaskCompletionPage() {
  const { user, loading } = useAuth();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [userData, setUserData] = useState<{
    user: {
      username: string;
      membershipId: string;
      accountBalance: number;
      campaignsCompleted: number;
      campaignCommission: number;
      totalEarnings: number;
      depositCount: number;
      campaignStatus: string;
    };
    pendingTasks: number;
    activeCampaigns: number;
    canCompleteTasks: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      const response = await fetch(`/api/test-task-completion?userId=${user._id}`);
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    }
  }, [user?._id]);

  const runTest = async (testType: 'customer-tasks' | 'campaigns') => {
    if (!user?._id) return;
    
    setIsTesting(true);
    setTestResult(null);
    setError(null);
    
    try {
      console.log(`🧪 Running ${testType} test for user: ${user.username}`);
      
      const response = await fetch('/api/test-task-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          testType: testType
        }),
      });
      
      const result = await response.json();
      console.log('Test result:', result);
      
      setTestResult(result);
      
      // Refresh user data after test
      await fetchUserData();
      
    } catch (err) {
      console.error('Test error:', err);
      setError('Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to run tests.</p>
        </div>
      </div>
    );
  }

  return (
    <AccountStatusChecker>
      <div className="min-h-screen bg-gray-50">
        <HomepageHeader user={{ username: user.username, level: user.level || 'Bronze', avatar: user.avatar }} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Completion Test</h1>
            
            {/* Current User Data */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Current User Data</h2>
              {userData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Username</div>
                    <div className="font-semibold">{userData.user.username}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Membership ID</div>
                    <div className="font-semibold">{userData.user.membershipId}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Account Balance</div>
                    <div className="font-semibold text-green-600">BDT {userData.user.accountBalance?.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Campaigns Completed</div>
                    <div className="font-semibold text-blue-600">{userData.user.campaignsCompleted}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Campaign Commission</div>
                    <div className="font-semibold text-purple-600">BDT {userData.user.campaignCommission?.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Total Earnings</div>
                    <div className="font-semibold text-orange-600">BDT {userData.user.totalEarnings?.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Deposit Count</div>
                    <div className="font-semibold text-gray-600">{userData.user.depositCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Campaign Status</div>
                    <div className={`font-semibold ${userData.user.campaignStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {userData.user.campaignStatus}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading user data...</div>
              )}
            </Card>

            {/* Available Tasks */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
              {userData ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Pending Customer Tasks</div>
                    <div className="font-semibold text-blue-600">{userData.pendingTasks}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Active Campaigns</div>
                    <div className="font-semibold text-green-600">{userData.activeCampaigns}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Loading task data...</div>
              )}
            </Card>

            {/* Test Buttons */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Run Tests</h2>
              <div className="flex gap-4">
                <Button 
                  onClick={() => runTest('customer-tasks')}
                  disabled={isTesting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isTesting ? 'Testing...' : 'Test Customer Tasks API'}
                </Button>
                <Button 
                  onClick={() => runTest('campaigns')}
                  disabled={isTesting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isTesting ? 'Testing...' : 'Test Campaigns API'}
                </Button>
                <Button 
                  onClick={fetchUserData}
                  disabled={isTesting}
                  variant="outline"
                >
                  Refresh Data
                </Button>
              </div>
            </Card>

            {/* Test Results */}
            {testResult && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                {testResult.success ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Before Update</h3>
                        <div className="space-y-1 text-sm">
                          <div>Account Balance: <span className="font-mono">BDT {testResult.data?.beforeUpdate.accountBalance}</span></div>
                          <div>Campaigns Completed: <span className="font-mono">{testResult.data?.beforeUpdate.campaignsCompleted}</span></div>
                          <div>Campaign Commission: <span className="font-mono">BDT {testResult.data?.beforeUpdate.campaignCommission}</span></div>
                          <div>Total Earnings: <span className="font-mono">BDT {testResult.data?.beforeUpdate.totalEarnings}</span></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">After Update</h3>
                        <div className="space-y-1 text-sm">
                          <div>Account Balance: <span className="font-mono text-green-600">BDT {testResult.data?.afterUpdate.accountBalance}</span></div>
                          <div>Campaigns Completed: <span className="font-mono text-blue-600">{testResult.data?.afterUpdate.campaignsCompleted}</span></div>
                          <div>Campaign Commission: <span className="font-mono text-purple-600">BDT {testResult.data?.afterUpdate.campaignCommission}</span></div>
                          <div>Total Earnings: <span className="font-mono text-orange-600">BDT {testResult.data?.afterUpdate.totalEarnings}</span></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Database Update Result</h3>
                      <div className="space-y-1 text-sm">
                        <div>Matched Count: <span className="font-mono">{testResult.data?.updateResult.matchedCount}</span></div>
                        <div>Modified Count: <span className="font-mono">{testResult.data?.updateResult.modifiedCount}</span></div>
                        <div>Acknowledged: <span className="font-mono">{testResult.data?.updateResult.acknowledged ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-700 mb-2">Test Commission</h3>
                      <div className="text-lg font-semibold text-green-600">
                        BDT {testResult.data?.testCommission}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <h3 className="font-semibold">Test Failed</h3>
                    <p>{testResult.error}</p>
                  </div>
                )}
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Card className="p-6 mb-6 border-red-200 bg-red-50">
                <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                <p className="text-red-600">{error}</p>
              </Card>
            )}
          </div>
        </div>
        
        <HomepageFooter />
      </div>
    </AccountStatusChecker>
  );
}
