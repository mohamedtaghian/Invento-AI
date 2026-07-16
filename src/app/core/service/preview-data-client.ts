import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BuilderState } from '@/app/features/builder/services/builder-state';
import { ThemeSuggestion } from '@/app/core/interface/Preview';
import {
  MOCK_THEMES,
  MOCK_PREVIEW_TABS,
  MOCK_PREVIEW_PRODUCTS,
} from '@/app/shared/mock/mock-preview';
import { PreviewProduct } from '@/app/core/interface/Preview';
import { ThemeApiResponse } from '@/app/core/interface/Preview';
import { toThemeSuggestion } from '@/app/core/utils/theme-suggestion-converter';

@Injectable({ providedIn: 'root' })
export class PreviewDataClient {
  private readonly http = inject(HttpClient);
  private readonly builderState = inject(BuilderState);
  private readonly generateThemeUrl = '/generate-theme';

  private readonly _themeSuggestions = signal<ThemeSuggestion[]>(MOCK_THEMES);
  private readonly _products = signal<PreviewProduct[]>(MOCK_PREVIEW_PRODUCTS);
  private readonly _navTabs = signal<string[]>(MOCK_PREVIEW_TABS);

  private readonly _isLoading = signal<boolean>(false);
  private readonly _themeError = signal<string | null>(null);
  private readonly _loaded = signal(false);
  private readonly destroyRef = inject(DestroyRef);

  readonly themeSuggestions = this._themeSuggestions.asReadonly();
  readonly products = this._products.asReadonly();
  readonly navTabs = this._navTabs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly themeError = this._themeError.asReadonly();

  loadThemes(): void {
    if (this._loaded()) return;

    this._isLoading.set(true);
    this._themeError.set(null);

    const brainstorm = this.builderState.brainstorm();
    const aiAnswers = this.builderState.aiAnswers();
    const hasUserData = brainstorm.length >= 25 && Object.keys(aiAnswers).length > 0;
    const promptText = hasUserData
      ? [
          brainstorm,
          ...Object.entries(aiAnswers).map(
            ([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`,
          ),
        ].join('\n')
      : 'Create a modern portfolio website for a frontend developer with projects, skills, experience, and a contact form.';
    this.http
      .post<ThemeApiResponse>(this.generateThemeUrl, {
        text: promptText,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this._isLoading.set(false);

          if (!response || !response.rawCss) {
            this._themeSuggestions.set(MOCK_THEMES);
            this._themeError.set('Theme generation returned no data.');
            return;
          }

          const generatedTheme = toThemeSuggestion(response);
          const remainingMockThemes = MOCK_THEMES.slice(1);
          this._themeSuggestions.set([generatedTheme, ...remainingMockThemes]);
          this._loaded.set(true);
        },
        error: (err) => {
          this._isLoading.set(false);
          this._themeSuggestions.set(MOCK_THEMES);
          this._themeError.set(err?.message ?? 'Failed to load theme. Please try again.');
        },
      });
  }
}
