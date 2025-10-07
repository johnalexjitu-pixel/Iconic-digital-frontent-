import { ObjectId } from 'mongodb';

export interface IDeposit {
  _id?: ObjectId;
  customerId: string;
  amount: number;
  method: 'bank_transfer' | 'mobile_banking' | 'cash' | 'other';
  transactionId?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string; // Admin ID who processed
  createdAt: Date;
  updatedAt: Date;
}

export const DepositCollection = 'deposits';

