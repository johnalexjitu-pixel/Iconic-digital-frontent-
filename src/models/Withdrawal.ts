import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawal extends Document {
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

const WithdrawalSchema = new Schema<IWithdrawal>({
  customerId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    enum: ['bank_transfer', 'mobile_banking', 'cash', 'other'],
    required: true
  },
  accountDetails: {
    accountNumber: String,
    bankName: String,
    mobileNumber: String,
    provider: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);

