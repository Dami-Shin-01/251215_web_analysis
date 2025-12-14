// 어노테이션 도구 타입
export type AnnotationTool = 'select' | 'box' | 'marker' | 'comment';

// 어노테이션 타입
export type AnnotationType = 'box' | 'marker' | 'comment';

// 어노테이션 색상
export type AnnotationColor =
  | '#ef4444' // red
  | '#f97316' // orange
  | '#eab308' // yellow
  | '#22c55e' // green
  | '#3b82f6' // blue
  | '#8b5cf6' // purple
  | '#ec4899'; // pink

export const ANNOTATION_COLORS: AnnotationColor[] = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

// 어노테이션 위치
export interface AnnotationPosition {
  x: number;      // 퍼센트 (0-100)
  y: number;      // 퍼센트 (0-100)
  width?: number; // 박스 타입일 때만 사용
  height?: number;
}

// 어노테이션
export interface Annotation {
  id: string;
  type: AnnotationType;
  position: AnnotationPosition;
  content: string;
  color: AnnotationColor;
  createdAt: string;
  updatedAt?: string;
}

// 새 어노테이션 생성용
export interface CreateAnnotationInput {
  type: AnnotationType;
  position: AnnotationPosition;
  content?: string;
  color?: AnnotationColor;
}

// 어노테이션 업데이트용
export interface UpdateAnnotationInput {
  position?: AnnotationPosition;
  content?: string;
  color?: AnnotationColor;
}
