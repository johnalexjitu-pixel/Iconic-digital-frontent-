import mongoose, { Document, Schema } from 'mongoose';

export interface IDeposit extends Document {
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

const DepositSchema = new Schema<IDeposit>({
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
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
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

export default mongoose.models.Deposit || mongoose.model<IDeposit>('Deposit', DepositSchema);

