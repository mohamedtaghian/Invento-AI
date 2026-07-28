import { Injectable, signal } from '@angular/core';
import { FAQ_CATEGORIES } from '../mock/faq-data';
import type { FaqCategory } from '../types/faq';

/**
 * Service that provides FAQ data for the current userSite.
 *
 * Each userSite deployment will have its own FAQ data.
 * Currently loads from local mock data — swap the data source
 * (e.g. HttpClient call) when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class FaqDataService {
  private readonly _categories = signal<FaqCategory[]>(FAQ_CATEGORIES);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly categories = this._categories.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalQuestions = () => {
    // Wrap in a computed-like getter backed by the signal
    return this._categories().reduce((sum, cat) => sum + cat.items.length, 0);
  };

  /**
   * Load FAQ categories for the current site.
   * Replace the body with an HTTP call when the backend is ready:
   *
   * ```ts
   * loadFaqs(siteId: string): void {
   *   this._isLoading.set(true);
   *   this.http.get<FaqCategory[]>(`/api/sites/${siteId}/faqs`)
   *     .pipe(takeUntilDestroyed(this.destroyRef))
   *     .subscribe({
   *       next: (data) => { this._categories.set(data); this._isLoading.set(false); },
   *       error: (err) => { this._error.set(err.message); this._isLoading.set(false); },
   *     });
   * }
   * ```
   */
  loadFaqs(): void {
    this._isLoading.set(true);
    this._error.set(null);

    // Simulate async load — replace with real HTTP call per site
    this._categories.set(FAQ_CATEGORIES);
    this._isLoading.set(false);
  }
}
