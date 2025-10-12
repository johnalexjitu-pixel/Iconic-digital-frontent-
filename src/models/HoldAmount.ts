export interface IHoldAmount {
  _id?: string;
  userId: string;
  membershipId: string;
  holdAmount: number;
  reason: 'negative_commission' | 'deposit_hold';
  createdAt: Date;
  updatedAt: Date;
  clearedAt?: Date;
  isActive: boolean;
}

export const HoldAmountCollection = 'holdAmounts';
