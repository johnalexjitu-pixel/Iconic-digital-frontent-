"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AccountStatusCheckerProps {
  children: React.ReactNode;
}

export function AccountStatusChecker({ children }: AccountStatusCheckerProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccountStatus = async () => {
      if (loading) return;
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Check if user's account status is active
      if (user.accountStatus === 'inactive') {
        // Clear user data and redirect to login with message
        localStorage.removeItem('user');
        router.push('/auth/login?message=Your account is inactive. Please contact support for activation.');
        return;
      }

      setIsChecking(false);
    };

    checkAccountStatus();
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking account status...</p>
        </div>
      </div>
    );
  }

  // Only render children if account is active
  if (user?.accountStatus === 'active') {
    return <>{children}</>;
  }

  // This should not be reached due to the redirect above, but just in case
  return null;
}
