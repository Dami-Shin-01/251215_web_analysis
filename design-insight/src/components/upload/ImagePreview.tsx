'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export function ImagePreview({
  file,
  onRemove,
  onAnalyze,
  isAnalyzing = false,
}: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);

    // 이미지 크기 가져오기
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (!preview) {
    return (
      <div className="w-full h-64 bg-secondary animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="w-full">
      <div className="relative rounded-xl overflow-hidden border bg-card">
        {/* 이미지 미리보기 */}
        <div className="relative w-full" style={{ aspectRatio: imageSize ? `${imageSize.width}/${imageSize.height}` : '16/9', maxHeight: '500px' }}>
          <Image
            src={preview}
            alt="업로드된 스크린샷"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>

        {/* 파일 정보 오버레이 */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={onRemove}
            disabled={isAnalyzing}
            className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border hover:bg-background transition-colors disabled:opacity-50"
            aria-label="이미지 삭제"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 파일 정보 */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground truncate max-w-xs">
            {file.name}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{formatFileSize(file.size)}</span>
            {imageSize && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted" />
                <span>{imageSize.width} x {imageSize.height}px</span>
              </>
            )}
          </div>
        </div>

        <Button
          onClick={onAnalyze}
          isLoading={isAnalyzing}
          disabled={isAnalyzing}
          size="lg"
        >
          {isAnalyzing ? '분석 중...' : 'UX/UI 분석 시작'}
        </Button>
      </div>
    </div>
  );
}
