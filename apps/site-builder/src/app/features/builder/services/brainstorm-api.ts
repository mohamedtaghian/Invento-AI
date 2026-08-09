import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiConfig } from '@/app/core/config/api-config';
import { fallbackOnServerError } from '@/app/core/http/api-fallback';
import { analyzePromptLocally } from '@/app/features/builder/utils/brainstorm-fallback';

export interface BrainstormResponse {
  questions: {
    questionId: string;
    answer: string | number | number[] | null;
  }[];
  isFallback?: boolean;
}

@Injectable({ providedIn: 'root' })
export class BrainstormApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);

  analyzePrompt(prompt: string, logo?: File): Observable<BrainstormResponse> {
    const formData = new FormData();
    formData.append('brainstorm', prompt);
    if (logo) formData.append('logo', logo);

    return this.http
      .post<BrainstormResponse>(this.config.url('/site-builder/brainstorm'), formData)
      .pipe(
        fallbackOnServerError(() => of(analyzePromptLocally(prompt)), 'BrainstormApi'),
      );
  }
}
