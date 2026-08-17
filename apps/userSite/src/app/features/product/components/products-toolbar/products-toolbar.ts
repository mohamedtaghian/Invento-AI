import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  OnDestroy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  SortOption,
  ProductSuggestion,
} from '@invento/user-site/app/features/product/types/product';
import { HlmBadge } from '@spartan/helm/badge';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { ProductApiService } from '@invento/user-site/app/features/product/service/product-api.service';
import { Router } from '@angular/router';
import { environment } from '@invento/user-site/environments/environment';

@Component({
  selector: 'app-products-toolbar',
  templateUrl: './products-toolbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadge, CurrencyPipe],
})
export class ProductsToolbar implements OnInit, OnDestroy {
  public readonly title = input<string>('Products');
  public readonly count = input<number>(0);
  public readonly sort = input<SortOption>('recommended');

  public readonly sortChange = output<SortOption>();
  public readonly searchSubmit = output<string>(); // Emits on Enter

  private readonly apiService = inject(ProductApiService);
  private readonly router = inject(Router);

  private readonly searchInput$ = new Subject<string>();
  private sub?: Subscription;

  // State for suggestions
  public readonly suggestions = signal<ProductSuggestion[]>([]);
  public readonly showSuggestions = signal<boolean>(false);
  public readonly isLoadingSuggestions = signal<boolean>(false);

  ngOnInit(): void {
    this.sub = this.searchInput$
      .pipe(
        tap((term) => {
          if (term.length < 2) {
            this.suggestions.set([]);
            this.showSuggestions.set(false);
            this.isLoadingSuggestions.set(false);
          }
        }),
        filter((term) => term.length >= 2),
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => this.isLoadingSuggestions.set(true)),
        switchMap((term) => this.apiService.getProductSuggestions(environment.storeSlug, term)),
      )
      .subscribe({
        next: (results) => {
          this.suggestions.set(results);
          this.showSuggestions.set(true);
          this.isLoadingSuggestions.set(false);
        },
        error: () => {
          this.suggestions.set([]);
          this.showSuggestions.set(false);
          this.isLoadingSuggestions.set(false);
        },
      });
  }

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortChange.emit(value);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value.trim());
  }

  protected onSearchEnter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.showSuggestions.set(false);
    this.searchSubmit.emit(value);
  }

  protected onSuggestionClick(suggestion: ProductSuggestion): void {
    this.showSuggestions.set(false);
    this.router.navigate(['/', environment.storeSlug, 'product-details', suggestion.slug]);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
