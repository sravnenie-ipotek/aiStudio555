'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPPORT';
  requireEmailVerification?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireEmailVerification = false,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      if (requireEmailVerification && user && !user.emailVerified) {
        router.push('/auth/verify-email');
        return;
      }

      if (requiredRole && user && user.role !== requiredRole) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requireEmailVerification, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireEmailVerification && user && !user.emailVerified) {
    return null;
  }

  if (requiredRole && user && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
