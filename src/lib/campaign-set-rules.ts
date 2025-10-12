import { ObjectId } from 'mongodb';

export interface ICampaignSetRule {
  depositAmount: number;
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
    maxCampaignSet: 3,
    totalTasksRequired: 92,
    tasksPerSet: [30, 30, 32],
    description: "VIP User (1M+ Deposit)"
  }
];

/**
 * Get campaign set rule based on deposit amount
 */
export function getCampaignSetRule(depositAmount: number): ICampaignSetRule {
  if (depositAmount >= 1000000) {
    return CAMPAIGN_SET_RULES[2]; // VIP User
  } else if (depositAmount > 0) {
    return CAMPAIGN_SET_RULES[1]; // Regular Deposit User
  } else {
    return CAMPAIGN_SET_RULES[0]; // New User
  }
}

/**
 * Check if user can withdraw based on campaign set and tasks completed
 */
export function canUserWithdraw(campaignsCompleted: number, depositAmount: number): boolean {
  const rule = getCampaignSetRule(depositAmount);
  return campaignsCompleted >= rule.totalTasksRequired;
}

/**
 * Get next campaign set when completing 30 tasks
 */
export function getNextCampaignSet(currentSet: number, depositAmount: number): number {
  const rule = getCampaignSetRule(depositAmount);
  
  if (currentSet < rule.maxCampaignSet) {
    return currentSet + 1;
  }
  
  return currentSet; // Already at max set
}

/**
 * Check if user should progress to next campaign set
 */
export function shouldProgressCampaignSet(campaignsCompleted: number, currentSet: number, depositAmount: number): boolean {
  const rule = getCampaignSetRule(depositAmount);
  
  // Progress every 30 tasks, but not beyond max set
  return campaignsCompleted % 30 === 0 && currentSet < rule.maxCampaignSet;
}
