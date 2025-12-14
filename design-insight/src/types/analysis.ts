// 분석 카테고리 타입
export type AnalysisCategory =
  | 'user-flow'
  | 'heuristics'
  | 'gestalt'
  | 'cognitive'
  | 'accessibility'
  | 'ia'
  | 'layout'
  | 'typography'
  | 'color'
  | 'motion';

// 감지된 영역 타입
export type DetectedRegionType =
  | 'navigation'
  | 'cta'
  | 'content'
  | 'form'
  | 'image'
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'card'
  | 'button'
  | 'input'
  | 'link';

// 바운딩 박스 (퍼센트 기반)
export interface BoundingBox {
  x: number;      // 0-100%
  y: number;      // 0-100%
  width: number;  // 0-100%
  height: number; // 0-100%
}

// 감지된 영역
export interface DetectedRegion {
  id: string;
  type: DetectedRegionType;
  boundingBox: BoundingBox;
  label: string;
  confidence: number;
  analysisNotes: string;
}

// 발견사항
export interface Finding {
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  location?: string;
}

// 개선 제안
export interface Improvement {
  id: string;
  category: AnalysisCategory;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  relatedRegions: string[];
}

// 사용자 플로우 분석
export interface FlowStep {
  id: string;
  label: string;
  description: string;
  boundingBox: BoundingBox;
  order: number;
  type: 'entry' | 'action' | 'decision' | 'exit';
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

export interface UserFlowAnalysis {
  score: number;
  flowSteps: FlowStep[];
  connections: FlowConnection[];
  findings: Finding[];
  recommendations: string[];
}

// 닐슨 휴리스틱 분석
export interface HeuristicItem {
  id: string;
  name: string;
  score: number;
  findings: Finding[];
  relatedRegions: string[];
}

export interface HeuristicAnalysis {
  score: number;
  heuristics: HeuristicItem[];
}

// 게슈탈트 분석
export interface GestaltPrinciple {
  name: 'proximity' | 'similarity' | 'continuity' | 'closure' | 'figure-ground' | 'common-region';
  score: number;
  findings: Finding[];
  relatedRegions: string[];
}

export interface GestaltAnalysis {
  score: number;
  principles: GestaltPrinciple[];
}

// 인지 부하 분석
export interface CognitiveAnalysis {
  score: number;
  cognitiveLoad: {
    level: 'low' | 'medium' | 'high';
    analysis: string;
    factors: string[];
  };
  fittsLaw: {
    findings: {
      element: string;
      analysis: string;
      recommendation: string;
    }[];
  };
  hicksLaw: {
    findings: {
      element: string;
      optionCount: number;
      analysis: string;
      recommendation: string;
    }[];
  };
}

// 접근성 분석
export interface AccessibilityIssue {
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  description: string;
  suggestion: string;
  relatedRegions: string[];
}

export interface AccessibilityAnalysis {
  score: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  issues: AccessibilityIssue[];
  colorContrast: {
    score: number;
    issues: string[];
  };
}

// 정보 구조 분석
export interface IAAnalysis {
  score: number;
  structure: {
    depth: number;
    breadth: 'narrow' | 'balanced' | 'wide';
    analysis: string;
  };
  navigation: {
    type: 'horizontal' | 'vertical' | 'hamburger' | 'mixed';
    clarity: number;
    findability: number;
  };
  contentGrouping: {
    score: number;
    analysis: string;
  };
}

// 레이아웃 분석
export interface LayoutAnalysis {
  score: number;
  gridSystem: {
    detected: boolean;
    columns?: number;
    gutterWidth?: string;
    analysis: string;
  };
  alignment: {
    score: number;
    issues: string[];
  };
  spacing: {
    consistency: 'low' | 'medium' | 'high';
    analysis: string;
  };
  visualHierarchy: {
    score: number;
    analysis: string;
  };
}

// 타이포그래피 분석
export interface TypographyAnalysis {
  score: number;
  detectedFonts: {
    name: string;
    usage: 'heading' | 'body' | 'caption';
    analysis: string;
  }[];
  hierarchy: {
    levels: number;
    consistency: 'low' | 'medium' | 'high';
    analysis: string;
  };
  readability: {
    score: number;
    lineHeight: string;
    letterSpacing: string;
    issues: string[];
  };
}

// 색상 분석
export interface ColorInfo {
  hex: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral' | 'background';
  percentage: number;
}

export interface ColorAnalysis {
  score: number;
  palette: ColorInfo[];
  harmony: {
    type: string;
    score: number;
    analysis: string;
  };
  contrast: {
    score: number;
    issues: string[];
  };
  emotionalImpact: string;
}

// 모션 분석
export interface MotionAnalysis {
  score: number;
  detected: boolean;
  analysis: string;
  potentialAnimations: {
    element: string;
    suggestedMotion: string;
    purpose: string;
  }[];
}

// 전체 분석 결과
export interface AnalysisResult {
  summary: string;
  score: number;
  categories: {
    userFlow: UserFlowAnalysis;
    heuristics: HeuristicAnalysis;
    gestalt: GestaltAnalysis;
    cognitive: CognitiveAnalysis;
    accessibility: AccessibilityAnalysis;
    informationArchitecture: IAAnalysis;
    layout: LayoutAnalysis;
    typography: TypographyAnalysis;
    color: ColorAnalysis;
    motion: MotionAnalysis;
  };
  detectedRegions: DetectedRegion[];
  improvements: Improvement[];
}

// 분석 옵션
export interface AnalysisOptions {
  categories: AnalysisCategory[];
  depth: 'quick' | 'standard' | 'deep';
}

// 분석 레코드 (저장용)
export interface AnalysisRecord {
  id: string;
  imageData: string;
  imageMeta: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  result: AnalysisResult;
  options: AnalysisOptions;
  annotations: import('./annotation').Annotation[];
  createdAt: string;
  updatedAt: string;
}

// 분석 메타데이터 (목록용)
export interface AnalysisMeta {
  id: string;
  imageMeta: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  summary: string;
  score: number;
  createdAt: string;
}
