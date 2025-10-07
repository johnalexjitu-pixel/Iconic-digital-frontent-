import { ObjectId } from 'mongodb';

export interface IWithdrawal {
  _id?: ObjectId;
  customerId: string;
  amount: number;
  method: 'bank_transfer' | 'mobile_banking' | 'cash' | 'other';
  accountDetails: {
    accountNumber?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  adminNotes?: string;
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string; // Admin ID who processed
  createdAt: Date;
  updatedAt: Date;
}

export const WithdrawalCollection = 'withdrawals';

