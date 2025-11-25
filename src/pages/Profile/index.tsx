import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { CameraIcon, SaveIcon, ArrowLeftIcon } from "lucide-react";
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">내 정보</h1>
          <p className="text-sm text-muted-foreground">프로필 정보를 수정할 수 있습니다.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>프로필 사진</CardTitle>
            <CardDescription>프로필에 표시될 사진을 변경합니다.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl ?? user?.profileImageUrl ?? undefined} />
                <AvatarFallback className="text-2xl">{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
              >
                <CameraIcon className="h-4 w-4" />
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>이름과 연락처 정보를 수정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" value={user?.email ?? ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="010-0000-0000"
                maxLength={20}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>소개</CardTitle>
            <CardDescription>자신을 소개하는 글을 작성합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="간단한 자기소개를 입력하세요"
              rows={4}
              maxLength={500}
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">{bio.length}/500</p>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "저장 중..."
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                저장하기
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
