'use client';

import { useState, useCallback } from 'react';

// 이미지 리사이즈 설정
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 0.8; // JPEG 품질 (0-1)
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

interface UseImageUploadReturn {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
  selectFile: (file: File) => void;
  removeFile: () => void;
  getBase64: () => Promise<string>;
}

// 이미지 리사이즈 함수
async function resizeImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // 리사이즈 필요 여부 확인
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Canvas에 그리기
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context를 생성할 수 없습니다.'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Blob으로 변환 (JPEG로 압축)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width, height });
          } else {
            reject(new Error('이미지 변환에 실패했습니다.'));
          }
        },
        'image/jpeg',
        QUALITY
      );
    };

    img.onerror = () => {
      reject(new Error('이미지를 불러올 수 없습니다.'));
    };

    img.src = URL.createObjectURL(file);
  });
}

// 추가 압축 (파일 크기가 여전히 큰 경우)
async function compressUntilSmallEnough(
  blob: Blob,
  width: number,
  height: number,
  quality: number = QUALITY
): Promise<Blob> {
  if (blob.size <= MAX_FILE_SIZE || quality < 0.3) {
    return blob;
  }

  // 품질을 낮추거나 크기를 줄여서 재압축
  const newQuality = quality - 0.1;
  const scale = blob.size > MAX_FILE_SIZE * 2 ? 0.8 : 0.9;

  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(blob); // 실패 시 원본 반환
        return;
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        async (newBlob) => {
          if (newBlob) {
            if (newBlob.size <= MAX_FILE_SIZE) {
              resolve(newBlob);
            } else {
              // 재귀적으로 압축
              const result = await compressUntilSmallEnough(newBlob, newWidth, newHeight, newQuality);
              resolve(result);
            }
          } else {
            resolve(blob);
          }
        },
        'image/jpeg',
        newQuality
      );
    };

    img.onerror = () => resolve(blob);
    img.src = URL.createObjectURL(blob);
  });
}

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // 이미지 리사이즈
      const { blob, width, height } = await resizeImage(selectedFile);

      // 파일 크기가 여전히 크면 추가 압축
      let finalBlob = blob;
      if (blob.size > MAX_FILE_SIZE) {
        finalBlob = await compressUntilSmallEnough(blob, width, height);
      }

      // File 객체로 변환
      const processedFile = new File([finalBlob], selectedFile.name.replace(/\.[^.]+$/, '.jpg'), {
        type: 'image/jpeg',
      });

      setFile(processedFile);
      setProcessedBlob(finalBlob);

      // 미리보기 URL 생성
      const url = URL.createObjectURL(finalBlob);
      setPreview(url);

      console.log(`이미지 압축 완료: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB → ${(finalBlob.size / 1024 / 1024).toFixed(2)}MB`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeFile = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setProcessedBlob(null);
    setPreview(null);
    setError(null);
  }, [preview]);

  const getBase64 = useCallback(async (): Promise<string> => {
    const blobToUse = processedBlob || file;
    if (!blobToUse) {
      throw new Error('파일이 선택되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/jpeg;base64, 부분 제거
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      reader.readAsDataURL(blobToUse);
    });
  }, [file, processedBlob]);

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
