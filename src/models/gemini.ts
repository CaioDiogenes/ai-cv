export interface GeminiPart { text?: string; }
export interface GeminiContent { role: 'user' | 'model'; parts: GeminiPart[]; }

export interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType: any;
  };
}

export interface GeminiCandidate {
  content?: GeminiContent;
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export interface CvDecision {
  apto: boolean;
  justificativa: string;
}
