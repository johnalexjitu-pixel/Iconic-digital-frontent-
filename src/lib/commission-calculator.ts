/**
 * Commission Calculator based on Account Balance
 * Higher balance = Higher commission potential
 */

export interface CommissionTier {
  minBalance: number;
  maxBalance: number;
  minCommission: number;
  maxCommission: number;
  maxTotalCommission: number; // Maximum total commission per day
  description: string;
}

export const COMMISSION_TIERS: CommissionTier[] = [
  {
    minBalance: 0,
    maxBalance: 10000,
    minCommission: 20,
    maxCommission: 38,
    maxTotalCommission: 1000,
    description: "Basic Tier (0-10K)"
  },
  {
    minBalance: 10001,
    maxBalance: 20000,
    minCommission: 25,
    maxCommission: 35,
    maxTotalCommission: 1000,
    description: "Bronze Tier (10K-20K)"
  },
  {
    minBalance: 20001,
    maxBalance: 30000,
    minCommission: 100,
    maxCommission: 200,
    maxTotalCommission: 3000,
    description: "Silver Tier (20K-30K)"
  },
  {
    minBalance: 30001,
    maxBalance: 50000,
    minCommission: 200,
    maxCommission: 400,
    maxTotalCommission: 4000,
    description: "Gold Tier (30K-50K)"
  },
  {
    minBalance: 50001,
    maxBalance: 100000,
    minCommission: 400,
    maxCommission: 800,
    maxTotalCommission: 5000,
    description: "Platinum Tier (50K-100K)"
  },
  {
    minBalance: 100001,
    maxBalance: 200000,
    minCommission: 800,
    maxCommission: 1500,
    maxTotalCommission: 6000,
    description: "Diamond Tier (100K-200K)"
  },
  {
    minBalance: 200001,
    maxBalance: 500000,
    minCommission: 1500,
    maxCommission: 3000,
    maxTotalCommission: 7000,
    description: "Master Tier (200K-500K)"
  },
  {
    minBalance: 500001,
    maxBalance: 1000000,
    minCommission: 3000,
    maxCommission: 6000,
    maxTotalCommission: 8000,
    description: "Elite Tier (500K-1M)"
  },
  {
    minBalance: 1000001,
    maxBalance: Infinity,
    minCommission: 6000,
    maxCommission: 10000,
    maxTotalCommission: 9000,
    description: "Legendary Tier (1M+)"
  }
];

/**
 * Calculate commission based on account balance
 * @param accountBalance - User's current account balance
 * @returns Commission amount (random within tier limits)
 */
export function calculateCommission(accountBalance: number): number {
  // Find the appropriate tier for the user's balance
  const tier = COMMISSION_TIERS.find(t => 
    accountBalance >= t.minBalance && accountBalance <= t.maxBalance
  );

  if (!tier) {
    // Fallback to basic tier if no tier found
    return Math.floor(Math.random() * (50 - 20 + 1)) + 20;
  }

  // Generate random commission within the tier limits
  const commission = Math.floor(
    Math.random() * (tier.maxCommission - tier.minCommission + 1)
  ) + tier.minCommission;

  return commission;
}

/**
 * Get commission tier information for a given balance
 * @param accountBalance - User's current account balance
 * @returns Commission tier information
 */
export function getCommissionTier(accountBalance: number): CommissionTier | null {
  return COMMISSION_TIERS.find(t => 
    accountBalance >= t.minBalance && accountBalance <= t.maxBalance
  ) || null;
}

/**
 * Get maximum possible commission for a given balance
 * @param accountBalance - User's current account balance
 * @returns Maximum commission amount
 */
export function getMaxCommission(accountBalance: number): number {
  const tier = getCommissionTier(accountBalance);
  return tier ? tier.maxCommission : 50;
}

/**
 * Get minimum possible commission for a given balance
 * @param accountBalance - User's current account balance
 * @returns Minimum commission amount
 */
export function getMinCommission(accountBalance: number): number {
  const tier = getCommissionTier(accountBalance);
  return tier ? tier.minCommission : 20;
}

/**
 * Get maximum total commission per day for a given balance
 * @param accountBalance - User's current account balance
 * @returns Maximum total commission amount per day
 */
export function getMaxTotalCommission(accountBalance: number): number {
  const tier = getCommissionTier(accountBalance);
  return tier ? tier.maxTotalCommission : 1000;
}
