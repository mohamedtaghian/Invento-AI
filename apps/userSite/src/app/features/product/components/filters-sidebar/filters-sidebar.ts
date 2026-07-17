import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HlmButton } from '@spartan/helm/button';
import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle } from '@spartan/helm/card';

export interface CategoryFilter {
  readonly label: string;
  readonly value: string;
  readonly checked: boolean;
}

export interface ColorFilter {
  readonly value: string;
  readonly hex: string;
}

@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filters-sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, HlmButton, HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle],
})
export class FiltersSidebar {
  public readonly categories = input.required<CategoryFilter[]>();
  public readonly colors = input.required<ColorFilter[]>();
  public readonly selectedColor = input<string | null>(null);
  public readonly maxPrice = input<number>(5000);
  public readonly inStock = input<boolean>(false);
  public readonly onlyDiscount = input<boolean>(false);

  public readonly categoryToggle = output<string>();
  public readonly colorSelect = output<string>();
  public readonly priceChange = output<number>();
  public readonly clearAll = output<void>();
  public readonly inStockChange = output<boolean>();
  public readonly discountChange = output<boolean>();

  protected onPriceInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.priceChange.emit(value);
  }
}
