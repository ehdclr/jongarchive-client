import { useState } from "react";
import { Link } from "react-router";
import { PlusIcon, LayoutGridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PostList } from "@/components/posts";
import { usePostsInfinite, usePostsByCategoryInfinite } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";

export default function PostsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories = categoriesData?.payload ?? [];

  const allPostsQuery = usePostsInfinite();
  const categoryPostsQuery = usePostsByCategoryInfinite(selectedCategoryId);

  const activeQuery = selectedCategoryId ? categoryPostsQuery : allPostsQuery;
  const posts = activeQuery.data?.pages.flatMap((page) => page.payload) ?? [];

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

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

      <div className="flex gap-8">
        {/* 카테고리 사이드바 */}
        <aside className="w-48 shrink-0">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            카테고리
          </h2>
          <nav className="space-y-1">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                selectedCategoryId === null
                  ? "bg-accent font-medium"
                  : ""
              }`}
            >
              <LayoutGridIcon className="h-4 w-4" />
              전체
            </button>
            {isCategoriesLoading ? (
              <>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                    selectedCategoryId === category.id
                      ? "bg-accent font-medium"
                      : ""
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </button>
              ))
            )}
          </nav>
        </aside>

        {/* 게시물 목록 */}
        <div className="flex-1">
          {selectedCategory && (
            <div className="mb-6 flex items-center gap-2">
              <Badge style={{ backgroundColor: selectedCategory.color }}>
                {selectedCategory.name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {selectedCategory.description}
              </span>
            </div>
          )}
          <PostList
            posts={posts}
            isLoading={activeQuery.isLoading}
            hasMore={activeQuery.hasNextPage}
            onLoadMore={() => activeQuery.fetchNextPage()}
            isFetchingNextPage={activeQuery.isFetchingNextPage}
          />
        </div>
      </div>
    </div>
  );
}
