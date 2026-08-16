import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { extractErrorMessage } from '../../../core/utils/error.utils';
import type { FaqItem } from '../types/faq';

/**
 * Service that manages fetching FAQ entries for a store from the backend endpoint:
 * GET /site/{slug}/faqs
 */
@Injectable({ providedIn: 'root' })
export class FaqDataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly _faqs = signal<FaqItem[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly faqs = this._faqs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalQuestions = computed(() => this._faqs().length);

  /**
   * Fetch FAQs for the given store slug as an Observable.
   */
  getFaqs(slug: string): Observable<FaqItem[]> {
    const storeSlug = slug || environment.storeSlug;
    return this.http.get<FaqItem[]>(`${this.apiUrl}/site/${storeSlug}/faqs`);
  }

  /**
   * Load FAQ data for the store into reactive signals.
   */
  loadFaqs(slug?: string): void {
    const storeSlug = slug || environment.storeSlug;

    this._isLoading.set(true);
    this._error.set(null);

    this.getFaqs(storeSlug)
      .pipe(
        tap((data) => {
          this._faqs.set(Array.isArray(data) ? data : []);
          this._isLoading.set(false);
        }),
        catchError((err) => {
          const errorMessage = extractErrorMessage(
            err,
            'Failed to load FAQ items. Please try again later.',
          );
          this._error.set(errorMessage);
          this._faqs.set([]);
          this._isLoading.set(false);
          return throwError(() => err);
        }),
      )
      .subscribe({
        error: () => {
          // Handled in catchError
        },
      });
  }
}
