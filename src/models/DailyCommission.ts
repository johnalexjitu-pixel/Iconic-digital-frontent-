import { ObjectId } from 'mongodb';

export interface IDailyCommission {
  _id?: ObjectId;
  userId: string; // User's ObjectId as string
  amount: number; // Commission amount (positive only)
  date: string; // Format: YYYY-MM-DD
  createdAt: Date;
  updatedAt?: Date;
}

export const DailyCommissionCollection = 'dailyCommissions';
