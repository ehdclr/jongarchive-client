import { useParams } from "react-router";
import { PostForm } from "@/components/posts";
import { Skeleton } from "@/components/ui/skeleton";
import { usePost } from "@/hooks/usePosts";

export default function EditPostPage() {
  const { post_id } = useParams<{ post_id: string }>();
  const { data, isLoading } = usePost(Number(post_id));

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!data?.payload) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-muted-foreground">
          게시물을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">게시물 수정</h1>
      <PostForm mode="edit" initialData={data.payload.post} />
    </div>
  );
}
