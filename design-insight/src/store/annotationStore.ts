import { create } from 'zustand';
import { Annotation, AnnotationTool, AnnotationColor, ANNOTATION_COLORS } from '@/types';
import { generateAnnotationId } from '@/lib/utils';

interface AnnotationState {
  // 어노테이션 목록
  annotations: Annotation[];

  // 도구 상태
  selectedTool: AnnotationTool;
  selectedColor: AnnotationColor;
  selectedAnnotationId: string | null;

  // 표시 옵션
  showAiRegions: boolean;
  showGrid: boolean;

  // 액션
  addAnnotation: (
    annotation: Omit<Annotation, 'id' | 'createdAt'>
  ) => void;
  updateAnnotation: (
    id: string,
    updates: Partial<Omit<Annotation, 'id' | 'createdAt'>>
  ) => void;
  deleteAnnotation: (id: string) => void;
  selectAnnotation: (id: string | null) => void;
  setTool: (tool: AnnotationTool) => void;
  setColor: (color: AnnotationColor) => void;
  toggleAiRegions: () => void;
  toggleGrid: () => void;
  loadAnnotations: (annotations: Annotation[]) => void;
  clearAnnotations: () => void;
}

export const useAnnotationStore = create<AnnotationState>((set) => ({
  // 초기 상태
  annotations: [],
  selectedTool: 'select',
  selectedColor: ANNOTATION_COLORS[4], // blue
  selectedAnnotationId: null,
  showAiRegions: true,
  showGrid: false,

  // 액션
  addAnnotation: (annotation) =>
    set((state) => ({
      annotations: [
        ...state.annotations,
        {
          ...annotation,
          id: generateAnnotationId(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateAnnotation: (id, updates) =>
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id
          ? { ...a, ...updates, updatedAt: new Date().toISOString() }
          : a
      ),
    })),

  deleteAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
      selectedAnnotationId:
        state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
    })),

  selectAnnotation: (id) => set({ selectedAnnotationId: id }),

  setTool: (tool) => set({ selectedTool: tool }),

  setColor: (color) => set({ selectedColor: color }),

  toggleAiRegions: () =>
    set((state) => ({ showAiRegions: !state.showAiRegions })),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  loadAnnotations: (annotations) => set({ annotations }),

  clearAnnotations: () =>
    set({ annotations: [], selectedAnnotationId: null }),
}));
