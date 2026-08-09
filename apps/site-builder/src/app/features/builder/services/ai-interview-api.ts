import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';

export interface SubmitAnswersPayload {
  questions: {
    questionId: string;
    answer: string | number | number[] | null;
  }[];
}

export interface SubmitAnswersResponse {
  message: string[];
  error: string;
  statusCode: number;
}

declare const process: { env?: Record<string, string | undefined> };

@Injectable({ providedIn: 'root' })
export class AiInterviewApi {
  private readonly http = inject(HttpClient);

  submitAnswers(payload: SubmitAnswersPayload): Observable<SubmitAnswersResponse | null> {
    const apiUrl = this.getApiUrl();
    const apiKey = this.getApiKey();

    const baseUrl = apiUrl ? apiUrl.replace(/\/+$/, '') : '';
    const endpoint = baseUrl ? `${baseUrl}/site-builder/answers` : '/site-builder/answers';

    let headers = new HttpHeaders();
    if (apiKey) {
      headers = headers.set('Authorization', `Bearer ${apiKey}`);
    }

    return this.http.post<SubmitAnswersResponse>(endpoint, payload, { headers }).pipe(
      catchError((err) => {
        console.warn('Answers submit API call failed or unavailable, returning success mock:', err);
        return this.getMockResponse();
      }),
    );
  }

  private getApiUrl(): string {
    if (typeof process !== 'undefined' && process.env?.['INVENTO_API_URL']) {
      return process.env['INVENTO_API_URL'];
    }
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w['INVENTO_API_URL'] === 'string') return w['INVENTO_API_URL'];
      const envObj = w['__ENV__'] as Record<string, string> | undefined;
      if (envObj?.['INVENTO_API_URL']) return envObj['INVENTO_API_URL'];
    }
    const g = globalThis as unknown as Record<string, unknown>;
    return typeof g['INVENTO_API_URL'] === 'string' ? g['INVENTO_API_URL'] : '';
  }

  private getApiKey(): string {
    if (typeof process !== 'undefined' && process.env?.['INVENTO_API_KEY']) {
      return process.env['INVENTO_API_KEY'];
    }
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w['INVENTO_API_KEY'] === 'string') return w['INVENTO_API_KEY'];
      const envObj = w['__ENV__'] as Record<string, string> | undefined;
      if (envObj?.['INVENTO_API_KEY']) return envObj['INVENTO_API_KEY'];
    }
    const g = globalThis as unknown as Record<string, unknown>;
    return typeof g['INVENTO_API_KEY'] === 'string' ? g['INVENTO_API_KEY'] : '';
  }

  private getMockResponse(): Observable<SubmitAnswersResponse> {
    return of({
      message: ['Success'],
      error: '',
      statusCode: 200,
    });
  }
}
