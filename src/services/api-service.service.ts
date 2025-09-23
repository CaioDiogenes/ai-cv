import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../env/env';
import { GeminiContent, GeminiRequest, GeminiResponse, CvDecision } from '../models/gemini';
import { buildRecruiterPrompt, SegmentoRecrutamento } from '../helpers/gemini-prompts';
import { Candidate } from '../models/candidate';

@Injectable({ providedIn: 'root' })
export class ApiServiceService {
  private readonly model = environment.gemini.model;
  private readonly baseUrl = environment.gemini.baseUrl;
  private readonly apiKey = environment.gemini.apiKey;

  constructor(private http: HttpClient) { }

  private stripCodeFences(s: string): string {
    return s
      .replace(/^\s*```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();
  }

  private extractJsonObjectString(s: string): string | null {
    if (/```/m.test(s)) {
      const m = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (m?.[1]) return m[1].trim();
    }

    const first = s.indexOf('{');
    const last = s.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      return s.slice(first, last + 1).trim();
    }

    return null;
  }

  private toCvDecision(text: string): CvDecision {
    const candidate = this.extractJsonObjectString(text) ?? this.stripCodeFences(text);

    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed?.apto === 'boolean' && typeof parsed?.justificativa === 'string') {
        return parsed as CvDecision;
      }
      return {
        apto: false,
        justificativa: `Resposta fora do formato esperado: ${candidate}`,
      };
    } catch {
      return {
        apto: false,
        justificativa: `Não foi possível interpretar a resposta como JSON: ${candidate}`,
      };
    }
  }

  private endpointUrl(): string {
    return `${this.baseUrl}/models/${this.model}:generateContent`;
  }

  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey || '',
    });
  }

  private makeRequestBody(contents: GeminiContent[]): GeminiRequest {
    return {
      contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512,
        responseMimeType: 'application/json' as any,
      },
    };
  }

  private extractText(resp: GeminiResponse): string {
    const parts = resp?.candidates?.[0]?.content?.parts ?? [];
    return parts.map((p: any) => p.text ?? '').join('\n').trim();
  }

  async analyzeCandidate(candidate: Candidate): Promise<CvDecision> {
    const contents = buildRecruiterPrompt(candidate);

    const body = this.makeRequestBody(contents);
    const headers = this.buildHeaders();

    const resp = await firstValueFrom(
      this.http.post<GeminiResponse>(this.endpointUrl(), body, { headers })
    );

    const text = this.extractText(resp);
    return this.toCvDecision(text);
  }
}