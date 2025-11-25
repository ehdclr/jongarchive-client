import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/posts";
import { usePostsInfinite } from "@/hooks/usePosts";

export default function PostsPage() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePostsInfinite();

  const posts = data?.pages.flatMap((page) => page.payload) ?? [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">게시물</h1>
        <Button asChild>
          <Link to="/posts/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            새 글 작성
          </Link>
        </Button>
      </div>
      <PostList
        posts={posts}
        isLoading={isLoading}
        hasMore={hasNextPage}
        onLoadMore={() => fetchNextPage()}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
