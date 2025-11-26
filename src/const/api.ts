export const API_ROUTES = {
  CATEGORIES: {
    LIST: {
      url: '/categories',
      method: 'GET',
    },
    DETAIL: (id: number) => ({
      url: `/categories/${id}`,
      method: 'GET',
    }),
  },
  AUTH: {
    REFRESH: {
      url: '/auth/refresh',
      method: 'POST',
    },
    SIGNIN: {
      url: '/auth/signin',
      method: 'POST',
    },
    LOGOUT: {
      url: '/auth/logout',
      method: 'POST',
    },
    SET_COOKIES: {
      url: '/auth/set-cookies',
      method: 'POST',
    },
  },
  USERS: {
    SIGNUP: {
      url: '/users',
      method: 'POST',
    },
    ME: {
      url: '/users/me',
      method: 'GET',
    },
    UPDATE_ME: {
      url: '/users/me',
      method: 'PUT',
    },
    UPDATE_PROFILE_IMAGE: {
      url: '/users/me/profile-image',
      method: 'PUT',
    },
    BY_USER_CODE: (userCode: string) => ({
      url: `/users/${userCode}`,
      method: 'GET',
    }),
    DELETE_ME: {
      url: '/users/me',
      method: 'DELETE',
    },
  },
  POSTS: {
    LIST: {
      url: '/posts',
      method: 'GET',
    },
    DETAIL: (id: number) => ({
      url: `/posts/${id}`,
      method: 'GET',
    }),
    MY_POSTS: {
      url: '/posts/me/posts',
      method: 'GET',
    },
    BY_AUTHOR: (authorId: number) => ({
      url: `/posts/author/${authorId}`,
      method: 'GET',
    }),
    BY_CATEGORY: (categoryId: number) => ({
      url: `/posts/category/${categoryId}`,
      method: 'GET',
    }),
    CREATE: {
      url: '/posts',
      method: 'POST',
    },
    UPDATE: (id: number) => ({
      url: `/posts/${id}`,
      method: 'PUT',
    }),
    DELETE: (id: number) => ({
      url: `/posts/${id}`,
      method: 'DELETE',
    }),
    PUBLISH: (id: number) => ({
      url: `/posts/${id}/publish`,
      method: 'PATCH',
    }),
    UNPUBLISH: (id: number) => ({
      url: `/posts/${id}/unpublish`,
      method: 'PATCH',
    }),
  },
  FOLLOWS: {
    FOLLOW: {
      url: '/follows',
      method: 'POST',
    },
    UNFOLLOW: (userId: number) => ({
      url: `/follows/${userId}`,
      method: 'DELETE',
    }),
    FOLLOWING: {
      url: '/follows/following',
      method: 'GET',
    },
    FOLLOWERS: {
      url: '/follows/followers',
      method: 'GET',
    },
    COUNTS: {
      url: '/follows/counts',
      method: 'GET',
    },
    CHECK: (userId: number) => ({
      url: `/follows/check/${userId}`,
      method: 'GET',
    }),
  },
}