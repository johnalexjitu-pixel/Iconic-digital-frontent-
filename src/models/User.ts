import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  withdrawalPassword?: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  membershipId: string;
  referralCode: string;
  creditScore: number;
  avatar?: string;
  accountBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  lastLogin: Date;
  dailyCheckIn: {
    lastCheckIn?: Date;
    streak: number;
    daysClaimed: number[];
  };
  withdrawalInfo?: {
    method: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    branch: string;
    documentsUploaded: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  withdrawalPassword: {
    type: String,
    default: null
  },
  level: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  membershipId: {
    type: String,
    unique: true,
    required: true
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  creditScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  avatar: {
    type: String,
    default: null
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  campaignsCompleted: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  dailyCheckIn: {
    lastCheckIn: {
      type: Date,
      default: null
    },
    streak: {
      type: Number,
      default: 0
    },
    daysClaimed: [{
      type: Number
    }]
  },
  withdrawalInfo: {
    method: String,
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    branch: String,
    documentsUploaded: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ membershipId: 1 });
UserSchema.index({ referralCode: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
