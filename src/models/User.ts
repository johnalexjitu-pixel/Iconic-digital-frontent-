import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  withdrawalPassword?: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  membershipId: string;
  referralCode: string;
  creditScore: number;
  accountBalance: number;
  walletBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  todayCommission: number;
  withdrawalAmount: number;
  dailyCampaignsCompleted: number;
  dailyCheckIn: {
    lastCheckIn: Date | null;
    streak: number;
    daysClaimed: string[];
  };
  lastLogin?: Date;
  phoneNumber?: string;
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
