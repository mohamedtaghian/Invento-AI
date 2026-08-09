import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiConfig } from '@/app/core/config/api-config';
import { fallbackOnServerError } from '@/app/core/http/api-fallback';

/**
 * The API validates this body strictly (`forbidNonWhitelisted`) and rejects any
 * extra property, so it must carry themeId and nothing else. Domain and
 * business name are already persisted server-side by /site-builder/domain.
 */
export interface PublishPayload {
  themeId: string;
}

export interface PublishResponse {
  message?: string;
  success?: boolean;
  publishedUrl?: string;
  isFallback?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PublishApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);

  publishSite(payload: PublishPayload): Observable<PublishResponse> {
    return this.http
      .post<PublishResponse>(this.config.url('/site-builder/publish'), payload)
      .pipe(fallbackOnServerError(() => of({ success: true, isFallback: true }), 'PublishApi'));
  }
}
