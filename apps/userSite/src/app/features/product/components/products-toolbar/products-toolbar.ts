import { ChangeDetectionStrategy, Component, input, output, OnDestroy } from '@angular/core';
import { SortOption } from '@invento/user-site/app/features/product/types/product.interface';
import { HlmBadge } from '@spartan/helm/badge';

@Component({
  selector: 'app-products-toolbar',
  templateUrl: './products-toolbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadge],
})
export class ProductsToolbar implements OnDestroy {
  public readonly title = input<string>('Products');
  public readonly count = input<number>(0);
  public readonly sort = input<SortOption>('recommended');

  public readonly sortChange = output<SortOption>();
  public readonly searchChange = output<string>();

  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortChange.emit(value);
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(() => {
      this.searchChange.emit(value.trim());
    }, 350);
  }

  ngOnDestroy(): void {
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
  }
}
