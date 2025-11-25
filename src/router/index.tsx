import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute, PublicRoute } from "@/components/auth";
import { ROUTES } from "@/const/routes";

// Pages
const Home = lazy(() => import("@/App"));
const Signin = lazy(() => import("@/pages/Signin"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Posts = lazy(() => import("@/pages/Posts"));
const PostNew = lazy(() => import("@/pages/Posts/new"));
const PostDetail = lazy(() => import("@/pages/Posts/[post_id]"));
const PostEdit = lazy(() => import("@/pages/Posts/[post_id]/edit"));

// Route 설정 타입
interface RouteItem {
  path: string;
  element: ComponentType;
  isPublic?: boolean;
}

// Public Routes (인증 불필요, 로그인 시 홈으로 리다이렉트)
const publicRoutes: RouteItem[] = [
  { path: ROUTES.SIGNIN.path, element: Signin, isPublic: true },
  { path: ROUTES.SIGNUP.path, element: SignUp, isPublic: true },
];

// Protected Routes (인증 필요)
const protectedRoutes: RouteItem[] = [
  { path: ROUTES.HOME.path, element: Home },
  { path: ROUTES.POSTS.path, element: Posts },
  { path: ROUTES.POST_NEW.path, element: PostNew },
  { path: ROUTES.POST_DETAIL.path, element: PostDetail },
  { path: ROUTES.POST_EDIT.path, element: PostEdit },
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
      <p className="mt-4 text-gray-600">페이지 로딩 중...</p>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              <PublicRoute redirectIfAuth={ROUTES.HOME.path}>
                <Element />
              </PublicRoute>
            }
          />
        ))}

        {/* Protected Routes */}
        {protectedRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Element />
              </ProtectedRoute>
            }
          />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME.path} replace />} />
      </Routes>
    </Suspense>
  );
};
