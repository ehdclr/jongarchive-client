import { useParams, useNavigate, Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MoreHorizontalIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePost, useDeletePost } from "@/hooks/usePosts";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { post_id } = useParams<{ post_id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = usePost(Number(post_id));
  const deletePost = useDeletePost();

  const postData = data?.payload;
  const isAuthor = user?.id === postData?.author.id;

  const handleDelete = async () => {
    if (!post_id) return;
    try {
      await deletePost.mutateAsync(Number(post_id));
      toast.success("게시물이 삭제되었습니다.");
      navigate("/posts");
    } catch {
      toast.error("게시물 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-4 h-64 w-full" />
        <Skeleton className="mb-4 h-10 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mt-8 h-64 w-full" />
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-center text-muted-foreground">
          게시물을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const { post, author } = postData;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {post.thumbnailUrl && (
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="mb-6 h-64 w-full rounded-lg object-cover md:h-96"
        />
      )}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {!post.isPublished && <Badge variant="secondary">비공개</Badge>}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.profileImageUrl ?? undefined} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{author.name}</span>
            </div>
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/posts/${post.id}/edit`}>
                  <EditIcon className="mr-2 h-4 w-4" />
                  수정
                </Link>
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>게시물 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수
                      없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
}
