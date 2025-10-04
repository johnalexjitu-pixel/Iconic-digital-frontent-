import mongoose from 'mongoose';

export interface ICampaign {
  _id?: string;
  campaignId: string;
  code: string;
  brand: string;
  logo: string;
  description: string;
  type: 'Social' | 'Paid' | 'Creative' | 'Influencer';
  commissionRate: number;
  commissionAmount: number;
  baseAmount: number;
  profit: number;
  taskCode: string;
  status: 'Active' | 'Completed' | 'Pending' | 'Cancelled';
  requirements: string[];
  duration: number; // in days
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new mongoose.Schema<ICampaign>({
  campaignId: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Social', 'Paid', 'Creative', 'Influencer'],
    required: true
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  commissionAmount: {
    type: Number,
    required: true
  },
  baseAmount: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  taskCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Pending', 'Cancelled'],
    default: 'Active'
  },
  requirements: [{
    type: String
  }],
  duration: {
    type: Number,
    default: 7
  },
  maxParticipants: {
    type: Number,
    default: 1000
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
CampaignSchema.index({ campaignId: 1 });
CampaignSchema.index({ code: 1 });
CampaignSchema.index({ brand: 1 });
CampaignSchema.index({ type: 1 });
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ isActive: 1 });

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
