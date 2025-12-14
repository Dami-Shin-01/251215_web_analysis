'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { DetectedRegion } from '@/types';

interface ImageCanvasProps {
  imageData: string;
  detectedRegions: DetectedRegion[];
  highlightedRegions: string[];
  showAiRegions: boolean;
  onRegionClick?: (regionId: string) => void;
}

export function ImageCanvas({
  imageData,
  detectedRegions,
  highlightedRegions,
  showAiRegions,
  onRegionClick,
}: ImageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // 이미지 로드 시 크기 가져오기
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = `data:image/png;base64,${imageData}`;
  }, [imageData]);

  const getRegionStyle = (region: DetectedRegion) => {
    const isHighlighted = highlightedRegions.includes(region.id);

    return {
      left: `${region.boundingBox.x}%`,
      top: `${region.boundingBox.y}%`,
      width: `${region.boundingBox.width}%`,
      height: `${region.boundingBox.height}%`,
      borderColor: isHighlighted ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)',
      backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
      borderWidth: isHighlighted ? '2px' : '1px',
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border bg-card"
    >
      {/* 이미지 */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: imageSize ? `${imageSize.width}/${imageSize.height}` : '16/9',
        }}
      >
        <Image
          src={`data:image/png;base64,${imageData}`}
          alt="분석 대상 스크린샷"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {/* AI 감지 영역 오버레이 */}
        {showAiRegions && detectedRegions.map((region) => (
          <div
            key={region.id}
            className="absolute border border-dashed cursor-pointer transition-all hover:bg-blue-500/20"
            style={getRegionStyle(region)}
            onClick={() => onRegionClick?.(region.id)}
            title={region.label}
          >
            {/* 레이블 */}
            <div className="absolute -top-5 left-0 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded whitespace-nowrap">
              {region.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
