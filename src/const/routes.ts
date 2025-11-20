/**
 * 라우트 메타데이터
 */
export interface RouteConfig {
  path: string;
  title: string;
  requireAuth: boolean; // 인증 필요 여부
  redirectIfAuth?: string; // 인증되어 있을 때 리다이렉트할 경로
  redirectIfNotAuth?: string; // 인증되지 않았을 때 리다이렉트할 경로
}

/**
 * 애플리케이션 라우트 설정
 */
export const ROUTES = {
  // Public Routes (인증 불필요)
  SIGNIN: {
    path: '/signin',
    title: '로그인',
    requireAuth: false,
    redirectIfAuth: '/', // 이미 로그인되어 있으면 메인으로
  },
  SIGNUP: {
    path: '/signup',
    title: '회원가입',
    requireAuth: false,
    redirectIfAuth: '/', // 이미 로그인되어 있으면 메인으로
  },
  HOME: {
    path: '/',
    title: '홈',
    requireAuth: true,
    redirectIfNotAuth: '/signin',
  },
  POSTS: {
    path: '/posts',
    title: '포스트 목록',
    requireAuth: true,
    redirectIfNotAuth: '/signin',
  },
  POST_DETAIL: {
    path: '/posts/:id',
    title: '포스트 상세',
    requireAuth: true,
    redirectIfNotAuth: '/signin',
  },
  POST_CREATE: {
    path: '/posts/:id/create',
    title: '포스트 작성',
    requireAuth: true,
    redirectIfNotAuth: '/signin',
  },
  PROFILE: {
    path: '/profile',
    title: '프로필',
    requireAuth: true,
    redirectIfNotAuth: '/signin',
  },
  SETTINGS: {
    path: '/settings',
    title: '설정',
    requireAuth: true,
    redirectIfNotAuth: '/signin',
  },
} as const;

/**
 * Public 라우트 경로 목록
 */
export const PUBLIC_PATHS = [
  ROUTES.SIGNIN.path,
  ROUTES.SIGNUP.path,
];

/**
 * Protected 라우트 경로 목록
 */
export const PROTECTED_PATHS = [
  ROUTES.HOME.path,
  ROUTES.POSTS.path,
  ROUTES.POST_DETAIL.path,
  ROUTES.POST_CREATE.path,
  ROUTES.PROFILE.path,
  ROUTES.SETTINGS.path,
];

/**
 * 경로가 Public인지 확인
 */
export const isPublicPath = (pathname: string): boolean => {
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
};

/**
 * 경로가 Protected인지 확인
 */
export const isProtectedPath = (pathname: string): boolean => {
  return PROTECTED_PATHS.some(path => {
    // 동적 라우트 패턴 매칭 (예: /posts/:id)
    const pattern = path.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });
};