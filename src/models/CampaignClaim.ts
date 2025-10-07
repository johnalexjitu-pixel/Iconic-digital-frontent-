import { ObjectId } from 'mongodb';

export interface ICampaignClaim {
  _id?: ObjectId;
  customerId: string;
  taskId: string; // Reference to CustomerTask
  taskNumber: number;
  claimedAt: Date;
  completedAt?: Date;
  status: 'claimed' | 'completed';
  commissionEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CampaignClaimCollection = 'campaignclaims';

