import { ObjectId } from 'mongodb';

export interface ICustomerTask {
  _id?: ObjectId;
  customerId: string; // Reference to user's _id
  customerCode: string; // Same as user's membershipId
  taskNumber: number;
  campaignId: string; // Reference to campaign
  taskCommission: number;
  taskPrice: number; // Company profit (baseAmount from campaigns)
  estimatedNegativeAmount: number;
  priceFrom: number;
  priceTo: number;
  hasGoldenEgg: boolean;
  expiredDate: Date;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const CustomerTaskCollection = 'customerTasks';