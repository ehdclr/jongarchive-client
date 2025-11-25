import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAuthStore from "@/store/useAuthStore";

interface PostPreviewProps {
  title: string;
  thumbnailUrl?: string | null;
  isPublished?: boolean;
}

export function PostPreview({ title, thumbnailUrl, isPublished = false }: PostPreviewProps) {
  const { user } = useAuthStore();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">미리보기</span>
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? "공개" : "비공개"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {thumbnailUrl ? (
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={thumbnailUrl}
              alt="썸네일"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
            <span className="text-sm text-muted-foreground">썸네일 없음</span>
          </div>
        )}

        <div>
          <h3 className="line-clamp-2 text-lg font-semibold">
            {title || "제목을 입력하세요"}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.profileImageUrl ?? undefined} />
            <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <span>{user?.name ?? "사용자"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
