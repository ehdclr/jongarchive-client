import { Link } from "react-router";
import { FileTextIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";
import type { PostWithAuthor } from "@/types/post";

interface PostListProps {
  posts: PostWithAuthor[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
  showPublishBadge?: boolean;
}

export function PostList({
  posts,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isFetchingNextPage = false,
  showPublishBadge = false,
}: PostListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileTextIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">게시물이 없습니다</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          첫 번째 게시물을 작성해보세요!
        </p>
        <Button asChild className="mt-6">
          <Link to="/posts/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            새 글 작성
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((postData) => (
          <PostCard
            key={postData.post.id}
            data={postData}
            showPublishBadge={showPublishBadge}
          />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </Button>
        </div>
      )}
    </div>
  );
}
