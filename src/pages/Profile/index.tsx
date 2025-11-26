import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Copy, Check, Users, Edit2, FileText, Award, Settings, Trash2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import { useFollowing, useFollowers, useFollowCounts } from "@/hooks/useFollows";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";

type TabType = "profile" | "following" | "followers";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [copiedCode, setCopiedCode] = useState(false);

  // 프로필 수정 (이름, 소개)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profileBio, setProfileBio] = useState(user?.bio ?? "");

  // 개인정보 수정 (비밀번호 등)
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");

  // Delete account dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data: followingData } = useFollowing();
  const { data: followersData } = useFollowers();
  const { data: countsData } = useFollowCounts();

  const following = followingData?.payload ?? [];
  const followers = followersData?.payload ?? [];
  const followingCount = countsData?.payload?.followingCount ?? 0;
  const followersCount = countsData?.payload?.followersCount ?? 0;

  const handleCopyUserCode = async () => {
    if (!user?.userCode) return;
    try {
      await navigator.clipboard.writeText(user.userCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast.success("사용자 코드가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  // 프로필 수정 저장 (이름 + 소개)
  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    try {
      await apiClient.put(API_ROUTES.USERS.UPDATE_ME.url, {
        name: profileName,
        bio: profileBio,
      });
      toast.success("프로필이 수정되었습니다.");
      setIsEditingProfile(false);
      window.location.reload();
    } catch {
      toast.error("프로필 수정에 실패했습니다.");
    }
  };

  // 개인정보 수정 저장 (비밀번호, 전화번호)
  const handleSavePersonalInfo = async () => {
    // 비밀번호 변경 시
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("비밀번호는 6자 이상이어야 합니다.");
        return;
      }
      if (!currentPassword) {
        toast.error("현재 비밀번호를 입력해주세요.");
        return;
      }
    }

    try {
      const updateData: Record<string, string> = {};
      if (phoneNumber !== user?.phoneNumber) {
        updateData.phoneNumber = phoneNumber;
      }
      if (newPassword) {
        updateData.password = newPassword;
        updateData.currentPassword = currentPassword;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("변경된 내용이 없습니다.");
        setIsEditingPersonalInfo(false);
        return;
      }

      await apiClient.put(API_ROUTES.USERS.UPDATE_ME.url, updateData);
      toast.success("개인정보가 수정되었습니다.");
      setIsEditingPersonalInfo(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      window.location.reload();
    } catch {
      toast.error("개인정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "계정삭제") {
      toast.error("'계정삭제'를 정확히 입력해주세요.");
      return;
    }
    try {
      await apiClient.delete(API_ROUTES.USERS.DELETE_ME.url);
      toast.success("계정이 삭제되었습니다.");
      setShowDeleteDialog(false);
      logout();
      navigate("/signin");
    } catch {
      toast.error("계정 삭제에 실패했습니다.");
    }
  };

  const openProfileEdit = () => {
    setProfileName(user?.name ?? "");
    setProfileBio(user?.bio ?? "");
    setIsEditingProfile(true);
  };

  const openPersonalInfoEdit = () => {
    setPhoneNumber(user?.phoneNumber ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditingPersonalInfo(true);
  };

  // 포스트 수 (임시 - 나중에 API 연동)
  const postCount = 24;
  // 레벨 (임시 - 나중에 API 연동)
  const level = 6;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Tabs */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-4 md:px-8 py-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`text-sm font-medium transition-colors ${activeTab === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            프로필
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeTab === "following" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span>팔로잉</span>
            <span className="text-xs">({followingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeTab === "followers" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span>팔로워</span>
            <span className="text-xs">({followersCount})</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-card p-6 border border-border">
              <div className="flex items-start gap-4">
                <UserAvatar src={user?.profileImageUrl} name={user?.name ?? ""} userId={user?.id ?? 0} userCode={user?.userCode} className="w-16 h-16 text-3xl" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground truncate">{user?.name}</h2>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={openProfileEdit}>
                      <Edit2 className="w-3 h-3" />
                      프로필 수정
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">가입일: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">소개</p>
                <p className="text-sm text-foreground">{user?.bio || "아직 소개가 없습니다."}</p>
              </div>

              {/* User Code */}
              {user?.userCode && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">내 사용자 코드</span>
                  <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{user.userCode}</code>
                  <Button size="sm" variant="ghost" onClick={handleCopyUserCode} className="h-6 w-6 p-0">
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
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

            {/* Badges */}
            <Card className="bg-card p-4 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                획득 뱃지
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs font-medium">포스트 작성 달성</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg">💬</span>
                  </div>
                  <p className="text-xs font-medium">댓글 100개 달성</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg">👍</span>
                  </div>
                  <p className="text-xs font-medium">좋아요 50건</p>
                </div>
              </div>
            </Card>

            {/* Account Settings */}
            <Card className="bg-card p-4 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                계정 설정
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start h-10" onClick={openProfileEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  프로필 수정
                </Button>
                <Button variant="outline" className="w-full justify-start h-10" onClick={openPersonalInfoEdit}>
                  <Lock className="w-4 h-4 mr-2" />
                  개인정보 수정
                </Button>
                <Button variant="outline" className="w-full justify-start h-10">
                  개인정보 무기한동의
                </Button>
                <Button variant="outline" className="w-full justify-start h-10 border-destructive text-destructive hover:bg-destructive/10" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  계정 삭제
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === "following" && (
          <div className="space-y-3">
            {following.length === 0 ? (
              <Card className="bg-card p-8 border border-border text-center">
                <p className="text-muted-foreground">아직 팔로우하는 사용자가 없습니다.</p>
              </Card>
            ) : (
              following.map((followUser) => (
                <Link key={followUser.id} to={`/user/${followUser.userCode}`}>
                  <Card className="bg-card p-4 border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <UserAvatar src={followUser.profileImageUrl} name={followUser.name} userId={followUser.id} userCode={followUser.userCode} className="w-10 h-10" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{followUser.name}</p>
                        <p className="text-xs text-muted-foreground">{followUser.userCode}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === "followers" && (
          <div className="space-y-3">
            {followers.length === 0 ? (
              <Card className="bg-card p-8 border border-border text-center">
                <p className="text-muted-foreground">아직 팔로워가 없습니다.</p>
              </Card>
            ) : (
              followers.map((follower) => (
                <Link key={follower.id} to={`/user/${follower.userCode}`}>
                  <Card className="bg-card p-4 border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <UserAvatar src={follower.profileImageUrl} name={follower.name} userId={follower.id} userCode={follower.userCode} className="w-10 h-10" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{follower.name}</p>
                        <p className="text-xs text-muted-foreground">{follower.userCode}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Dialog (이름 + 소개) */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>이름과 소개를 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="profileName">이름</Label>
              <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="이름" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="profileBio">소개</Label>
              <Textarea id="profileBio" value={profileBio} onChange={(e) => setProfileBio(e.target.value)} placeholder="자기소개를 입력해주세요." className="mt-1 min-h-[100px]" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              취소
            </Button>
            <Button onClick={handleSaveProfile}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Personal Info Dialog (비밀번호, 전화번호) */}
      <Dialog open={isEditingPersonalInfo} onOpenChange={setIsEditingPersonalInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>개인정보 수정</DialogTitle>
            <DialogDescription>비밀번호와 전화번호를 수정할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="010-0000-0000" className="mt-1" />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">비밀번호 변경</p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="현재 비밀번호" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="새 비밀번호 (6자 이상)" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="새 비밀번호 확인" className="mt-1" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditingPersonalInfo(false)}>
              취소
            </Button>
            <Button onClick={handleSavePersonalInfo}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">계정 삭제</DialogTitle>
            <DialogDescription>계정을 삭제하면 모든 데이터가 삭제됩니다. 계속하시려면 아래에 '계정삭제'를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="계정삭제" className="mt-2" />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
