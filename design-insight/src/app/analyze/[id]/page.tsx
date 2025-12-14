'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAnalysisStore, useAnnotationStore } from '@/store';
import { AnalysisPanel, ImageCanvas } from '@/components/analysis';
import { Button, Skeleton } from '@/components/ui';
import { AnalysisResult } from '@/types';

interface AnalysisData {
  id: string;
  result: AnalysisResult;
  imageData: string;
  imageMeta: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  createdAt: string;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const {
    activeCategory,
    setActiveCategory,
    highlightedRegions,
    highlightRegions,
    clearHighlights,
  } = useAnalysisStore();

  const { showAiRegions, toggleAiRegions } = useAnnotationStore();

  // 분석 데이터 로드
  useEffect(() => {
    // 로컬 스토리지에서 임시 데이터 불러오기 (KV 연동 전)
    const loadAnalysis = async () => {
      setIsLoading(true);
      try {
        // 세션 스토리지에서 최근 분석 데이터 확인
        const storedData = sessionStorage.getItem(`analysis_${id}`);
        if (storedData) {
          setAnalysisData(JSON.parse(storedData));
        } else {
          // TODO: API에서 데이터 로드 (Phase 6)
          setError('분석 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAnalysis();
    }
  }, [id]);

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

  if (error || !analysisData) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">UX/UI 분석 결과</h1>
          <p className="text-sm text-muted">
            {new Date(analysisData.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showAiRegions ? 'secondary' : 'outline'}
            size="sm"
            onClick={toggleAiRegions}
          >
            {showAiRegions ? 'AI 영역 숨기기' : 'AI 영역 표시'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push('/')}>
            새로 분석
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 이미지 캔버스 */}
        <div className="lg:sticky lg:top-20 lg:h-fit">
          <ImageCanvas
            imageData={analysisData.imageData}
            detectedRegions={analysisData.result.detectedRegions}
            highlightedRegions={highlightedRegions}
            showAiRegions={showAiRegions}
            onRegionClick={handleRegionClick}
          />
        </div>

        {/* 분석 패널 */}
        <div className="overflow-y-auto">
          <AnalysisPanel
            analysis={analysisData.result}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onRegionClick={handleRegionClick}
          />
        </div>
      </div>
    </div>
  );
}
