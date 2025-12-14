'use client';

import { Annotation } from '@/types';

interface HighlightBoxProps {
  annotation: Annotation;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function HighlightBox({
  annotation,
  isSelected,
  onClick,
  onDelete,
}: HighlightBoxProps) {
  const { position, color, content } = annotation;

  return (
    <div
      className={`absolute cursor-pointer transition-all ${
        isSelected ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width || 0}%`,
        height: `${position.height || 0}%`,
        borderWidth: isSelected ? '2px' : '1px',
        borderStyle: 'solid',
        borderColor: color,
        backgroundColor: isSelected ? `${color}33` : `${color}1a`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* 삭제 버튼 */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center text-xs hover:bg-destructive/80 transition-colors"
        >
          ×
        </button>
      )}

      {/* 코멘트 표시 */}
      {content && isSelected && (
        <div
          className="absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg max-w-[200px] z-30"
          style={{ backgroundColor: color, color: 'white' }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
