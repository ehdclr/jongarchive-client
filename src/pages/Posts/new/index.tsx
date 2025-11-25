import { PostForm } from "@/components/posts";

export default function NewPostPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">새 글 작성</h1>
      <PostForm mode="create" />
    </div>
  );
}
