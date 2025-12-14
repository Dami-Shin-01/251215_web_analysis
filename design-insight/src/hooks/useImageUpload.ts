'use client';

import { useState, useCallback } from 'react';

interface UseImageUploadReturn {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  selectFile: (file: File) => void;
  removeFile: () => void;
  getBase64: () => Promise<string>;
}

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectFile = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError(null);

    // 미리보기 URL 생성
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  }, []);

  const removeFile = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
  }, [preview]);

  const getBase64 = useCallback(async (): Promise<string> => {
    if (!file) {
      throw new Error('파일이 선택되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/png;base64, 부분 제거
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      reader.readAsDataURL(file);
    });
  }, [file]);

  return {
    file,
    preview,
    isUploading,
    error,
    selectFile,
    removeFile,
    getBase64,
  };
}
