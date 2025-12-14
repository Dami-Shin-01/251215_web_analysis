# Design Insight - 프로젝트 계획서

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Design Insight
- **목적**: 웹사이트 스크린샷을 업로드하여 UX/UI 디자인을 분석하고 학습할 수 있는 웹앱
- **유형**: 개인 프로젝트
- **UI 언어**: 한국어
- **UI 스타일**: 미니멀 모던 (깔끔한 흑백 톤 기반)

### 1.2 핵심 기능
1. **스크린샷 업로드**: 사용자가 직접 웹사이트 스크린샷 업로드
2. **AI 기반 UX 분석**: Google Gemini 멀티모달 API를 활용한 자동 분석
3. **인터랙티브 어노테이션**: 스크린샷 위에 분석 내용 표시, 메모 추가
4. **분석 히스토리**: 이전 분석 결과 저장 및 조회

### 1.3 분석 영역 (우선순위)
| 순위 | 영역 | 자동화 수준 |
|------|------|-------------|
| 1 | 사용자 여정/플로우 분석 | AI 분석 |
| 2 | 정보구조(IA) | AI 분석 |
| 3 | 그리드/레이아웃 | AI + 수동 |
| 4 | 타이포그래피 | AI 분석 |
| 5 | 애니메이션/모션 | 수동 분석 |
| 6 | 색상 팔레트/대비 | AI 분석 |

### 1.4 UX 이론 프레임워크
- 닐슨의 10가지 휴리스틱
- 게슈탈트 원칙 (근접성, 유사성, 연속성, 폐쇄성)
- 피츠의 법칙 / 힉의 법칙
- 인지 부하 이론
- WCAG 접근성 가이드라인

---

## 2. 기술 스택

### 2.1 Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.x | React 프레임워크 (App Router) |
| TypeScript | 5.x | 타입 안정성 |
| Tailwind CSS | 3.x | 스타일링 |
| Zustand | 4.x | 상태 관리 |

### 2.2 Backend (Serverless)
| 기술 | 용도 |
|------|------|
| Next.js API Routes | 서버리스 API |
| Google Gemini API | 멀티모달 AI 분석 |
| Vercel KV | Redis 기반 데이터 저장 |

### 2.3 배포
| 서비스 | 용도 |
|--------|------|
| Vercel | 호스팅 및 서버리스 함수 |

### 2.4 주요 의존성
```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@google/generative-ai": "^0.x",
    "@vercel/kv": "^1.x",
    "zustand": "^4.x",
    "nanoid": "^5.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x"
  }
}
```

---

## 3. 프로젝트 구조

```
design-insight/
├── .env.local                    # 환경변수
├── .env.example                  # 환경변수 템플릿
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
│
├── public/
│   └── images/                   # 정적 이미지
│
└── src/
    ├── app/                      # App Router
    │   ├── layout.tsx            # 루트 레이아웃
    │   ├── page.tsx              # 홈페이지 (업로드)
    │   ├── globals.css           # 전역 스타일
    │   │
    │   ├── analyze/
    │   │   ├── page.tsx          # 분석 진행 페이지
    │   │   └── [id]/
    │   │       └── page.tsx      # 분석 결과 상세
    │   │
    │   ├── history/
    │   │   └── page.tsx          # 히스토리 목록
    │   │
    │   └── api/
    │       ├── analyze/
    │       │   └── route.ts      # POST: 이미지 분석
    │       ├── annotations/
    │       │   └── route.ts      # POST/PUT: 어노테이션
    │       └── history/
    │           ├── route.ts      # GET: 히스토리 목록
    │           └── [id]/
    │               └── route.ts  # GET/DELETE: 개별 분석
    │
    ├── components/
    │   ├── ui/                   # 공통 UI 컴포넌트
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Tabs.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Tooltip.tsx
    │   │   └── Skeleton.tsx
    │   │
    │   ├── layout/               # 레이아웃 컴포넌트
    │   │   ├── Header.tsx
    │   │   └── Sidebar.tsx
    │   │
    │   ├── upload/               # 업로드 관련
    │   │   ├── DropZone.tsx
    │   │   ├── ImagePreview.tsx
    │   │   └── UploadProgress.tsx
    │   │
    │   ├── analysis/             # 분석 관련
    │   │   ├── AnalysisPanel.tsx
    │   │   ├── CategoryTabs.tsx
    │   │   ├── HeuristicCard.tsx
    │   │   ├── FlowDiagram.tsx
    │   │   ├── ColorPaletteView.tsx
    │   │   ├── TypographyAnalysis.tsx
    │   │   └── GridOverlay.tsx
    │   │
    │   ├── annotation/           # 어노테이션 관련
    │   │   ├── AnnotationCanvas.tsx
    │   │   ├── AnnotationToolbar.tsx
    │   │   ├── HighlightBox.tsx
    │   │   ├── CommentMarker.tsx
    │   │   ├── CommentPopover.tsx
    │   │   └── LayerPanel.tsx
    │   │
    │   └── history/              # 히스토리 관련
    │       ├── HistoryList.tsx
    │       └── HistoryCard.tsx
    │
    ├── lib/                      # 라이브러리/유틸리티
    │   ├── gemini/
    │   │   ├── client.ts         # Gemini API 클라이언트
    │   │   ├── prompts.ts        # 분석 프롬프트
    │   │   └── parser.ts         # 응답 파싱
    │   │
    │   ├── kv/
    │   │   ├── client.ts         # Vercel KV 클라이언트
    │   │   └── schema.ts         # 데이터 스키마
    │   │
    │   ├── utils/
    │   │   ├── image.ts          # 이미지 처리
    │   │   ├── date.ts           # 날짜 포맷팅
    │   │   └── validation.ts     # 입력 검증
    │   │
    │   └── constants.ts          # 상수 정의
    │
    ├── hooks/                    # 커스텀 훅
    │   ├── useAnalysis.ts
    │   ├── useAnnotation.ts
    │   ├── useImageUpload.ts
    │   └── useHistory.ts
    │
    ├── store/                    # Zustand 스토어
    │   ├── analysisStore.ts
    │   ├── annotationStore.ts
    │   └── uiStore.ts
    │
    └── types/                    # TypeScript 타입
        ├── analysis.ts
        ├── annotation.ts
        └── api.ts
```

---

## 4. 페이지 및 라우트 설계

### 4.1 페이지 구성
| 경로 | 설명 | 주요 기능 |
|------|------|----------|
| `/` | 홈 (업로드) | 스크린샷 드래그앤드롭 업로드, 분석 시작 |
| `/analyze` | 분석 진행 | 분석 중 로딩 상태 표시 |
| `/analyze/[id]` | 분석 결과 | 분석 결과 표시, 어노테이션 도구 |
| `/history` | 히스토리 | 이전 분석 목록, 검색/필터 |

### 4.2 API 라우트
| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/analyze` | POST | 이미지 업로드 및 분석 요청 |
| `/api/history` | GET | 분석 히스토리 목록 |
| `/api/history/[id]` | GET | 특정 분석 상세 조회 |
| `/api/history/[id]` | DELETE | 분석 삭제 |
| `/api/annotations` | POST/PUT | 어노테이션 저장/수정 |

---

## 5. 데이터 스키마

### 5.1 AnalysisRecord (Vercel KV)
```typescript
interface AnalysisRecord {
  id: string;                    // nanoid 생성
  imageData: string;             // Base64 인코딩
  imageMeta: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  result: AnalysisResult;
  annotations: Annotation[];
  createdAt: string;             // ISO 8601
  updatedAt: string;
}
```

### 5.2 AnalysisResult
```typescript
interface AnalysisResult {
  summary: string;               // 전체 요약
  score: number;                 // 0-100 점수

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
```

### 5.3 DetectedRegion
```typescript
interface DetectedRegion {
  id: string;
  type: 'navigation' | 'cta' | 'content' | 'form' | 'image' | 'header' | 'footer';
  boundingBox: {
    x: number;      // 퍼센트 (0-100)
    y: number;
    width: number;
    height: number;
  };
  label: string;
  confidence: number;
  analysisNotes: string;
}
```

### 5.4 Annotation
```typescript
interface Annotation {
  id: string;
  type: 'box' | 'marker' | 'comment';
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  content: string;
  color: string;
  createdAt: string;
}
```

### 5.5 Vercel KV 키 구조
```
analysis:{id}           # 전체 분석 데이터 (JSON)
analysis:meta:{id}      # 메타데이터만 (목록용)
analysis:list           # Sorted Set (생성일 기준 정렬)
```

---

## 6. Gemini API 연동

### 6.1 클라이언트 설정
```typescript
// src/lib/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function analyzeImage(
  base64Image: string,
  options: AnalysisOptions
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'  // 또는 gemini-1.5-pro
  });

  const prompt = buildAnalysisPrompt(options);

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image,
      },
    },
    prompt,
  ]);

  return parseAnalysisResponse(result.response.text());
}
```

### 6.2 프롬프트 전략
1. **JSON 형식 응답 강제**: 구조화된 파싱
2. **영역 좌표 포함**: boundingBox로 하이라이트 연동
3. **카테고리별 분리**: 독립적인 분석 결과
4. **한국어 응답 요청**: UI 언어 일관성

### 6.3 프롬프트 예시
```
당신은 UX/UI 디자인 전문가입니다.
제공된 웹사이트 스크린샷을 분석하여 상세한 UX/UI 분석 리포트를 작성해주세요.

## 분석 요청
다음 JSON 형식으로 응답해주세요...

{
  "summary": "전체 분석 요약",
  "score": 0-100,
  "categories": {
    "userFlow": {...},
    "heuristics": {...},
    ...
  },
  "detectedRegions": [...],
  "improvements": [...]
}
```

---

## 7. 컴포넌트 상세 설계

### 7.1 DropZone
- 드래그앤드롭 영역
- 클릭으로 파일 선택
- 파일 검증 (크기: 10MB, 형식: PNG/JPG/WebP)
- 업로드 진행률 표시

### 7.2 AnnotationCanvas
- 이미지 위 어노테이션 렌더링
- 도구: select, box, marker, comment
- 줌/팬 지원
- AI 감지 영역 표시 토글
- 그리드 오버레이 토글

### 7.3 AnalysisPanel
- 카테고리별 탭 네비게이션
- 분석 결과 카드
- 영역 클릭 시 캔버스 하이라이트 연동
- 개선 제안 목록

### 7.4 FlowDiagram
- 사용자 플로우 시각화
- 단계별 연결선
- 클릭 시 해당 영역 하이라이트

---

## 8. 상태 관리 (Zustand)

### 8.1 analysisStore
```typescript
interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  analysisId: string | null;
  imageUrl: string | null;
  isAnalyzing: boolean;
  error: string | null;
  activeCategory: AnalysisCategory;
  highlightedRegions: string[];

  // 액션
  setAnalysis: (id, analysis, imageUrl) => void;
  setActiveCategory: (category) => void;
  highlightRegion: (regionId) => void;
  clearHighlights: () => void;
  reset: () => void;
}
```

### 8.2 annotationStore
```typescript
interface AnnotationState {
  annotations: Annotation[];
  selectedTool: AnnotationTool;
  selectedAnnotationId: string | null;
  showAiRegions: boolean;
  showGrid: boolean;

  // 액션
  addAnnotation: (annotation) => void;
  updateAnnotation: (id, updates) => void;
  deleteAnnotation: (id) => void;
  setTool: (tool) => void;
  toggleAiRegions: () => void;
  toggleGrid: () => void;
}
```

---

## 9. 환경 변수

### 9.1 .env.local
```env
# Google Gemini API
GOOGLE_API_KEY=your_google_api_key

# Vercel KV
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

### 9.2 .env.example
```env
GOOGLE_API_KEY=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

---

## 10. 구현 단계 (Phase)

### Phase 1: 프로젝트 초기화
- [x] 프로젝트 계획 문서화
- [ ] Next.js 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] 기본 레이아웃 (Header, 전역 스타일)
- [ ] 기본 UI 컴포넌트 (Button, Card)

### Phase 2: 이미지 업로드
- [ ] DropZone 컴포넌트
- [ ] ImagePreview 컴포넌트
- [ ] useImageUpload 훅
- [ ] 홈페이지 통합

### Phase 3: Gemini API 연동
- [ ] Gemini 클라이언트 설정
- [ ] 분석 프롬프트 작성
- [ ] /api/analyze 라우트
- [ ] 응답 파싱 로직

### Phase 4: 분석 결과 UI
- [ ] AnalysisPanel 컴포넌트
- [ ] CategoryTabs
- [ ] FlowDiagram
- [ ] AI 감지 영역 하이라이트

### Phase 5: 어노테이션 시스템
- [ ] AnnotationCanvas
- [ ] AnnotationToolbar
- [ ] HighlightBox
- [ ] CommentMarker + CommentPopover
- [ ] annotationStore

### Phase 6: 데이터 저장
- [ ] Vercel KV 클라이언트
- [ ] 분석 저장/조회/삭제
- [ ] 히스토리 페이지
- [ ] 어노테이션 저장 API

### Phase 7: 추가 분석 카테고리
- [ ] 닐슨 휴리스틱 분석 UI
- [ ] 게슈탈트 원칙 분석
- [ ] 색상 팔레트 분석
- [ ] 타이포그래피 분석
- [ ] 그리드/레이아웃 분석

### Phase 8: 마무리 및 배포
- [ ] 에러 처리 및 로딩 상태
- [ ] 반응형 디자인
- [ ] 성능 최적화
- [ ] Vercel 배포

---

## 11. 보안 고려사항

- 이미지 업로드 크기 제한 (10MB)
- API Rate Limiting
- 환경 변수 보안 관리
- XSS 방지 (사용자 입력 이스케이프)

---

## 12. 향후 확장 계획

- 다중 이미지 분석
- 분석 결과 비교 기능
- PDF 리포트 내보내기
- 팀 공유 기능
- 브라우저 확장 프로그램 (자동 스크린샷)
