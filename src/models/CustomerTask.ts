import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerTask extends Document {
  customerId: string;
  taskNumber: number; // 1-30
  taskPrice: number;
  taskCommission: number;
  taskTitle: string;
  taskDescription: string;
  platform: string;
  status: 'pending' | 'active' | 'completed' | 'claimed';
  claimedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerTaskSchema = new Schema<ICustomerTask>({
  customerId: {
    type: String,
    required: true,
    index: true
  },
  taskNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  taskPrice: {
    type: Number,
    required: true,
    default: 0
  },
  taskCommission: {
    type: Number,
    required: true,
    default: 0
  },
  taskTitle: {
    type: String,
    required: true
  },
  taskDescription: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'claimed'],
    default: 'pending'
  },
  claimedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure unique task per customer
CustomerTaskSchema.index({ customerId: 1, taskNumber: 1 }, { unique: true });

export default mongoose.models.CustomerTask || mongoose.model<ICustomerTask>('CustomerTask', CustomerTaskSchema);

