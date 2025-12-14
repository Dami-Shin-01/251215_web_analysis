'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { DetectedRegion, Annotation } from '@/types';
import { useAnnotationStore } from '@/store';
import { HighlightBox, CommentMarker } from '@/components/annotation';

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const {
    annotations,
    selectedTool,
    selectedColor,
    selectedAnnotationId,
    showGrid,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation,
  } = useAnnotationStore();

  // 이미지 로드 시 크기 가져오기
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = `data:image/png;base64,${imageData}`;
  }, [imageData]);

  // 마우스 좌표를 퍼센트로 변환
  const getPercentPosition = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  // 마우스 다운 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'select') {
      selectAnnotation(null);
      return;
    }

    const pos = getPercentPosition(e);

    if (selectedTool === 'marker' || selectedTool === 'comment') {
      addAnnotation({
        type: selectedTool,
        position: { x: pos.x, y: pos.y },
        content: '',
        color: selectedColor,
      });
    } else if (selectedTool === 'box') {
      setIsDrawing(true);
      setDrawStart(pos);
      setCurrentBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
    }
  }, [selectedTool, selectedColor, addAnnotation, selectAnnotation, getPercentPosition]);

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !drawStart) return;

    const pos = getPercentPosition(e);
    const x = Math.min(drawStart.x, pos.x);
    const y = Math.min(drawStart.y, pos.y);
    const width = Math.abs(pos.x - drawStart.x);
    const height = Math.abs(pos.y - drawStart.y);

    setCurrentBox({ x, y, width, height });
  }, [isDrawing, drawStart, getPercentPosition]);

  // 마우스 업 핸들러
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentBox) return;

    // 최소 크기 체크
    if (currentBox.width > 1 && currentBox.height > 1) {
      addAnnotation({
        type: 'box',
        position: {
          x: currentBox.x,
          y: currentBox.y,
          width: currentBox.width,
          height: currentBox.height,
        },
        content: '',
        color: selectedColor,
      });
    }

    setIsDrawing(false);
    setDrawStart(null);
    setCurrentBox(null);
  }, [isDrawing, currentBox, selectedColor, addAnnotation]);

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
      className={`relative w-full overflow-hidden rounded-xl border bg-card ${
        selectedTool !== 'select' ? 'cursor-crosshair' : 'cursor-default'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
          className="object-contain pointer-events-none"
          sizes="(max-width: 768px) 100vw, 60vw"
          draggable={false}
        />

        {/* 그리드 오버레이 */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            {/* 12 컬럼 그리드 */}
            <div className="absolute inset-0 grid grid-cols-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="border-l border-green-500/30 h-full"
                />
              ))}
            </div>
            {/* 가로 가이드 */}
            <div className="absolute inset-0 flex flex-col">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="border-t border-green-500/30 flex-1"
                />
              ))}
            </div>
          </div>
        )}

        {/* AI 감지 영역 오버레이 */}
        {showAiRegions && detectedRegions.map((region) => (
          <div
            key={region.id}
            className="absolute border border-dashed cursor-pointer transition-all hover:bg-blue-500/20"
            style={getRegionStyle(region)}
            onClick={(e) => {
              e.stopPropagation();
              onRegionClick?.(region.id);
            }}
            title={region.label}
          >
            {/* 레이블 */}
            <div className="absolute -top-5 left-0 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded whitespace-nowrap">
              {region.label}
            </div>
          </div>
        ))}

        {/* 사용자 어노테이션 */}
        {annotations.map((annotation) => {
          if (annotation.type === 'box') {
            return (
              <HighlightBox
                key={annotation.id}
                annotation={annotation}
                isSelected={selectedAnnotationId === annotation.id}
                onClick={() => selectAnnotation(annotation.id)}
                onDelete={() => deleteAnnotation(annotation.id)}
              />
            );
          }
          return (
            <CommentMarker
              key={annotation.id}
              annotation={annotation}
              isSelected={selectedAnnotationId === annotation.id}
              onClick={() => selectAnnotation(annotation.id)}
              onDelete={() => deleteAnnotation(annotation.id)}
              onUpdate={(content) => updateAnnotation(annotation.id, { content })}
            />
          );
        })}

        {/* 현재 그리고 있는 박스 */}
        {currentBox && (
          <div
            className="absolute border-2 pointer-events-none"
            style={{
              left: `${currentBox.x}%`,
              top: `${currentBox.y}%`,
              width: `${currentBox.width}%`,
              height: `${currentBox.height}%`,
              borderColor: selectedColor,
              backgroundColor: `${selectedColor}1a`,
            }}
          />
        )}
      </div>
    </div>
  );
}
