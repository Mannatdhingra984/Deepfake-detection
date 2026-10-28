export type VerdictType = 'AI_GENERATED' | 'AI_ALTERED' | 'REAL_PHOTOGRAPH';

export type AnomalyType =
  | 'BIOMETRIC'
  | 'TEXTURE'
  | 'LIGHTING'
  | 'FREQUENCY_NOISE'
  | 'BACKGROUND'
  | 'AUTHENTIC';

export interface SegmentRegion {
  id: string;
  label: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 scale
  anomalyType: AnomalyType;
  anomalyScore: number; // 0-100 (higher = more anomalous/AI-like)
  description: string;
  explanation12thGrade: string;
}

export interface ForensicCategory {
  key: string;
  name: string;
  score: number; // 0-100 anomaly level
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  detail: string;
  educationalConcept: string;
}

export interface ExifData {
  hasMetadata: boolean;
  cameraModel?: string;
  software?: string;
  dateTime?: string;
  colorSpace?: string;
  compression?: string;
  isSynthesizedSoftware?: boolean;
  resolution?: string;
  fileType?: string;
}

export interface EducationalNote {
  concept: string;
  technicalTerm: string;
  explanation: string;
}

export interface ForensicReport {
  id: string;
  fileName: string;
  fileSizeFormatted: string;
  dimensions: { width: number; height: number };
  timestamp: string;
  verdict: VerdictType;
  confidencePercentage: number;
  summary: string;
  analysisMode: 'ONLINE_GEMINI_AI' | 'OFFLINE_CANVAS_HEURISTIC';
  categories: ForensicCategory[];
  segments: SegmentRegion[];
  educationalNotes: EducationalNote[];
  exifData?: ExifData;
  imageDataUrl: string;
  elaCanvasDataUrl?: string;
}

export type AnalysisStatus = 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error';

export interface SampleImageOption {
  id: string;
  title: string;
  category: 'AI Generated' | 'AI Altered' | 'Real Photo';
  description: string;
  url: string;
}
