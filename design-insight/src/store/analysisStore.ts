import { create } from 'zustand';
import { AnalysisResult, AnalysisCategory } from '@/types';

interface AnalysisState {
  // 현재 분석 데이터
  currentAnalysis: AnalysisResult | null;
  analysisId: string | null;
  imageData: string | null;
  imageMeta: {
    width: number;
    height: number;
    format: string;
    size: number;
  } | null;

  // 로딩 상태
  isAnalyzing: boolean;
  error: string | null;

  // 뷰 상태
  activeCategory: AnalysisCategory;
  highlightedRegions: string[];

  // 액션
  setAnalysis: (
    id: string,
    analysis: AnalysisResult,
    imageData: string,
    imageMeta?: { width: number; height: number; format: string; size: number }
  ) => void;
  setActiveCategory: (category: AnalysisCategory) => void;
  highlightRegion: (regionId: string) => void;
  highlightRegions: (regionIds: string[]) => void;
  clearHighlights: () => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  // 초기 상태
  currentAnalysis: null,
  analysisId: null,
  imageData: null,
  imageMeta: null,
  isAnalyzing: false,
  error: null,
  activeCategory: 'user-flow',
  highlightedRegions: [],

  // 액션
  setAnalysis: (id, analysis, imageData, imageMeta) =>
    set({
      analysisId: id,
      currentAnalysis: analysis,
      imageData,
      imageMeta: imageMeta || null,
      isAnalyzing: false,
      error: null,
    }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  highlightRegion: (regionId) =>
    set((state) => ({
      highlightedRegions: state.highlightedRegions.includes(regionId)
        ? state.highlightedRegions
        : [...state.highlightedRegions, regionId],
    })),

  highlightRegions: (regionIds) => set({ highlightedRegions: regionIds }),

  clearHighlights: () => set({ highlightedRegions: [] }),

  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

  setError: (error) => set({ error, isAnalyzing: false }),

  reset: () =>
    set({
      currentAnalysis: null,
      analysisId: null,
      imageData: null,
      imageMeta: null,
      isAnalyzing: false,
      error: null,
      activeCategory: 'user-flow',
      highlightedRegions: [],
    }),
}));
