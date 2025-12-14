'use client';

import { AnalysisResult, AnalysisCategory } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

interface AnalysisPanelProps {
  analysis: AnalysisResult;
  activeCategory: AnalysisCategory;
  onCategoryChange: (category: AnalysisCategory) => void;
  onRegionClick?: (regionId: string) => void;
}

const CATEGORY_LABELS: Record<AnalysisCategory, string> = {
  'user-flow': '사용자 플로우',
  'heuristics': '휴리스틱',
  'gestalt': '게슈탈트',
  'cognitive': '인지 부하',
  'accessibility': '접근성',
  'ia': '정보구조',
  'layout': '레이아웃',
  'typography': '타이포그래피',
  'color': '색상',
  'motion': '모션',
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? 'success' : score >= 60 ? 'secondary' : 'destructive';
  return (
    <Badge variant={variant as 'default' | 'secondary' | 'outline' | 'destructive' | 'success'}>
      {score}점
    </Badge>
  );
}

export function AnalysisPanel({
  analysis,
  activeCategory,
  onCategoryChange,
  onRegionClick,
}: AnalysisPanelProps) {
  return (
    <div className="space-y-6">
      {/* 전체 요약 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>분석 요약</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">전체 점수</span>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* 카테고리별 분석 */}
      <Tabs defaultValue={activeCategory} onValueChange={(v) => onCategoryChange(v as AnalysisCategory)}>
        <TabsList className="w-full flex-wrap h-auto gap-1 p-2">
          {(Object.keys(CATEGORY_LABELS) as AnalysisCategory[]).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-xs px-2 py-1">
              {CATEGORY_LABELS[cat]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 사용자 플로우 */}
        <TabsContent value="user-flow">
          <UserFlowContent analysis={analysis} onRegionClick={onRegionClick} />
        </TabsContent>

        {/* 휴리스틱 */}
        <TabsContent value="heuristics">
          <HeuristicsContent analysis={analysis} onRegionClick={onRegionClick} />
        </TabsContent>

        {/* 게슈탈트 */}
        <TabsContent value="gestalt">
          <GestaltContent analysis={analysis} />
        </TabsContent>

        {/* 인지 부하 */}
        <TabsContent value="cognitive">
          <CognitiveContent analysis={analysis} />
        </TabsContent>

        {/* 접근성 */}
        <TabsContent value="accessibility">
          <AccessibilityContent analysis={analysis} />
        </TabsContent>

        {/* 정보구조 */}
        <TabsContent value="ia">
          <IAContent analysis={analysis} />
        </TabsContent>

        {/* 레이아웃 */}
        <TabsContent value="layout">
          <LayoutContent analysis={analysis} />
        </TabsContent>

        {/* 타이포그래피 */}
        <TabsContent value="typography">
          <TypographyContent analysis={analysis} />
        </TabsContent>

        {/* 색상 */}
        <TabsContent value="color">
          <ColorContent analysis={analysis} />
        </TabsContent>

        {/* 모션 */}
        <TabsContent value="motion">
          <MotionContent analysis={analysis} />
        </TabsContent>
      </Tabs>

      {/* 개선 제안 */}
      {analysis.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>개선 제안</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.improvements.map((imp) => (
                <div
                  key={imp.id}
                  className="p-3 rounded-lg border bg-background"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        imp.priority === 'high'
                          ? 'destructive'
                          : imp.priority === 'medium'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {imp.priority === 'high' ? '높음' : imp.priority === 'medium' ? '중간' : '낮음'}
                    </Badge>
                    <span className="text-xs text-muted">{CATEGORY_LABELS[imp.category]}</span>
                  </div>
                  <h4 className="font-medium text-sm">{imp.title}</h4>
                  <p className="text-xs text-muted mt-1">{imp.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 사용자 플로우 콘텐츠
function UserFlowContent({ analysis, onRegionClick }: { analysis: AnalysisResult; onRegionClick?: (id: string) => void }) {
  const { userFlow } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>사용자 플로우 분석</CardTitle>
          <ScoreBadge score={userFlow.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 플로우 단계 */}
        {userFlow.flowSteps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">플로우 단계</h4>
            <div className="space-y-2">
              {userFlow.flowSteps
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <div
                    key={step.id}
                    className="p-2 rounded border bg-background hover:bg-accent cursor-pointer"
                    onClick={() => onRegionClick?.(step.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                        {step.order}
                      </span>
                      <span className="text-sm font-medium">{step.label}</span>
                    </div>
                    <p className="text-xs text-muted mt-1">{step.description}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 발견사항 */}
        {userFlow.findings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">발견사항</h4>
            <div className="space-y-1">
              {userFlow.findings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className={`text-xs ${finding.type === 'positive' ? 'text-green-500' : finding.type === 'negative' ? 'text-red-500' : 'text-muted'}`}>
                    {finding.type === 'positive' ? '+' : finding.type === 'negative' ? '-' : '•'}
                  </span>
                  <p className="text-xs text-foreground">{finding.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 권장사항 */}
        {userFlow.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">권장사항</h4>
            <ul className="space-y-1">
              {userFlow.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-muted flex items-start gap-2">
                  <span className="text-primary">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 휴리스틱 콘텐츠
function HeuristicsContent({ analysis, onRegionClick }: { analysis: AnalysisResult; onRegionClick?: (id: string) => void }) {
  const { heuristics } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>닐슨 휴리스틱 평가</CardTitle>
          <ScoreBadge score={heuristics.score} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {heuristics.heuristics.map((h, index) => (
            <div key={h.id} className="p-3 rounded border bg-background">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded font-mono">
                  {index + 1}
                </span>
                <span className="text-sm font-medium flex-1">{h.name}</span>
                <span className={`text-sm font-bold ${getScoreColor(h.score)}`}>
                  {h.score}
                </span>
              </div>
              {/* 진행 바 */}
              <div className="w-full h-1.5 bg-muted rounded-full mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    h.score >= 80 ? 'bg-green-500' : h.score >= 60 ? 'bg-yellow-500' : h.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${h.score}%` }}
                />
              </div>
              {h.findings.length > 0 && (
                <div className="space-y-1 mt-2">
                  {h.findings.map((f, idx) => (
                    <p
                      key={idx}
                      className={`text-xs ${f.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {f.type === 'positive' ? '✓' : '✗'} {f.description}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 게슈탈트 콘텐츠
function GestaltContent({ analysis }: { analysis: AnalysisResult }) {
  const { gestalt } = analysis.categories;
  const principleNames: Record<string, string> = {
    proximity: '근접성',
    similarity: '유사성',
    continuity: '연속성',
    closure: '폐쇄성',
    'figure-ground': '전경-배경',
    'common-region': '공통 영역',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>게슈탈트 원칙</CardTitle>
          <ScoreBadge score={gestalt.score} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {gestalt.principles.map((p) => (
            <div key={p.name} className="p-3 rounded border bg-background">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{principleNames[p.name] || p.name}</span>
                <span className={`text-xs font-bold ${getScoreColor(p.score)}`}>
                  {p.score}
                </span>
              </div>
              {p.findings.length > 0 && (
                <p className="text-xs text-muted">{p.findings[0]?.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 인지 부하 콘텐츠
function CognitiveContent({ analysis }: { analysis: AnalysisResult }) {
  const { cognitive } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>인지 부하 분석</CardTitle>
          <ScoreBadge score={cognitive.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">인지 부하 수준</h4>
          <Badge variant={cognitive.cognitiveLoad.level === 'low' ? 'success' : cognitive.cognitiveLoad.level === 'medium' ? 'secondary' : 'destructive'}>
            {cognitive.cognitiveLoad.level === 'low' ? '낮음' : cognitive.cognitiveLoad.level === 'medium' ? '중간' : '높음'}
          </Badge>
          <p className="text-xs text-muted mt-2">{cognitive.cognitiveLoad.analysis}</p>
        </div>

        {cognitive.fittsLaw.findings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">피츠의 법칙</h4>
            {cognitive.fittsLaw.findings.map((f, idx) => (
              <div key={idx} className="text-xs text-muted">
                <strong>{f.element}:</strong> {f.analysis}
              </div>
            ))}
          </div>
        )}

        {cognitive.hicksLaw.findings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">힉의 법칙</h4>
            {cognitive.hicksLaw.findings.map((f, idx) => (
              <div key={idx} className="text-xs text-muted">
                <strong>{f.element}:</strong> {f.optionCount}개 옵션 - {f.analysis}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 접근성 콘텐츠
function AccessibilityContent({ analysis }: { analysis: AnalysisResult }) {
  const { accessibility } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>접근성 (WCAG)</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{accessibility.wcagLevel}</Badge>
            <ScoreBadge score={accessibility.score} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {accessibility.issues.length > 0 ? (
          <div>
            <h4 className="text-sm font-medium mb-2">발견된 문제</h4>
            {accessibility.issues.map((issue, idx) => (
              <div key={idx} className="p-2 rounded border bg-background mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{issue.criterion}</Badge>
                  <Badge variant="secondary" className="text-xs">{issue.level}</Badge>
                </div>
                <p className="text-xs text-foreground">{issue.description}</p>
                <p className="text-xs text-muted mt-1">→ {issue.suggestion}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">발견된 접근성 문제가 없습니다.</p>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">색상 대비</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">점수:</span>
            <span className={`text-sm font-bold ${getScoreColor(accessibility.colorContrast.score)}`}>
              {accessibility.colorContrast.score}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 정보구조 콘텐츠
function IAContent({ analysis }: { analysis: AnalysisResult }) {
  const { informationArchitecture: ia } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>정보 구조</CardTitle>
          <ScoreBadge score={ia.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">구조</h4>
            <p className="text-xs text-muted">깊이: {ia.structure.depth}</p>
            <p className="text-xs text-muted">
              폭: {ia.structure.breadth === 'narrow' ? '좁음' : ia.structure.breadth === 'wide' ? '넓음' : '균형'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">네비게이션</h4>
            <p className="text-xs text-muted">유형: {ia.navigation.type}</p>
            <p className="text-xs text-muted">명확성: {ia.navigation.clarity}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">콘텐츠 그룹핑</h4>
          <p className="text-xs text-muted">{ia.contentGrouping.analysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// 레이아웃 콘텐츠
function LayoutContent({ analysis }: { analysis: AnalysisResult }) {
  const { layout } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>레이아웃 분석</CardTitle>
          <ScoreBadge score={layout.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">그리드 시스템</h4>
          <p className="text-xs text-muted">
            {layout.gridSystem.detected ? `감지됨 (${layout.gridSystem.columns}컬럼)` : '감지되지 않음'}
          </p>
          <p className="text-xs text-muted">{layout.gridSystem.analysis}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">정렬</h4>
          <span className={`text-xs font-bold ${getScoreColor(layout.alignment.score)}`}>
            {layout.alignment.score}점
          </span>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">시각적 계층</h4>
          <p className="text-xs text-muted">{layout.visualHierarchy.analysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// 타이포그래피 콘텐츠
function TypographyContent({ analysis }: { analysis: AnalysisResult }) {
  const { typography } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>타이포그래피</CardTitle>
          <ScoreBadge score={typography.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {typography.detectedFonts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">감지된 폰트</h4>
            {typography.detectedFonts.map((font, idx) => (
              <div key={idx} className="text-xs text-muted">
                <strong>{font.name}</strong> ({font.usage}) - {font.analysis}
              </div>
            ))}
          </div>
        )}
        <div>
          <h4 className="text-sm font-medium mb-2">계층 구조</h4>
          <p className="text-xs text-muted">{typography.hierarchy.levels}단계, 일관성: {typography.hierarchy.consistency}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">가독성</h4>
          <span className={`text-xs font-bold ${getScoreColor(typography.readability.score)}`}>
            {typography.readability.score}점
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// 색상 콘텐츠
function ColorContent({ analysis }: { analysis: AnalysisResult }) {
  const { color } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>색상 분석</CardTitle>
          <ScoreBadge score={color.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {color.palette.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">색상 팔레트</h4>
            <div className="grid grid-cols-4 gap-2">
              {color.palette.map((c, idx) => (
                <div key={idx} className="text-center">
                  <div
                    className="w-full h-12 rounded-lg border shadow-sm mb-1"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs font-mono text-muted">{c.hex}</span>
                  {c.usage && (
                    <p className="text-xs text-muted mt-0.5">{c.usage}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 색상 조합 미리보기 */}
        {color.palette.length >= 2 && (
          <div>
            <h4 className="text-sm font-medium mb-2">조합 미리보기</h4>
            <div className="flex gap-2">
              <div
                className="flex-1 p-3 rounded-lg text-center text-sm font-medium"
                style={{
                  backgroundColor: color.palette[0]?.hex || '#fff',
                  color: color.palette[1]?.hex || '#000',
                }}
              >
                텍스트 미리보기
              </div>
              <div
                className="flex-1 p-3 rounded-lg text-center text-sm font-medium"
                style={{
                  backgroundColor: color.palette[1]?.hex || '#000',
                  color: color.palette[0]?.hex || '#fff',
                }}
              >
                반전 미리보기
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-2">색상 조화</h4>
          <Badge variant="outline" className="mb-2">{color.harmony.type}</Badge>
          <p className="text-xs text-muted">{color.harmony.analysis}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">감정적 효과</h4>
          <p className="text-xs text-muted">{color.emotionalImpact}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// 모션 콘텐츠
function MotionContent({ analysis }: { analysis: AnalysisResult }) {
  const { motion } = analysis.categories;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>모션/애니메이션</CardTitle>
          <ScoreBadge score={motion.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted">{motion.analysis}</p>
        {motion.potentialAnimations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">제안 애니메이션</h4>
            {motion.potentialAnimations.map((anim, idx) => (
              <div key={idx} className="p-2 rounded border bg-background mb-2">
                <p className="text-xs font-medium">{anim.element}</p>
                <p className="text-xs text-muted">{anim.suggestedMotion} - {anim.purpose}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
