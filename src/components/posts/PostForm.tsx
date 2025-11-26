import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThumbnailUpload } from "./ThumbnailUpload";
import { PostPreview } from "./PostPreview";
import { useCreatePost, useUpdatePost } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import { FileText, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { Post } from "@/types/post";
import apiClient from "@/lib/axios";
import { API_ROUTES } from "@/const/api";

interface PostFormProps {
  mode: "create" | "edit";
  initialData?: Post;
}

const DRAFTS_KEY = "post-drafts";

interface Draft {
  id: string;
  title: string;
  content: string;
  categoryId: number | null;
  savedAt: string;
}

export function PostForm({ mode, initialData }: PostFormProps) {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { data: categoriesData } = useCategories();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl] = useState(initialData?.thumbnailUrl ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(initialData?.categoryId ?? null);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 임시저장 관련 상태
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showDraftsDialog, setShowDraftsDialog] = useState(false);

  const categories = categoriesData?.payload ?? [];

  // 이미지 업로드 핸들러
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(API_ROUTES.UPLOADS.IMAGE.url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data.url;
    }
    throw new Error("이미지 업로드에 실패했습니다.");
  };

  const editor = useCreateBlockNote({
    initialContent: initialData?.content ? JSON.parse(initialData.content) : undefined,
    uploadFile,
  });

  // 썸네일 미리보기 URL
  const previewThumbnailUrl = useMemo(() => {
    if (thumbnail) {
      return URL.createObjectURL(thumbnail);
    }
    return thumbnailUrl || null;
  }, [thumbnail, thumbnailUrl]);

  // 임시저장 목록 불러오기
  useEffect(() => {
    if (mode === "create") {
      const savedDrafts = localStorage.getItem(DRAFTS_KEY);
      if (savedDrafts) {
        try {
          setDrafts(JSON.parse(savedDrafts));
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
  }, [mode]);

  // 임시저장 (새로 저장)
  const saveDraft = useCallback(() => {
    if (mode !== "create") return;
    const content = JSON.stringify(editor.document);
    const newDraft: Draft = {
      id: Date.now().toString(),
      title: title || "제목 없음",
      content,
      categoryId,
      savedAt: new Date().toISOString(),
    };
    const updatedDrafts = [newDraft, ...drafts].slice(0, 10); // 최대 10개
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    toast.success("임시저장되었습니다.");
  }, [mode, title, editor, categoryId, drafts]);

  // 임시저장 불러오기
  const loadDraft = useCallback(
    (draft: Draft) => {
      setTitle(draft.title === "제목 없음" ? "" : draft.title);
      setCategoryId(draft.categoryId);
      if (draft.content && editor) {
        try {
          editor.replaceBlocks(editor.document, JSON.parse(draft.content));
        } catch {
          // 파싱 실패 시 무시
        }
      }
      setShowDraftsDialog(false);
      toast.success("임시저장을 불러왔습니다.");
    },
    [editor]
  );

  // 임시저장 삭제
  const deleteDraft = useCallback(
    (draftId: string) => {
      const updatedDrafts = drafts.filter((d) => d.id !== draftId);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updatedDrafts));
      setDrafts(updatedDrafts);
      toast.success("임시저장이 삭제되었습니다.");
    },
    [drafts]
  );

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
          categoryId: categoryId ?? undefined,
          thumbnail: thumbnail ?? undefined,
          isPublished,
        });
        toast.success("게시물이 작성되었습니다.");
        navigate("/posts");
      } else if (initialData) {
        await updatePost.mutateAsync({
          id: initialData.id,
          data: {
            title,
            content,
            categoryId: categoryId ?? undefined,
            isPublished,
            thumbnail: thumbnail ?? undefined,
          },
        });
        toast.success("게시물이 수정되었습니다.");
        navigate(`/posts/${initialData.id}`);
      }
    } catch {
      toast.error(mode === "create" ? "게시물 작성에 실패했습니다." : "게시물 수정에 실패했습니다.");
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
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" maxLength={255} />
        </div>

        <div className="space-y-2">
          <Label>카테고리</Label>
          <Select value={categoryId?.toString() ?? "none"} onValueChange={(value) => setCategoryId(value === "none" ? null : Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">카테고리 없음</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>썸네일</Label>
          <ThumbnailUpload value={thumbnail ?? thumbnailUrl} onChange={setThumbnail} />
        </div>

        <div className="space-y-2">
          <Label>내용</Label>
          <div className="min-h-[400px] rounded-lg border">
            <BlockNoteView editor={editor} theme="dark" />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
          <Switch id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
          <div className="flex-1">
            <Label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
              {isPublished ? "공개" : "비공개"}
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isPublished ? "모든 사용자가 이 게시물을 볼 수 있습니다." : "나만 이 게시물을 볼 수 있습니다."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === "create" && drafts.length > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowDraftsDialog(true)}>
                <FileText className="w-4 h-4 mr-1" />
                임시저장 목록 ({drafts.length})
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {mode === "create" && (
              <Button type="button" variant="outline" onClick={saveDraft}>
                임시저장
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : mode === "create" ? "작성하기" : "수정하기"}
            </Button>
          </div>
        </div>
      </form>

      {/* 사이드바 - 미리보기 (sticky) */}
      <aside className="hidden w-80 shrink-0 lg:block">
        <div className="sticky top-20">
          <PostPreview title={title} thumbnailUrl={previewThumbnailUrl} isPublished={isPublished} />
        </div>
      </aside>

      {/* 임시저장 목록 다이얼로그 */}
      <Dialog open={showDraftsDialog} onOpenChange={setShowDraftsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>임시저장 목록</DialogTitle>
            <DialogDescription>저장된 임시저장 글을 불러오거나 삭제할 수 있습니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {drafts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">임시저장된 글이 없습니다.</p>
            ) : (
              drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadDraft(draft)}>
                    <p className="font-medium truncate">{draft.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(draft.savedAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(draft.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
