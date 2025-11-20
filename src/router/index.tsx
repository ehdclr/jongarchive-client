import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import { ROUTES } from '@/const/routes';
import App from '@/App';

const Signin = lazy(() => import('@/pages/Signin'));
const SignUp = lazy(() => import('@/pages/SignUp'));
// const Posts = lazy(() => import('@/pages/Posts'));
// const PostDetail = lazy(() => import('@/pages/Posts/[post_id]'));
// const PostCreate = lazy(() => import('@/pages/Posts/[post_id]/Create'));
// const Profile = lazy(() => import('@/pages/Profile'));

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">페이지 로딩 중...</p>
    </div>
  </div>
);

/**
 * 애플리케이션 라우터
 */
export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.SIGNIN.path}
          element={
            <PublicRoute redirectIfAuth={ROUTES.HOME.path}>
              <Signin />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.SIGNUP.path}
          element={
            <PublicRoute redirectIfAuth={ROUTES.HOME.path}>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route path={ROUTES.HOME.path} element={<ProtectedRoute>
          <App />
        </ProtectedRoute>} />
        <Route path="*" element={<Navigate to={ROUTES.HOME.path} replace />} />
      </Routes>
    </Suspense>
  );
};