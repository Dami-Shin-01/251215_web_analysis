import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';
import { generateAnalysisId } from '@/lib/utils';
import { AnalysisRecord, AnalysisOptions } from '@/types';

// 이미지 MIME 타입 검증
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

// 최대 이미지 크기 (Base64 기준, 약 10MB)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 * 1.37; // Base64 인코딩 오버헤드 고려

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, mimeType, fileName, apiKey } = body;

    // API 키 검증
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 필요합니다. 설정에서 Google API 키를 입력해주세요.' },
        { status: 401 }
      );
    }

    // 입력 검증
    if (!image || !mimeType) {
      return NextResponse.json(
        { error: '이미지와 MIME 타입이 필요합니다.' },
        { status: 400 }
      );
    }

    // MIME 타입 검증
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: '지원하지 않는 이미지 형식입니다. (PNG, JPG, WebP만 가능)' },
        { status: 400 }
      );
    }

    // 이미지 크기 검증
    if (image.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: '이미지 크기가 너무 큽니다. (최대 10MB)' },
        { status: 400 }
      );
    }

    // 분석 옵션 (기본값)
    const options: AnalysisOptions = {
      categories: [
        'user-flow',
        'heuristics',
        'gestalt',
        'cognitive',
        'accessibility',
        'ia',
        'layout',
        'typography',
        'color',
        'motion',
      ],
      depth: 'standard',
    };

    // Gemini API로 분석 실행
    const analysisResult = await analyzeImage(image, mimeType, apiKey, options);

    // 분석 ID 생성
    const analysisId = generateAnalysisId();

    // Base64 이미지에서 메타데이터 추출 (대략적인 값)
    const imageBuffer = Buffer.from(image, 'base64');
    const imageMeta = {
      width: 0, // 실제 구현에서는 이미지 파싱 필요
      height: 0,
      format: mimeType.split('/')[1],
      size: imageBuffer.length,
    };

    // 분석 레코드 생성
    const analysisRecord: AnalysisRecord = {
      id: analysisId,
      imageData: image,
      imageMeta,
      result: analysisResult,
      options,
      annotations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Vercel KV에 저장 (Phase 6에서 구현)
    // await saveAnalysis(analysisId, analysisRecord);

    // 임시로 결과만 반환 (KV 연동 전)
    return NextResponse.json({
      id: analysisId,
      result: analysisResult,
      imageData: image,
      imageMeta,
      createdAt: analysisRecord.createdAt,
    });
  } catch (error) {
    console.error('Analysis API error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
