import { nanoid } from 'nanoid';

export function generateAnalysisId(): string {
  return nanoid(12);
}

export function generateAnnotationId(): string {
  return nanoid(8);
}
