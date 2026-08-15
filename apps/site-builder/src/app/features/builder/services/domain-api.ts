import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiConfig } from '@/app/core/config/api-config';
import { fallbackOnServerError } from '@/app/core/http/api-fallback';

export interface ConfirmDomainPayload {
  businessName: string;
  domain: string;
}

export interface ConfirmDomainResponse {
  success?: boolean;
  isFallback?: boolean;
  slug?: string;
  storeUrl?: string;
  hint?: string | null;
}

export interface ConfirmDomainErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Injectable({ providedIn: 'root' })
export class DomainApi {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);

  confirmDomain(payload: ConfirmDomainPayload): Observable<ConfirmDomainResponse> {
    return this.http
      .post<ConfirmDomainResponse>(this.config.url('/site-builder/domain'), payload)
      .pipe(fallbackOnServerError(() => of({ success: true, isFallback: true }), 'DomainApi'));
  }
}
