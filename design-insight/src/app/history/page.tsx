'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';

interface HistoryItem {
  id: string;
  result: {
    summary: string;
    score: number;
  };
  imageMeta: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
  createdAt: string;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 세션 스토리지에서 히스토리 불러오기 (임시, KV 연동 전)
    const loadHistory = () => {
      const items: HistoryItem[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('analysis_')) {
          try {
            const data = JSON.parse(sessionStorage.getItem(key) || '');
            items.push({
              id: data.id,
              result: {
                summary: data.result?.summary || '요약 없음',
                score: data.result?.score || 0,
              },
              imageMeta: data.imageMeta || { width: 0, height: 0, format: 'unknown', size: 0 },
              createdAt: data.createdAt || new Date().toISOString(),
            });
          } catch (e) {
            console.error('Failed to parse history item:', e);
          }
        }
      }
      // 최신순 정렬
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistoryItems(items);
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    sessionStorage.removeItem(`analysis_${id}`);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('analysis_')) {
        keys.push(key);
      }
    }
    keys.forEach((key) => sessionStorage.removeItem(key));
    setHistoryItems([]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20">
          <p className="text-muted">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">분석 히스토리</h1>
          <p className="text-muted text-sm mt-1">
            이전에 분석한 스크린샷 목록입니다. (세션 기반, 브라우저 종료 시 삭제됨)
          </p>
        </div>
        {historyItems.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            전체 삭제
          </Button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-muted mb-4">분석 히스토리가 없습니다.</p>
            <Link href="/">
              <Button>새로 분석하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <Card key={item.id} className="hover:bg-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-lg font-bold ${getScoreColor(item.result.score)}`}>
                        {item.result.score}점
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.imageMeta.format.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted">
                        {item.imageMeta.width} x {item.imageMeta.height}px
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2 mb-2">
                      {item.result.summary}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(item.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/analyze/${item.id}`}>
                      <Button size="sm">보기</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
