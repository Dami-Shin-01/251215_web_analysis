import { AnalysisResult } from '@/types';

export function parseAnalysisResponse(response: string): AnalysisResult {
  // JSON 블록 추출 시도
  let jsonString = response;

  // ```json ... ``` 형식 추출
  const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) {
    jsonString = jsonBlockMatch[1];
  } else {
    // ``` ... ``` 형식 추출
    const codeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1];
    }
  }

  // JSON 앞뒤 공백 제거
  jsonString = jsonString.trim();

  try {
    const parsed = JSON.parse(jsonString);

    // 필수 필드 검증
    if (!parsed.summary || typeof parsed.score !== 'number') {
      throw new Error('필수 필드가 누락되었습니다.');
    }

    // 기본값으로 누락된 필드 채우기
    return normalizeAnalysisResult(parsed);
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    console.error('원본 응답:', response.substring(0, 500));

    // 파싱 실패 시 기본 결과 반환
    return getDefaultAnalysisResult();
  }
}

function normalizeAnalysisResult(parsed: Partial<AnalysisResult>): AnalysisResult {
  return {
    summary: parsed.summary || '분석 결과를 불러올 수 없습니다.',
    score: parsed.score ?? 50,
    categories: {
      userFlow: parsed.categories?.userFlow || getDefaultUserFlow(),
      heuristics: parsed.categories?.heuristics || getDefaultHeuristics(),
      gestalt: parsed.categories?.gestalt || getDefaultGestalt(),
      cognitive: parsed.categories?.cognitive || getDefaultCognitive(),
      accessibility: parsed.categories?.accessibility || getDefaultAccessibility(),
      informationArchitecture: parsed.categories?.informationArchitecture || getDefaultIA(),
      layout: parsed.categories?.layout || getDefaultLayout(),
      typography: parsed.categories?.typography || getDefaultTypography(),
      color: parsed.categories?.color || getDefaultColor(),
      motion: parsed.categories?.motion || getDefaultMotion(),
    },
    detectedRegions: parsed.detectedRegions || [],
    improvements: parsed.improvements || [],
  };
}

function getDefaultAnalysisResult(): AnalysisResult {
  return {
    summary: '분석 결과를 파싱하는 중 오류가 발생했습니다.',
    score: 0,
    categories: {
      userFlow: getDefaultUserFlow(),
      heuristics: getDefaultHeuristics(),
      gestalt: getDefaultGestalt(),
      cognitive: getDefaultCognitive(),
      accessibility: getDefaultAccessibility(),
      informationArchitecture: getDefaultIA(),
      layout: getDefaultLayout(),
      typography: getDefaultTypography(),
      color: getDefaultColor(),
      motion: getDefaultMotion(),
    },
    detectedRegions: [],
    improvements: [],
  };
}

function getDefaultUserFlow() {
  return {
    score: 0,
    flowSteps: [],
    connections: [],
    findings: [],
    recommendations: [],
  };
}

function getDefaultHeuristics() {
  return {
    score: 0,
    heuristics: [
      { id: 'visibility', name: '시스템 상태의 가시성', score: 0, findings: [], relatedRegions: [] },
      { id: 'match', name: '시스템과 실제 세계의 일치', score: 0, findings: [], relatedRegions: [] },
      { id: 'control', name: '사용자 제어와 자유', score: 0, findings: [], relatedRegions: [] },
      { id: 'consistency', name: '일관성과 표준', score: 0, findings: [], relatedRegions: [] },
      { id: 'error-prevention', name: '오류 예방', score: 0, findings: [], relatedRegions: [] },
      { id: 'recognition', name: '기억보다 인식', score: 0, findings: [], relatedRegions: [] },
      { id: 'flexibility', name: '유연성과 효율성', score: 0, findings: [], relatedRegions: [] },
      { id: 'aesthetic', name: '미니멀 디자인', score: 0, findings: [], relatedRegions: [] },
      { id: 'error-recovery', name: '오류 인식, 진단, 복구', score: 0, findings: [], relatedRegions: [] },
      { id: 'help', name: '도움말과 문서화', score: 0, findings: [], relatedRegions: [] },
    ],
  };
}

function getDefaultGestalt() {
  return {
    score: 0,
    principles: [
      { name: 'proximity' as const, score: 0, findings: [], relatedRegions: [] },
      { name: 'similarity' as const, score: 0, findings: [], relatedRegions: [] },
      { name: 'continuity' as const, score: 0, findings: [], relatedRegions: [] },
      { name: 'closure' as const, score: 0, findings: [], relatedRegions: [] },
      { name: 'figure-ground' as const, score: 0, findings: [], relatedRegions: [] },
      { name: 'common-region' as const, score: 0, findings: [], relatedRegions: [] },
    ],
  };
}

function getDefaultCognitive() {
  return {
    score: 0,
    cognitiveLoad: {
      level: 'medium' as const,
      analysis: '분석 데이터 없음',
      factors: [],
    },
    fittsLaw: { findings: [] },
    hicksLaw: { findings: [] },
  };
}

function getDefaultAccessibility() {
  return {
    score: 0,
    wcagLevel: 'A' as const,
    issues: [],
    colorContrast: { score: 0, issues: [] },
  };
}

function getDefaultIA() {
  return {
    score: 0,
    structure: {
      depth: 0,
      breadth: 'balanced' as const,
      analysis: '분석 데이터 없음',
    },
    navigation: {
      type: 'horizontal' as const,
      clarity: 0,
      findability: 0,
    },
    contentGrouping: {
      score: 0,
      analysis: '분석 데이터 없음',
    },
  };
}

function getDefaultLayout() {
  return {
    score: 0,
    gridSystem: {
      detected: false,
      analysis: '분석 데이터 없음',
    },
    alignment: { score: 0, issues: [] },
    spacing: {
      consistency: 'medium' as const,
      analysis: '분석 데이터 없음',
    },
    visualHierarchy: {
      score: 0,
      analysis: '분석 데이터 없음',
    },
  };
}

function getDefaultTypography() {
  return {
    score: 0,
    detectedFonts: [],
    hierarchy: {
      levels: 0,
      consistency: 'medium' as const,
      analysis: '분석 데이터 없음',
    },
    readability: {
      score: 0,
      lineHeight: '분석 데이터 없음',
      letterSpacing: '분석 데이터 없음',
      issues: [],
    },
  };
}

function getDefaultColor() {
  return {
    score: 0,
    palette: [],
    harmony: {
      type: 'unknown',
      score: 0,
      analysis: '분석 데이터 없음',
    },
    contrast: { score: 0, issues: [] },
    emotionalImpact: '분석 데이터 없음',
  };
}

function getDefaultMotion() {
  return {
    score: 0,
    detected: false,
    analysis: '정적 이미지에서는 모션을 분석할 수 없습니다.',
    potentialAnimations: [],
  };
}
