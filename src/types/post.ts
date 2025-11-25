export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  authorId: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: number;
  name: string;
  profileImageUrl: string | null;
}

export interface PostWithAuthor {
  post: Post;
  author: Author;
}

export interface PaginatedResponse<T> {
  success: boolean;
  payload: T[];
  meta: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  payload: T;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  thumbnail?: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  isPublished?: boolean;
  thumbnail?: File;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
