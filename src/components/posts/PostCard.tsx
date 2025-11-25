import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { PostWithAuthor } from "@/types/post";

interface PostCardProps {
  data: PostWithAuthor;
  showPublishBadge?: boolean;
}

export function PostCard({ data, showPublishBadge = false }: PostCardProps) {
  const { post, author } = data;

  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        {post.thumbnailUrl && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
            {showPublishBadge && (
              <Badge variant={post.isPublished ? "default" : "secondary"}>
                {post.isPublished ? "공개" : "비공개"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.content.slice(0, 100)}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.profileImageUrl ?? undefined} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
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
