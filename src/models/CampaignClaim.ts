import { ObjectId } from 'mongodb';

export interface ICampaignClaim {
  _id?: ObjectId;
  customerId: string;
  taskId: string; // Reference to CustomerTask or generated task ID
  claimedAt: Date;
  completedAt?: Date;
  status: 'claimed' | 'completed';
  campaignId?: string; // Reference to original campaign if from campaigns
  commissionEarned?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CampaignClaimCollection = 'campaignclaims';

