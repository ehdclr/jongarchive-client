// components/ui/avatar-upload.tsx

'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

 function AvatarUpload({
  value,
  onChange,
  disabled,
  className,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onChange?.(null);
      return;
    }

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* 프로필 이미지 영역 */}
      <div
        className={cn(
          'relative group cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={!disabled ? handleClick : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDrop={!disabled ? handleDrop : undefined}
      >
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          {preview ? (
            <AvatarImage src={preview} alt="Profile" className="object-cover" />
          ) : (
            <AvatarFallback className="bg-muted">
              <User className="h-16 w-16 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>

        {/* 호버 오버레이 */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100',
            isDragging && 'opacity-100',
            disabled && 'hidden'
          )}
        >
          <Camera className="h-8 w-8 text-white" />
        </div>

        {/* 삭제 버튼 */}
        {preview && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          handleFileChange(file);
        }}
        disabled={disabled}
      />

      {/* 안내 텍스트 */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          클릭하거나 드래그하여 이미지 업로드
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, GIF (최대 5MB)
        </p>
      </div>
    </div>
  );
}

export { AvatarUpload }