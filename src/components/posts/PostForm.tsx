import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { PostPreview } from "./PostPreview";
import { useCreatePost, useUpdatePost } from "@/hooks/usePosts";
import { toast } from "sonner";
import type { Post } from "@/types/post";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: Post;
}

const DRAFT_KEY = "post-draft";

export function PostForm({ mode, initialData }: PostFormProps) {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl] = useState(initialData?.thumbnailUrl ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useCreateBlockNote({
    initialContent: initialData?.content
      ? JSON.parse(initialData.content)
      : undefined,
  });

  // 썸네일 미리보기 URL
  const previewThumbnailUrl = useMemo(() => {
    if (thumbnail) {
      return URL.createObjectURL(thumbnail);
    }
    return thumbnailUrl || null;
  }, [thumbnail, thumbnailUrl]);

  // 임시저장 불러오기
  useEffect(() => {
    if (mode === "create") {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.content && editor) {
            editor.replaceBlocks(editor.document, JSON.parse(parsed.content));
          }
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
  }, [mode, editor]);

  // 임시저장
  const saveDraft = useCallback(async () => {
    if (mode !== "create") return;
    const content = JSON.stringify(editor.document);
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content }));
    toast.success("임시저장되었습니다.");
  }, [mode, title, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const content = JSON.stringify(editor.document);

      if (mode === "create") {
        await createPost.mutateAsync({
          title,
          content,
          thumbnail: thumbnail ?? undefined,
        });
        localStorage.removeItem(DRAFT_KEY);
        toast.success("게시물이 작성되었습니다.");
        navigate("/posts");
      } else if (initialData) {
        await updatePost.mutateAsync({
          id: initialData.id,
          data: {
            title,
            content,
            isPublished,
            thumbnail: thumbnail ?? undefined,
          },
        });
        toast.success("게시물이 수정되었습니다.");
        navigate(`/posts/${initialData.id}`);
      }
    } catch {
      toast.error(
        mode === "create"
          ? "게시물 작성에 실패했습니다."
          : "게시물 수정에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex gap-8">
      {/* 메인 폼 영역 */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={255}
          />
        </div>

        <div className="space-y-2">
          <Label>썸네일</Label>
          <ThumbnailUpload
            value={thumbnail ?? thumbnailUrl}
            onChange={setThumbnail}
          />
        </div>

        <div className="space-y-2">
          <Label>내용</Label>
          <div className="min-h-[400px] rounded-lg border">
            <BlockNoteView editor={editor} theme="dark" />
          </div>
        </div>

        {mode === "edit" && (
          <div className="flex items-center gap-2">
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="isPublished">공개</Label>
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          {mode === "create" && (
            <Button type="button" variant="outline" onClick={saveDraft}>
              임시저장
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "저장 중..."
              : mode === "create"
              ? "작성하기"
              : "수정하기"}
          </Button>
        </div>
      </form>

      {/* 사이드바 - 미리보기 (sticky) */}
      <aside className="hidden w-80 shrink-0 lg:block">
        <div className="sticky top-20">
          <PostPreview
            title={title}
            thumbnailUrl={previewThumbnailUrl}
            isPublished={isPublished}
          />
        </div>
      </aside>
    </div>
  );
}
