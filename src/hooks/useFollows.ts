import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  unfollowUser,
  fetchFollowing,
  fetchFollowers,
  fetchFollowCounts,
  checkIsFollowing,
} from "@/services/followService";

export const followKeys = {
  all: ["follows"] as const,
  following: () => [...followKeys.all, "following"] as const,
  followers: () => [...followKeys.all, "followers"] as const,
  counts: () => [...followKeys.all, "counts"] as const,
  isFollowing: (userId: number) => [...followKeys.all, "isFollowing", userId] as const,
};

export function useFollowing() {
  return useQuery({
    queryKey: followKeys.following(),
    queryFn: fetchFollowing,
  });
}

export function useFollowers() {
  return useQuery({
    queryKey: followKeys.followers(),
    queryFn: fetchFollowers,
  });
}

export function useFollowCounts() {
  return useQuery({
    queryKey: followKeys.counts(),
    queryFn: fetchFollowCounts,
  });
}

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userCode: string) => followUser(userCode),
    onSuccess: (_data, userCode) => {
      queryClient.invalidateQueries({ queryKey: followKeys.following() });
      queryClient.invalidateQueries({ queryKey: followKeys.counts() });
      queryClient.invalidateQueries({ queryKey: followKeys.all });
      queryClient.invalidateQueries({ queryKey: ["user", userCode] });
    },
  });
}

export function useUnfollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: number; userCode: string }) => unfollowUser(params.userId),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: followKeys.following() });
      queryClient.invalidateQueries({ queryKey: followKeys.counts() });
      queryClient.invalidateQueries({ queryKey: followKeys.isFollowing(params.userId) });
      queryClient.invalidateQueries({ queryKey: ["user", params.userCode] });
    },
  });
}

export function useIsFollowing(userId: number) {
  return useQuery({
    queryKey: followKeys.isFollowing(userId),
    queryFn: async () => {
      const res = await checkIsFollowing(userId);
      return { payload: res.payload.isFollowing };
    },
    enabled: userId > 0,
  });
}
