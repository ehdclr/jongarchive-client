import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, FileText, Award, UserPlus, UserMinus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/common/UserAvatar";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import { useFollow, useUnfollow, useIsFollowing } from "@/hooks/useFollows";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";

interface PublicUserWithStats {
  id: number;
  userCode: string;
  name: string;
  profileImageUrl: string | null;
  bio: string | null;
  role: string;
  createdAt: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export default function UserProfilePage() {
  const { userCode } = useParams<{ userCode: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  // 유저 정보 조회 (통계 포함)
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userCode],
    queryFn: async () => {
      const { url } = API_ROUTES.USERS.BY_USER_CODE(userCode!);
      const res = await apiClient.get<{ payload: PublicUserWithStats }>(url);
      return res.data.payload;
    },
    enabled: !!userCode,
  });

  // 팔로우 여부 확인
  const { data: isFollowingData } = useIsFollowing(userData?.id ?? 0);
  const isFollowing = isFollowingData?.payload ?? false;

  // 본인 프로필이면 /profile로 리다이렉트
  if (userData && currentUser && userData.id === currentUser.id) {
    navigate("/profile", { replace: true });
    return null;
  }

  const handleFollow = async () => {
    if (!userData) return;
    try {
      await followMutation.mutateAsync(userData.userCode);
      toast.success("팔로우했습니다.");
    } catch {
      toast.error("팔로우에 실패했습니다.");
    }
  };

  const handleUnfollow = async () => {
    if (!userData) return;
    try {
      await unfollowMutation.mutateAsync(userData.id);
      toast.success("언팔로우했습니다.");
    } catch {
      toast.error("언팔로우에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-24 mb-6" />
        <Card className="bg-card p-6 border border-border">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
        <Card className="bg-card p-8 border border-border text-center">
          <p className="text-muted-foreground">사용자를 찾을 수 없습니다.</p>
        </Card>
      </div>
    );
  }

  // API에서 받은 통계 사용
  const postCount = userData?.postsCount ?? 0;
  const followersCount = userData?.followersCount ?? 0;
  const followingCount = userData?.followingCount ?? 0;
  const level = 1; // TODO: 레벨 시스템 구현 시 API 연동

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-4 md:px-8 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          뒤로가기
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-card p-6 border border-border">
          <div className="flex items-start gap-4">
            <UserAvatar
              src={userData.profileImageUrl}
              name={userData.name}
              userId={userData.id}
              userCode={userData.userCode}
              className="w-16 h-16 text-3xl"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground truncate">{userData.name}</h2>
                  <p className="text-xs text-muted-foreground">{userData.userCode}</p>
                </div>
                {isFollowing ? (
                  <Button
                    variant="outline"
                    onClick={handleUnfollow}
                    disabled={unfollowMutation.isPending}
                    className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <UserMinus className="w-4 h-4" />
                    언팔로우
                  </Button>
                ) : (
                  <Button onClick={handleFollow} disabled={followMutation.isPending} className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    팔로우
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                가입일: {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {/* Bio */}
          {userData.bio && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">소개</p>
              <p className="text-sm text-foreground">{userData.bio}</p>
            </div>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-card p-4 border border-border text-center">
            <FileText className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{postCount}</p>
            <p className="text-xs text-muted-foreground">포스트</p>
          </Card>
          <Card className="bg-card p-4 border border-border text-center">
            <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{followersCount}</p>
            <p className="text-xs text-muted-foreground">팔로워</p>
          </Card>
          <Card className="bg-card p-4 border border-border text-center">
            <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">{followingCount}</p>
            <p className="text-xs text-muted-foreground">팔로잉</p>
          </Card>
          <Card className="bg-card p-4 border border-border text-center">
            <Award className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-2xl font-bold text-foreground">Lv.{level}</p>
            <p className="text-xs text-muted-foreground">레벨</p>
          </Card>
        </div>

        {/* Badges (공개 뱃지만 표시) */}
        <Card className="bg-card p-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            획득 뱃지
          </h3>
          <p className="text-sm text-muted-foreground text-center py-4">아직 획득한 뱃지가 없습니다.</p>
        </Card>
      </div>
    </div>
  );
}
