import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";
import type { Category } from "@/types/post";

interface CategoriesResponse {
  success: boolean;
  payload: Category[];
}

interface CategoryResponse {
  success: boolean;
  payload: Category;
}

// 전체 카테고리 목록 조회
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<CategoriesResponse>(
        API_ROUTES.CATEGORIES.LIST.url
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
}

// 단일 카테고리 조회
export function useCategory(id: number) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const response = await apiClient.get<CategoryResponse>(
        API_ROUTES.CATEGORIES.DETAIL(id).url
      );
      return response.data;
    },
    enabled: !!id,
  });
}
