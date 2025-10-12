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
  withdrawalBalance?: number; // Temporary hold for loss or post-deposit merging
  holdAmount?: number; // Permanent hold amount when user gets negative commission (stored in users collection)
  storedWithdrawalAmount?: number; // Total withdrawal amount stored in database for negative scenario
  withdrawalStatus?: 'pending' | 'cleared'; // Status of stored withdrawal amount
  depositHistory?: Array<{
    amount: number;
    date: Date;
    type: 'manual' | 'auto';
    transactionId?: string;
  }>;
  lastNegativeTime?: Date; // Track when the loss happened
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
