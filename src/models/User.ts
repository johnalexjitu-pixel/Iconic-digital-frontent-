import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  username: string;
  number?: string;
  password: string;
  withdrawalPassword?: string;
  gender: 'male' | 'female' | 'other';
  membershipId?: string;
  referralCode?: string;
  referStatus: 'active' | 'inactive';
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  creditScore: number;
  accountBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  campaignSet: number[];
  campaignCommission: number;
  depositCount: number;
  trialBalance: number;
  campaignStatus: 'active' | 'inactive';
  withdrawStatus: 'active' | 'inactive';
  accountStatus: 'active' | 'inactive';
  dailyCheckIn: {
    lastCheckIn: Date | null;
    streak: number;
    daysClaimed: string[];
  };
  isActive: boolean;
  allowTask: boolean;
  lastLogin?: Date;
  withdrawalInfo?: {
    accountNumber?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const UserCollection = 'users';
