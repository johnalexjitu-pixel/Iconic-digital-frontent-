import { ObjectId } from 'mongodb';

export interface ICampaign {
  _id?: ObjectId;
  title: string;
  description: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'pinterest' | 'youtube';
  baseAmount: number; // Company profit (taskPrice)
  maxCommission: number; // Maximum commission user can earn
  minCommission: number; // Minimum commission user can earn
  status: 'active' | 'inactive' | 'completed';
  hasGoldenEgg: boolean;
  expiryDate: Date;
  requirements?: string[];
  instructions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const CampaignCollection = 'campaigns';
