import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuthStore from '@/store/useAuthStore';
import { ROUTES } from '@/const/routes';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * @description 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */
export const ProtectedRoute = ({ 
  children, 
  redirectTo = ROUTES.SIGNIN.path 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      fetchUser();
    }
  }, [isAuthenticated, isLoading, fetchUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};