import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import useAuthStore from '@/store/useAuthStore';
import { ROUTES } from '@/const/routes';

interface PublicRouteProps {
  children: ReactNode;
  redirectIfAuth?: string;
}

/**
 * 인증된 사용자는 접근할 수 없는 라우트 (로그인, 회원가입 등)
 * @description 이미 로그인된 사용자는 메인 페이지로 리다이렉트
 */
export const PublicRoute = ({ 
  children, 
  redirectIfAuth = ROUTES.HOME.path 
}: PublicRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={redirectIfAuth} replace />;
  }

  return <>{children}</>;
};