'use client';

import { useCallback, useState, DragEvent, ChangeEvent } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  maxSize?: number; // bytes (default: 10MB)
  acceptedFormats?: string[];
  isUploading?: boolean;
  disabled?: boolean;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPTED_FORMATS = ['image/png', 'image/jpeg', 'image/webp'];

export function DropZone({
  onFileSelect,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  isUploading = false,
  disabled = false,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `지원하지 않는 파일 형식입니다. (${acceptedFormats
          .map((f) => f.split('/')[1].toUpperCase())
          .join(', ')} 만 가능)`;
      }
      if (file.size > maxSize) {
        return `파일 크기가 너무 큽니다. (최대 ${Math.round(maxSize / 1024 / 1024)}MB)`;
      }
      return null;
    },
    [acceptedFormats, maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, isUploading, handleFile]
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // 같은 파일을 다시 선택할 수 있도록 value 초기화
      e.target.value = '';
    },
    [handleFile]
  );

  const isDisabled = disabled || isUploading;

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          w-full min-h-[300px] p-8
          border-2 border-dashed rounded-xl
          transition-all duration-200 ease-in-out
          ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/50'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          disabled={isDisabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="파일 업로드"
        />

        <div className="flex flex-col items-center text-center pointer-events-none">
          {isUploading ? (
            <>
              <svg
                className="w-12 h-12 mb-4 text-muted animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-lg font-medium text-foreground">업로드 중...</p>
            </>
          ) : (
            <>
              <svg
                className={`w-12 h-12 mb-4 transition-colors ${
                  isDragging ? 'text-primary' : 'text-muted'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>

              <p className="text-lg font-medium text-foreground mb-2">
                {isDragging ? '여기에 놓으세요' : '스크린샷을 드래그하거나 클릭하여 업로드'}
              </p>

              <p className="text-sm text-muted">
                PNG, JPG, WebP (최대 {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive flex items-center gap-1">
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
