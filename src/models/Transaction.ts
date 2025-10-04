import mongoose from 'mongoose';

export interface ITransaction {
  _id?: string;
  transactionId: string;
  userId: string;
  type: 'campaign_earning' | 'withdrawal' | 'deposit' | 'daily_bonus' | 'referral_bonus';
  amount: number;
  description: string;
  campaignId?: string;
  status: 'completed' | 'processing' | 'failed' | 'cancelled';
  method?: string; // For deposits/withdrawals
  reference?: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['campaign_earning', 'withdrawal', 'deposit', 'daily_bonus', 'referral_bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  campaignId: {
    type: String,
    ref: 'Campaign',
    default: null
  },
  status: {
    type: String,
    enum: ['completed', 'processing', 'failed', 'cancelled'],
    default: 'processing'
  },
  method: {
    type: String,
    default: null
  },
  reference: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
