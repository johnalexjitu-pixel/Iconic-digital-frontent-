import { ObjectId } from 'mongodb';

export interface ICustomerTask {
  _id?: ObjectId;
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

export const CustomerTaskCollection = 'customertasks';

