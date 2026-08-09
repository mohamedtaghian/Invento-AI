import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiConfig } from '@/app/core/config/api-config';
import { fallbackOnServerError } from '@/app/core/http/api-fallback';

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
  isFallback?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AiInterviewApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);

  submitAnswers(payload: SubmitAnswersPayload): Observable<SubmitAnswersResponse> {
    return this.http
      .post<SubmitAnswersResponse>(this.config.url('/site-builder/answers'), payload)
      .pipe(
        fallbackOnServerError(
          () => of({ message: ['Success'], error: '', statusCode: 200, isFallback: true }),
          'AiInterviewApi',
        ),
      );
  }
}
