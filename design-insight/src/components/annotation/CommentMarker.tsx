'use client';

import { useState } from 'react';
import { Annotation } from '@/types';

interface CommentMarkerProps {
  annotation: Annotation;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onUpdate: (content: string) => void;
}

export function CommentMarker({
  annotation,
  isSelected,
  onClick,
  onDelete,
  onUpdate,
}: CommentMarkerProps) {
  const { position, color, content } = annotation;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all ${
        isSelected ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* 마커 핀 */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform ${
          isSelected ? 'scale-125' : 'hover:scale-110'
        }`}
        style={{ backgroundColor: color }}
      >
        {annotation.type === 'marker' ? (
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        )}
      </div>

      {/* 팝오버 */}
      {isSelected && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 rounded-lg shadow-xl border bg-card min-w-[200px] z-30"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded resize-none bg-background"
                rows={3}
                placeholder="메모를 입력하세요..."
                autoFocus
              />
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => {
                    setEditContent(content);
                    setIsEditing(false);
                  }}
                  className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                {content || (
                  <span className="text-muted-foreground italic">
                    메모가 없습니다
                  </span>
                )}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  편집
                </button>
                <button
                  onClick={onDelete}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
