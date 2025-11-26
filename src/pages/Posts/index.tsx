import { Link, useSearchParams } from "react-router";
import { PlusIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostList } from "@/components/posts";
import {
  usePostsInfinite,
  usePostsByCategoryInfinite,
  useMyPrivatePostsInfinite,
} from "@/hooks/usePosts";

export default function PostsPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category")
    ? Number(searchParams.get("category"))
    : null;
  const showPrivateOnly = searchParams.get("filter") === "private";

  // 조건에 따라 다른 훅 사용
  const allPostsQuery = usePostsInfinite();
  const categoryPostsQuery = usePostsByCategoryInfinite(categoryId);
  const privatePostsQuery = useMyPrivatePostsInfinite();

  // 현재 활성화된 쿼리 선택
  const activeQuery = showPrivateOnly
    ? privatePostsQuery
    : categoryId
      ? categoryPostsQuery
      : allPostsQuery;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    activeQuery;
  const posts = data?.pages.flatMap((page) => page.payload) ?? [];

  // 페이지 제목 결정
  const pageTitle = showPrivateOnly ? "내 비공개글" : "게시물";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {showPrivateOnly && <LockIcon className="h-7 w-7" />}
          {pageTitle}
        </h1>
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
