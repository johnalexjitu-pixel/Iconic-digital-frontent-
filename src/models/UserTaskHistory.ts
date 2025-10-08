import { ObjectId } from 'mongodb';

export interface IUserTaskHistory {
  _id?: ObjectId;
  membershipId: string; // User's membership ID
  customerCode?: string; // Customer code if available
  taskId: string; // Reference to the completed task
  taskNumber: number; // Sequential task number
  taskTitle: string; // Task title
  taskDescription?: string; // Task description
  platform: string; // Platform (Social, General, etc.)
  commissionEarned: number; // Commission earned from this task
  taskPrice: number; // Original task price
  source: 'customerTasks' | 'campaigns'; // Source of the task
  campaignId?: string; // Reference to campaign if from campaigns
  hasGoldenEgg?: boolean; // Whether task had golden egg
  completedAt: Date; // When the task was completed
  createdAt: Date;
  updatedAt: Date;
}

export const UserTaskHistoryCollection = 'usertaskhistory';
