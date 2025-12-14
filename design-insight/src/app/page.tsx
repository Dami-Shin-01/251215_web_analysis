'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DropZone, ImagePreview } from '@/components/upload';
import { useImageUpload } from '@/hooks';

export default function Home() {
  const router = useRouter();
  const { file, selectFile, removeFile, getBase64 } = useImageUpload();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64 = await getBase64();

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          mimeType: file.type,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '분석 중 오류가 발생했습니다.');
      }

      const data = await response.json();

      // 세션 스토리지에 분석 결과 저장 (임시, KV 연동 전)
      sessionStorage.setItem(`analysis_${data.id}`, JSON.stringify(data));

      // 분석 결과 페이지로 이동
      router.push(`/analyze/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          웹사이트 UX/UI 분석
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          스크린샷을 업로드하면 AI가 사용자 여정, 휴리스틱 평가, 시각적 계층 구조 등
          다양한 UX/UI 관점에서 분석해드립니다.
        </p>
      </div>

      {/* 업로드 영역 */}
      <div className="mb-8">
        {file ? (
          <ImagePreview
            file={file}
            onRemove={removeFile}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <DropZone
            onFileSelect={selectFile}
            isUploading={isAnalyzing}
          />
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
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
          </div>
        )}
      </div>

      {/* 분석 영역 안내 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
        {[
          {
            title: '사용자 여정',
            description: '화면 내 사용자의 예상 동선과 플로우를 분석합니다',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            ),
          },
          {
            title: '휴리스틱 평가',
            description: '닐슨의 10가지 사용성 원칙을 기준으로 평가합니다',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            title: '시각적 계층',
            description: '정보의 우선순위와 시각적 흐름을 분석합니다',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            ),
          },
          {
            title: '색상 분석',
            description: '색상 팔레트와 대비를 분석합니다',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            ),
          },
          {
            title: '레이아웃',
            description: '그리드 시스템과 정렬 상태를 분석합니다',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            ),
          },
          {
            title: '접근성',
            description: 'WCAG 기준에 따른 접근성을 검토합니다',
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ),
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-muted">{item.icon}</div>
              <h3 className="font-medium text-sm">{item.title}</h3>
            </div>
            <p className="text-xs text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
