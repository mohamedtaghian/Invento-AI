import { Injectable, signal } from '@angular/core';
import { ThemeSuggestion } from '../../shared/interfaces/preview/themeSuggestion';

import {
  MOCK_THEMES,
  MOCK_PREVIEW_TABS,
  MOCK_PREVIEW_PRODUCTS,
} from '../../shared/mock/mock-preview';
import { PreviewProduct } from '../../shared/interfaces/preview/PreviewProduct';

@Injectable({ providedIn: 'root' })
export class PreviewDataClient {
  private readonly _themeSuggestions = signal<ThemeSuggestion[]>(MOCK_THEMES);
  private readonly _products = signal<PreviewProduct[]>(MOCK_PREVIEW_PRODUCTS);
  private readonly _navTabs = signal<string[]>(MOCK_PREVIEW_TABS);
  private readonly _isLoading = signal<boolean>(false);

  readonly themeSuggestions = this._themeSuggestions.asReadonly();
  readonly products = this._products.asReadonly();
  readonly navTabs = this._navTabs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  loadThemes(): void {
    // inject(HttpClient).get<ThemeSuggestion[]>('/api/themes').subscribe(themes => this._themeSuggestions.set(themes));
    this._themeSuggestions.set(MOCK_THEMES);
  }
  loadProducts(): void {
    // inject(HttpClient).get<PreviewProduct[]>('/api/products').subscribe(products => this._products.set(products));
    this._products.set(MOCK_PREVIEW_PRODUCTS);
  }
}
