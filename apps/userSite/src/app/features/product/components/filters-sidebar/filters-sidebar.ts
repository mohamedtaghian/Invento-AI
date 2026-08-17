import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HlmButton } from '@spartan/helm/button';
import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle } from '@spartan/helm/card';
import { FilterResponse } from '@invento/user-site/app/features/product/types/product';
import { ActivatedRoute } from '@angular/router';
import { parseAttributes } from '@invento/user-site/app/features/product/utils/filter-parser';
import { HlmTypographyImports } from '@spartan/helm/typography';

@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filters-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardHeader,
    HlmCardTitle,
    HlmTypographyImports,
  ],
})
export class FiltersSidebar {
  public readonly filters = input<FilterResponse | null>(null);

  public readonly categoryChange = output<string>();
  public readonly priceChange = output<{ min?: number; max?: number }>();
  public readonly inStockChange = output<boolean>();
  public readonly attributeChange = output<{ key: string; values: string[] }>();
  public readonly clearAll = output<void>();

  private readonly route = inject(ActivatedRoute);

  // Helper getters to check current active states from URL
  get activeCategory(): string | null {
    return this.route.snapshot.queryParams['category'] || null;
  }

  get currentMinPrice(): number {
    const val = this.route.snapshot.queryParams['minPrice'];
    return val ? Number(val) : this.filters()?.price?.min || 0;
  }

  get currentMaxPrice(): number {
    const val = this.route.snapshot.queryParams['maxPrice'];
    return val ? Number(val) : this.filters()?.price?.max || 5000; // 5000 is fallback
  }

  get isInStockOnly(): boolean {
    return this.route.snapshot.queryParams['inStock'] === 'true';
  }

  isAttributeSelected(key: string, value: string): boolean {
    const attrs = parseAttributes(this.route.snapshot.queryParams['attributes']);
    return attrs[key]?.includes(value) || false;
  }

  protected onCategoryClick(slug: string): void {
    // Toggle logic: if already selected, deselect
    if (this.activeCategory === slug) {
      this.categoryChange.emit('');
    } else {
      this.categoryChange.emit(slug);
    }
  }

  protected onPriceInput(event: Event): void {
    const maxVal = Number((event.target as HTMLInputElement).value);
    this.priceChange.emit({ max: maxVal });
  }

  protected onAttributeToggle(key: string, value: string): void {
    const attrs = parseAttributes(this.route.snapshot.queryParams['attributes']);
    let currentValues = attrs[key] || [];

    if (currentValues.includes(value)) {
      currentValues = currentValues.filter((v) => v !== value);
    } else {
      currentValues = [...currentValues, value];
    }

    this.attributeChange.emit({ key, values: currentValues });
  }
}
