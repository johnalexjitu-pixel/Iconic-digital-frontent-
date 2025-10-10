import { ObjectId } from 'mongodb';

export interface IDeposit {
  _id?: ObjectId;
  userId: string; // Reference to user's _id
  membershipId: string; // Reference to user's membershipId
  amount: number;
  amountType: 'deposit' | 'bonus' | 'refund';
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  method?: string; // Payment method used
  transactionId?: string; // External transaction reference
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DepositCollection = 'deposits';