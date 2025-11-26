import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";

export interface FollowUser {
  id: number;
  name: string;
  userCode: string;
  profileImageUrl: string | null;
  bio: string | null;
}

export interface FollowCounts {
  followingCount: number;
  followersCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  payload: T;
  message?: string;
}

export async function followUser(userCode: string): Promise<ApiResponse<null>> {
  const response = await apiClient.post(API_ROUTES.FOLLOWS.FOLLOW.url, { userCode });
  return response.data;
}

export async function unfollowUser(userId: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(API_ROUTES.FOLLOWS.UNFOLLOW(userId).url);
  return response.data;
}

export async function fetchFollowing(): Promise<ApiResponse<FollowUser[]>> {
  const response = await apiClient.get(API_ROUTES.FOLLOWS.FOLLOWING.url);
  return response.data;
}

export async function fetchFollowers(): Promise<ApiResponse<FollowUser[]>> {
  const response = await apiClient.get(API_ROUTES.FOLLOWS.FOLLOWERS.url);
  return response.data;
}

export async function fetchFollowCounts(): Promise<ApiResponse<FollowCounts>> {
  const response = await apiClient.get(API_ROUTES.FOLLOWS.COUNTS.url);
  return response.data;
}

export async function checkIsFollowing(userId: number): Promise<ApiResponse<{ isFollowing: boolean }>> {
  const response = await apiClient.get(API_ROUTES.FOLLOWS.CHECK(userId).url);
  return response.data;
}
