'use client';

import { useAnnotationStore } from '@/store';
import { AnnotationTool, ANNOTATION_COLORS } from '@/types';

const tools: { id: AnnotationTool; label: string; icon: React.ReactNode }[] = [
  {
    id: 'select',
    label: '선택',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    id: 'box',
    label: '박스',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
      </svg>
    ),
  },
  {
    id: 'marker',
    label: '마커',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'comment',
    label: '코멘트',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
];

export function AnnotationToolbar() {
  const {
    selectedTool,
    selectedColor,
    setTool,
    setColor,
    showAiRegions,
    showGrid,
    toggleAiRegions,
    toggleGrid,
    annotations,
    clearAnnotations,
  } = useAnnotationStore();

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border bg-card">
      {/* 도구 선택 */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`p-2 rounded-lg transition-colors ${
              selectedTool === tool.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-muted-foreground hover:text-foreground'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-px h-6 bg-border" />

      {/* 색상 선택 */}
      <div className="flex items-center gap-1">
        {ANNOTATION_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setColor(color)}
            className={`w-5 h-5 rounded-full transition-transform ${
              selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-background' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* 구분선 */}
      <div className="w-px h-6 bg-border" />

      {/* 표시 옵션 */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleAiRegions}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            showAiRegions
              ? 'bg-blue-500/20 text-blue-500'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          AI 영역
        </button>
        <button
          onClick={toggleGrid}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            showGrid
              ? 'bg-green-500/20 text-green-500'
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          그리드
        </button>
      </div>

      {/* 구분선 */}
      {annotations.length > 0 && (
        <>
          <div className="w-px h-6 bg-border" />
          <button
            onClick={clearAnnotations}
            className="px-2 py-1 text-xs rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            모두 삭제
          </button>
        </>
      )}
    </div>
  );
}
