export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  authorId: number;
  categoryId: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: number;
  name: string;
  profileImageUrl: string | null;
  userCode: string;
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
  categoryId?: number;
  thumbnail?: File;
  isPublished?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  categoryId?: number;
  isPublished?: boolean;
  thumbnail?: File;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
