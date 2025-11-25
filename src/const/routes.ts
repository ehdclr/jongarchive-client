/**
 * 라우트 메타데이터
 */
export interface RouteConfig {
  path: string;
  title: string;
  requireAuth: boolean;
}

/**
 * 애플리케이션 라우트 설정
 */
export const ROUTES = {
  // Public Routes
  SIGNIN: {
    path: '/signin',
    title: '로그인',
    requireAuth: false,
  },
  SIGNUP: {
    path: '/signup',
    title: '회원가입',
    requireAuth: false,
  },

  // Protected Routes
  HOME: {
    path: '/',
    title: '홈',
    requireAuth: true,
  },
  POSTS: {
    path: '/posts',
    title: '게시물 목록',
    requireAuth: true,
  },
  POST_NEW: {
    path: '/posts/new',
    title: '게시물 작성',
    requireAuth: true,
  },
  POST_DETAIL: {
    path: '/posts/:post_id',
    title: '게시물 상세',
    requireAuth: true,
  },
  POST_EDIT: {
    path: '/posts/:post_id/edit',
    title: '게시물 수정',
    requireAuth: true,
  },
  PROFILE: {
    path: '/profile',
    title: '프로필',
    requireAuth: true,
  },
  SETTINGS: {
    path: '/settings',
    title: '설정',
    requireAuth: true,
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
  ROUTES.POST_NEW.path,
  ROUTES.POST_DETAIL.path,
  ROUTES.POST_EDIT.path,
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