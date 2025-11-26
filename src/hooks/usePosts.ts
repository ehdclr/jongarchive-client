import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  fetchPosts,
  fetchPost,
  fetchMyPosts,
  fetchPostsByCategory,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
} from "@/services/postService";
import type {
  CreatePostRequest,
  UpdatePostRequest,
  PaginationParams,
} from "@/types/post";

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  myPosts: () => [...postKeys.all, "my"] as const,
};

export function usePostsInfinite(limit = 10) {
  return useInfiniteQuery({
    queryKey: [...postKeys.lists(), { limit }],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
}

export function usePosts(params: PaginationParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => fetchPosts(params),
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}

export function useMyPosts(params: PaginationParams = {}) {
  return useQuery({
    queryKey: postKeys.myPosts(),
    queryFn: () => fetchMyPosts(params),
  });
}

export function usePostsByCategory(
  categoryId: number | null,
  params: PaginationParams = {}
) {
  return useQuery({
    queryKey: [...postKeys.lists(), "category", categoryId, params],
    queryFn: () => fetchPostsByCategory(categoryId!, params),
    enabled: !!categoryId,
  });
}

export function usePostsByCategoryInfinite(
  categoryId: number | null,
  limit = 10
) {
  return useInfiniteQuery({
    queryKey: [...postKeys.lists(), "category", categoryId],
    queryFn: ({ pageParam = 1 }) =>
      fetchPostsByCategory(categoryId!, { page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!categoryId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      isPublished ? unpublishPost(id) : publishPost(id),
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(id) });
      const previous = queryClient.getQueryData(postKeys.detail(id));
      queryClient.setQueryData(postKeys.detail(id), (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const typedOld = old as {
          payload: { post: { isPublished: boolean } };
        };
        return {
          ...typedOld,
          payload: {
            ...typedOld.payload,
            post: { ...typedOld.payload.post, isPublished: !isPublished },
          },
        };
      });
      return { previous };
    },
    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postKeys.detail(variables.id), context.previous);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
    },
  });
}
