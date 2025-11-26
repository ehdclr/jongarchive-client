import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { CameraIcon, SaveIcon, ArrowLeftIcon, Edit, Save, X, MessageCircle, BookOpen, Trophy, Users, UserPlus, Copy, Check, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/useAuthStore";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";
import { toast } from "sonner";

//TODO : 임의의 사용자 추가 (나중에 삭제 더미)

interface FollowUser {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
}

const newFollower: FollowUser = {
  id: `u${Math.random().toString(36).substr(2, 9)}`,
  nickname: `익명 ${["늑대", "여우", "호랑이", "곰", "사자"][Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 10)}`,
  avatar: ["🐺", "🦊", "🐯", "🐻", "🦁", "🐼", "🦒", "🐘"][Math.floor(Math.random() * 8)],
  bio: "새로운 개돼지 친구입니다",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<"profile" | "following" | "followers">("profile");
  const [userCodeInput, setUserCodeInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 프로필 이미지 업로드
      if (profileImage) {
        const formData = new FormData();
        formData.append("profileImage", profileImage);
        await apiClient.put(API_ROUTES.USERS.UPDATE_PROFILE_IMAGE.url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 프로필 정보 업데이트
      const response = await apiClient.put(API_ROUTES.USERS.UPDATE_ME.url, {
        name,
        bio,
        phoneNumber,
      });

      if (response.data.success) {
        setUser(response.data.payload);
        toast.success("프로필이 수정되었습니다.");
      }
    } catch {
      toast.error("프로필 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //TODO: 나중에 팔로우 추가 로직 추가
  const handleAddFollow = () => {
    if (!userCodeInput.trim()) {
      toast.error("사용자 코드를 입력해주세요.");
      return;
    }
    if (userCodeInput === user?.userCode) {
      toast.error("자기 자신을 추가할 수 없습니다.");
      return;
    }

    //TODO: 나중에 팔로우 추가 로직
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-8 py-6">
        <h1 className="text-2xl font-bold text-foreground">내 정보</h1>
        <p className="text-sm text-muted-foreground mt-1">프로필 및 활동 정보</p>
      </div>

      {/* Main */}
      <div className="p-8 max-w-4xl mx-auto">
        {/* Tab */}
        <div className="flex gap-2 m,b-6 border-b border-border">
          <button
            // onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${true === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            프로필
          </button>
          <button
            // onClick={() => setActiveTab("following")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              true === "following" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            팔로우 (123)
          </button>
          <button
            // onClick={() => setActiveTab("followers")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              true === "followers" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            팔로워 (123)
          </button>
        </div>

        {/* Profile Tab */}
        {"profile" === "profile" && (
          <>
            {/* Profile Header Card */}
            <Card className="bg-card p-8 mb-8 border border-border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {false ? (
                        <Input value={user?.name} onChange={(e) => setName(e.target.value)} className="text-xl font-bold bg-input border-border" />
                      ) : (
                        <h2 className="text-3xl font-bold text-foreground">{user?.name}</h2>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user?.userCode}</p>
                    <p className="text-sm text-muted-foreground mt-1">가입일: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>

                {/* Edit Button */}
                {true ? (
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Edit className="w-4 h-4" />
                    프로필 수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Save className="w-4 h-4" />
                      저장
                    </Button>
                    <Button variant="outline" className="gap-2 border-border bg-transparent">
                      <X className="w-4 h-4" />
                      취소
                    </Button>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">소개</p>
                {false ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={200}
                    className="w-full bg-input border border-border text-foreground rounded-lg p-3 text-sm resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-foreground">{bio}</p>
                )}
                {false && <p className="text-xs text-muted-foreground mt-1">{bio.length}/200</p>}
              </div>

              <div className="p-4 bg-popover/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">내 사용자 코드</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold text-primary">{user?.userCode}</code>
                  <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground hover:text-foreground">
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        복사
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">이 코드를 다른 사람에게 공유하면 팔로우를 받을 수 있습니다.</p>
              </div>
            </Card>

            {/* Satus Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card p-4 border border-border">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">게시물</p>
                    {/* TODO: 나중에는 실제 api 구현 필요 */}
                    <p className="text-2xl font-bold text-foreground">{user?.postsCount ?? 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card p-4 border border-border">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">댓글</p>
                    <p className="text-2xl font-bold text-foreground">{user?.commentsCount ?? 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card p-4 border border-border">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">팔로워</p>
                    <p className="text-2xl font-bold text-foreground">{user?.followersCount ?? 0}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card p-4 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">레벨</p>
                  <p className="text-2xl font-bold text-foreground">Lv.{Math.floor((user?.postsCount ?? 0 + user?.commentsCount ?? 0) / 30) || 0}</p>
                </div>
              </Card>
            </div>

            {/*TODO: 레이아웃만 잡고 나중에 기능 추가 Bages Sections */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">획득 배지</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TODO: 나중에 배지 추가 로직 추가 */}
                <Card className="bg-popover/30 p-4 border border-border text-center">
                  <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">배지 1</p>
                </Card>
                <Card className="bg-popover/30 p-4 border border-border text-center">
                  <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">배지 2</p>
                </Card>
                <Card className="bg-popover/30 p-4 border border-border text-center">
                  <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">배지 3</p>
                </Card>
              </div>
            </div>

            {/* Account Section */}
            <Card className="bg-card p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">계정 설정</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-popover/50 bg-transparent">
                  비밀번호 변경
                </Button>
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-popover/50 bg-transparent">
                  알림 설정 (TODO: 이후 추가 기능 추가)
                </Button>
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-popover/50 bg-transparent">
                  개인정보 처리방침 (TODO: 링크 추가)
                </Button>
                <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent">
                  계정 삭제 (TODO: Soft Delete 로직 추가)
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* Following Tab */}
        {"following" === "following" && (
          <>
            {/* Following List */}
            <Card className="bg-card p-6 mb-8 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">새로운 사용자 팔로우</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="사용자 코드 입력 (예: WOLF001K7J)"
                  value={userCodeInput}
                  onChange={(e) => setUserCodeInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && handleAddFollow()}
                  className="bg-input border-border text-foreground"
                />
                <Button onClick={handleAddFollow} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="w-4 h-4" />
                  팔로우
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                다른 사용자의 사용자 코드를 입력하여 팔로우할 수 있습니다.
              </p>
            </Card>

            {/* Follower List */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">팔로워</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
