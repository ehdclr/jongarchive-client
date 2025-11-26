import { useMemo } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { PostWithAuthor } from "@/types/post";

// BlockNote JSON에서 텍스트만 추출
function extractTextFromBlockNote(content: string): string {
  try {
    const blocks = JSON.parse(content);
    const texts: string[] = [];

    const extractText = (item: unknown): void => {
      if (!item || typeof item !== "object") return;

      const obj = item as Record<string, unknown>;

      // content 배열에서 text 추출
      if (Array.isArray(obj.content)) {
        for (const child of obj.content) {
          if (typeof child === "object" && child !== null) {
            const childObj = child as Record<string, unknown>;
            if (childObj.type === "text" && typeof childObj.text === "string") {
              texts.push(childObj.text);
            }
          }
        }
      }

      // children 재귀 탐색
      if (Array.isArray(obj.children)) {
        for (const child of obj.children) {
          extractText(child);
        }
      }
    };

    if (Array.isArray(blocks)) {
      for (const block of blocks) {
        extractText(block);
      }
    }

    return texts.join(" ").trim();
  } catch {
    return content.slice(0, 100);
  }
}

interface PostCardProps {
  data: PostWithAuthor;
  showPublishBadge?: boolean;
}

export function PostCard({ data, showPublishBadge = false }: PostCardProps) {
  const { post, author } = data;

  const contentPreview = useMemo(() => {
    return extractTextFromBlockNote(post.content);
  }, [post.content]);

  return (
    <Link to={`/posts/${post.id}`} className="group block">
      <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5">
        {post.thumbnailUrl && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-2 text-lg font-semibold transition-colors duration-300 group-hover:text-primary">{post.title}</h3>
            {showPublishBadge && (
              <Badge variant={post.isPublished ? "default" : "secondary"}>
                {post.isPublished ? "공개" : "비공개"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {contentPreview || "내용 없음"}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserAvatar
              src={author.profileImageUrl}
              name={author.name}
              userId={author.id}
              userCode={author.userCode}
              className="h-6 w-6"
              fallbackClassName="text-sm"
            />
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
