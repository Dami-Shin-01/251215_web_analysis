'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAnalysisStore, useAnnotationStore } from '@/store';
import { AnalysisPanel, ImageCanvas } from '@/components/analysis';
import { AnnotationToolbar } from '@/components/annotation';
import { Button, Skeleton } from '@/components/ui';

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    analysisId,
    currentAnalysis,
    imageData,
    activeCategory,
    setActiveCategory,
    highlightedRegions,
    highlightRegions,
    clearHighlights,
  } = useAnalysisStore();

  const { showAiRegions } = useAnnotationStore();

  // 분석 데이터 확인
  useEffect(() => {
    setIsLoading(true);

    // zustand store에서 데이터 확인
    if (analysisId === id && currentAnalysis && imageData) {
      setIsLoading(false);
    } else {
      // 데이터가 없으면 에러 (새로고침 시 발생)
      setError('분석 데이터를 찾을 수 없습니다. 새로 분석해주세요.');
      setIsLoading(false);
    }
  }, [id, analysisId, currentAnalysis, imageData]);

  const handleRegionClick = (regionId: string) => {
    if (highlightedRegions.includes(regionId)) {
      clearHighlights();
    } else {
      highlightRegions([regionId]);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[500px] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentAnalysis || !imageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="text-xl font-bold mb-4">오류가 발생했습니다</h1>
          <p className="text-muted mb-6">{error || '분석 데이터를 찾을 수 없습니다.'}</p>
          <Button onClick={() => router.push('/')}>새로 분석하기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">UX/UI 분석 결과</h1>
          <p className="text-sm text-muted">
            {new Date().toLocaleString('ko-KR')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/')}>
          새로 분석
        </Button>
      </div>

      {/* 어노테이션 툴바 */}
      <div className="mb-4">
        <AnnotationToolbar />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 이미지 캔버스 */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <ImageCanvas
            imageData={imageData}
            detectedRegions={currentAnalysis.detectedRegions}
            highlightedRegions={highlightedRegions}
            showAiRegions={showAiRegions}
            onRegionClick={handleRegionClick}
          />
        </div>

        {/* 분석 패널 */}
        <div className="overflow-y-auto">
          <AnalysisPanel
            analysis={currentAnalysis}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onRegionClick={handleRegionClick}
          />
        </div>
      </div>
    </div>
  );
}
