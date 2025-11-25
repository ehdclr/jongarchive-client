import { useCallback, useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface ThumbnailUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
}

export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const [preview, setPreview] = useState<string | null>(() => {
    if (typeof value === "string") return value;
    return null;
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onChange(file);
      } else {
        setPreview(null);
        onChange(null);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    handleFile(null);
  }, [handleFile]);

  if (preview) {
    return (
      <div className="group relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={preview}
            alt="썸네일 미리보기"
            className="h-full w-full rounded-lg object-cover transition-opacity group-hover:opacity-75"
          />
        </AspectRatio>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleRemove}
          >
            <XIcon className="h-4 w-4" />
            이미지 삭제
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={`cursor-pointer border-2 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="block cursor-pointer">
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
            <p className="text-sm">클릭하거나 이미지를 드래그하세요</p>
          </div>
        </AspectRatio>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </label>
    </Card>
  );
}
