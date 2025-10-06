import { NextRequest } from 'next/server';

export interface User {
  _id: string;
  name: string;
  email: string;
  level: string;
  membershipId: string;
  referralCode: string;
  creditScore: number;
  accountBalance: number;
  totalEarnings: number;
  campaignsCompleted: number;
  lastLogin: Date;
  dailyCheckIn: {
    lastCheckIn?: Date;
    streak: number;
    daysClaimed: number[];
  };
}

export function getUserFromRequest(request: NextRequest): User | null {
  // In a real app, you'd get this from JWT token or session
  // For now, return null to force proper authentication
  return null;
}

export function requireAuth(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication required',
          redirect: '/auth/login'
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, user);
  };
}
