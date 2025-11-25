export const API_ROUTES = {
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
}