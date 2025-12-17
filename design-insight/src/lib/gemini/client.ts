import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult, AnalysisOptions } from '@/types';
import { buildAnalysisPrompt } from './prompts';
import { parseAnalysisResponse } from './parser';

// Gemini API 클라이언트 초기화
function getGenAI(apiKey: string) {
  if (!apiKey) {
    throw new Error('API 키가 필요합니다.');
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function analyzeImage(
  base64Image: string,
  mimeType: string,
  apiKey: string,
  options: AnalysisOptions = {
    categories: ['user-flow', 'heuristics', 'gestalt', 'cognitive', 'accessibility', 'ia', 'layout', 'typography', 'color', 'motion'],
    depth: 'standard',
  }
): Promise<AnalysisResult> {
  const genAI = getGenAI(apiKey);

  // Gemini 2.5 Flash 모델 사용 (빠르고 비용 효율적)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  const prompt = buildAnalysisPrompt(options);

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();

    // 응답 파싱
    const analysisResult = parseAnalysisResponse(text);

    return analysisResult;
  } catch (error) {
    console.error('Gemini API 오류:', error);

    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('API 키가 유효하지 않습니다.');
      }
      if (error.message.includes('RATE_LIMIT')) {
        throw new Error('API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.');
      }
      if (error.message.includes('SAFETY')) {
        throw new Error('이미지가 안전 정책에 의해 차단되었습니다.');
      }
    }

    throw new Error('이미지 분석 중 오류가 발생했습니다.');
  }
}
