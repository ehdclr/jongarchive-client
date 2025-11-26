import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route, Navigate } from "react-router";
import { ProtectedRoute, PublicRoute } from "@/components/auth";
import { ROUTES } from "@/const/routes";
import App from "@/App";

// Pages
const Home = lazy(() => import("@/pages/Home"));
const Signin = lazy(() => import("@/pages/Signin"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const AuthCallback = lazy(() => import("@/pages/Auth/Callback"));
const Posts = lazy(() => import("@/pages/Posts"));
const PostNew = lazy(() => import("@/pages/Posts/new"));
const PostDetail = lazy(() => import("@/pages/Posts/[post_id]"));
const PostEdit = lazy(() => import("@/pages/Posts/[post_id]/edit"));
const Profile = lazy(() => import("@/pages/Profile"));
const Chat = lazy(() => import("@/pages/Chat"));

// Route 설정 타입
interface RouteItem {
  path: string;
  element: ComponentType;
}

// Public Routes (인증 불필요, 로그인 시 홈으로 리다이렉트)
const publicRoutes: RouteItem[] = [
  { path: ROUTES.SIGNIN.path, element: Signin },
  { path: ROUTES.SIGNUP.path, element: SignUp },
];

// Protected Routes (인증 필요, 레이아웃 포함)
const protectedRoutes: RouteItem[] = [
  { path: ROUTES.HOME.path, element: Home },
  { path: ROUTES.POSTS.path, element: Posts },
  { path: ROUTES.POST_NEW.path, element: PostNew },
  { path: ROUTES.POST_DETAIL.path, element: PostDetail },
  { path: ROUTES.POST_EDIT.path, element: PostEdit },
  { path: ROUTES.PROFILE.path, element: Profile },
  { path: ROUTES.CHAT.path, element: Chat },
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
        {/* Auth Callback (인증 상태 무관) */}
        <Route path={ROUTES.AUTH_CALLBACK.path} element={<AuthCallback />} />

        {/* Public Routes (레이아웃 없음) */}
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

        {/* Protected Routes (App 레이아웃 포함) */}
        <Route
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME.path} replace />} />
      </Routes>
    </Suspense>
  );
};
