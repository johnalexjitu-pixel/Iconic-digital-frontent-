import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaignClaim extends Document {
  customerId: string;
  taskId: string; // Reference to CustomerTask
  taskNumber: number;
  claimedAt: Date;
  completedAt?: Date;
  status: 'claimed' | 'completed';
  commissionEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignClaimSchema = new Schema<ICampaignClaim>({
  customerId: {
    type: String,
    required: true,
    index: true
  },
  taskId: {
    type: String,
    required: true,
    index: true
  },
  taskNumber: {
    type: Number,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['claimed', 'completed'],
    default: 'claimed'
  },
  commissionEarned: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure a user can only claim each task once
CampaignClaimSchema.index({ customerId: 1, taskId: 1 }, { unique: true });

export default mongoose.models.CampaignClaim || mongoose.model<ICampaignClaim>('CampaignClaim', CampaignClaimSchema);

