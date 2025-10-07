import { ObjectId } from 'mongodb';

export interface IWithdrawal {
  _id?: ObjectId;
  customerId: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'roket' | 'bank' | 'usdt';
  accountDetails: {
    accountNumber?: string;
    bankName?: string;
    mobileNumber?: string;
    provider?: string;
    accountHolderName?: string;
    branch?: string;
    usdtAddress?: string;
    usdtNetwork?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNotes?: string;
  submittedAt: Date;
  processedAt?: Date;
  processedBy?: string; // Admin ID who processed
  createdAt: Date;
  updatedAt: Date;
}

export const WithdrawalCollection = 'withdrawals';

