import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HeroSectionResponse {
  imageUrl: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string | null;
}

export interface StoreFeaturedCategory {
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
}

export interface StoreResponse {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  logoSource: string;
  locale: string;
  currency: string;
  hero: {
    imageUrl: string;
    headline: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string | null;
  };
  theme?: unknown;
  featuredCategories: StoreFeaturedCategory[];
}

export interface StoreNotFoundResponse {
  message: string;
  error: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly tokenHeader = {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNTQ5MDFlYi02MTYwLTRlYzAtYTY1Mi1iNGJhZTc1ZTg3NmUiLCJlbWFpbCI6Im93bmVyLmxheWFsaUBpbnZlbnRvYWkudGVzdCIsInJvbGUiOiJPV05FUiIsInN0b3JlSWQiOm51bGwsImlhdCI6MTc4NjIwMTUxOCwiZXhwIjoxNzg2MjQ0NzE4fQ.gi2NMmGZutsDzV3Rw8uXNkr9C0mW-5R_K8FeUgXSqZk',
    },
  };
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl =
    (typeof window !== 'undefined' &&
      (window as unknown as { __ENV__?: { API_BASE_URL?: string } }).__ENV__?.API_BASE_URL) ||
    'http://localhost:3000';

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token =
        localStorage.getItem('auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('access_token') ||
        '';
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  /**
   * Public endpoint to fetch store details by slug.
   * GET /site/{slug} — No Auth header.
   */
  getStore(slug: string): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.apiBaseUrl}/site/${encodeURIComponent(slug)}`);
  }

  getHero(): Observable<HeroSectionResponse> {
    return this.http.get<HeroSectionResponse>(
      `${this.apiBaseUrl}/stores/me/hero`,
      this.tokenHeader,
    );
  }

  updateHero(formData: FormData): Observable<HeroSectionResponse> {
    return this.http.patch<HeroSectionResponse>(
      `${this.apiBaseUrl}/stores/me/hero`,
      formData,
      this.tokenHeader,
    );
  }
}
