import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";
import type {
  Post,
  PostWithAuthor,
  PaginatedResponse,
  SingleResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PaginationParams,
} from "@/types/post";

export async function fetchPosts(
  params: PaginationParams = {}
): Promise<PaginatedResponse<PostWithAuthor>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const url = searchParams.toString()
    ? `${API_ROUTES.POSTS.LIST.url}?${searchParams}`
    : API_ROUTES.POSTS.LIST.url;

  const response = await apiClient.get(url);
  return response.data;
}

export async function fetchPost(
  id: number
): Promise<SingleResponse<PostWithAuthor>> {
  const response = await apiClient.get(API_ROUTES.POSTS.DETAIL(id).url);
  return response.data;
}

export async function fetchMyPosts(
  params: PaginationParams = {}
): Promise<PaginatedResponse<PostWithAuthor>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const url = searchParams.toString()
    ? `${API_ROUTES.POSTS.MY_POSTS.url}?${searchParams}`
    : API_ROUTES.POSTS.MY_POSTS.url;

  const response = await apiClient.get(url);
  return response.data;
}

export async function fetchPostsByAuthor(
  authorId: number,
  params: PaginationParams = {}
): Promise<PaginatedResponse<PostWithAuthor>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const baseUrl = API_ROUTES.POSTS.BY_AUTHOR(authorId).url;
  const url = searchParams.toString() ? `${baseUrl}?${searchParams}` : baseUrl;

  const response = await apiClient.get(url);
  return response.data;
}

export async function fetchPostsByCategory(
  categoryId: number,
  params: PaginationParams = {}
): Promise<PaginatedResponse<PostWithAuthor>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const baseUrl = API_ROUTES.POSTS.BY_CATEGORY(categoryId).url;
  const url = searchParams.toString() ? `${baseUrl}?${searchParams}` : baseUrl;

  const response = await apiClient.get(url);
  return response.data;
}

export async function createPost(
  data: CreatePostRequest
): Promise<SingleResponse<Post>> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  if (data.categoryId) {
    formData.append("categoryId", String(data.categoryId));
  }
  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }
  if (data.isPublished !== undefined) {
    formData.append("isPublished", String(data.isPublished));
  }

  const response = await apiClient.post(API_ROUTES.POSTS.CREATE.url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updatePost(
  id: number,
  data: UpdatePostRequest
): Promise<SingleResponse<Post>> {
  const formData = new FormData();
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.content !== undefined) formData.append("content", data.content);
  if (data.categoryId !== undefined)
    formData.append("categoryId", String(data.categoryId));
  if (data.isPublished !== undefined)
    formData.append("isPublished", String(data.isPublished));
  if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

  const response = await apiClient.put(
    API_ROUTES.POSTS.UPDATE(id).url,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}

export async function deletePost(id: number): Promise<SingleResponse<null>> {
  const response = await apiClient.delete(API_ROUTES.POSTS.DELETE(id).url);
  return response.data;
}

export async function publishPost(id: number): Promise<SingleResponse<Post>> {
  const response = await apiClient.patch(API_ROUTES.POSTS.PUBLISH(id).url);
  return response.data;
}

export async function unpublishPost(id: number): Promise<SingleResponse<Post>> {
  const response = await apiClient.patch(API_ROUTES.POSTS.UNPUBLISH(id).url);
  return response.data;
}
