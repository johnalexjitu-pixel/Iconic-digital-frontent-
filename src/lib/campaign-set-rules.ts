import { ObjectId } from 'mongodb';

export interface ICampaignSetRule {
  depositAmount: number;
  accountBalanceThreshold?: number; // Added for account balance check
  maxCampaignSet: number;
  totalTasksRequired: number;
  tasksPerSet: number[];
  description: string;
}

export const CAMPAIGN_SET_RULES: ICampaignSetRule[] = [
  {
    depositAmount: 0,
    maxCampaignSet: 2,
    totalTasksRequired: 30,
    tasksPerSet: [30],
    description: "New User (No Deposit)"
  },
  {
    depositAmount: 1,
    maxCampaignSet: 3,
    totalTasksRequired: 90,
    tasksPerSet: [30, 30, 30],
    description: "Regular Deposit User"
  },
  {
    depositAmount: 1000000,
    accountBalanceThreshold: 1000000, // VIP users with 1M+ account balance
    maxCampaignSet: 3,
    totalTasksRequired: 92, // 30 + 30 + 32 = 92 total tasks
    tasksPerSet: [30, 30, 32], // Set 3 has 32 tasks instead of 30
    description: "VIP User (1M+ Account Balance)"
  }
];

/**
 * Get campaign set rule based on deposit amount and account balance
 */
export function getCampaignSetRule(depositAmount: number, accountBalance?: number): ICampaignSetRule {
  // Check for VIP users with 1M+ account balance first
  if (accountBalance && accountBalance >= 1000000) {
    return CAMPAIGN_SET_RULES[2]; // VIP User (1M+ Account Balance)
  }
  
  // Fallback to deposit amount logic
  if (depositAmount >= 1000000) {
    return CAMPAIGN_SET_RULES[2]; // VIP User (1M+ Deposit)
  } else if (depositAmount > 0) {
    return CAMPAIGN_SET_RULES[1]; // Regular Deposit User
  } else {
    return CAMPAIGN_SET_RULES[0]; // New User
  }
}

/**
 * Check if user can withdraw based on campaign set and tasks completed
 */
export function canUserWithdraw(campaignsCompleted: number, depositAmount: number, accountBalance?: number): boolean {
  const rule = getCampaignSetRule(depositAmount, accountBalance);
  return campaignsCompleted >= rule.totalTasksRequired;
}

/**
 * Get next campaign set when completing tasks
 */
export function getNextCampaignSet(currentSet: number, depositAmount: number, accountBalance?: number): number {
  const rule = getCampaignSetRule(depositAmount, accountBalance);
  
  if (currentSet < rule.maxCampaignSet) {
    return currentSet + 1;
  }
  
  return currentSet; // Already at max set
}

/**
 * Check if user should progress to next campaign set
 */
export function shouldProgressCampaignSet(campaignsCompleted: number, currentSet: number, depositAmount: number, accountBalance?: number): boolean {
  const rule = getCampaignSetRule(depositAmount, accountBalance);
  
  // For VIP users in set 3, progress after 32 tasks instead of 30
  if (rule.accountBalanceThreshold && rule.accountBalanceThreshold >= 1000000 && currentSet === 3) {
    return campaignsCompleted % 32 === 0 && currentSet < rule.maxCampaignSet;
  }
  
  // Standard progression every 30 tasks
  return campaignsCompleted % 30 === 0 && currentSet < rule.maxCampaignSet;
}
