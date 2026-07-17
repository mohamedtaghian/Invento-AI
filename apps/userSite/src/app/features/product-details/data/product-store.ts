import { Injectable, computed, signal } from '@angular/core';
import type { ProductDetail, ColorOption, SizeOption } from './product.interface';

@Injectable()
export class ProductStore {
  private readonly _product = signal<ProductDetail | null>(null);
  private readonly _selectedColorId = signal<string | null>(null);
  private readonly _selectedSizeId = signal<string | null>(null);
  private readonly _quantity = signal(1);

  readonly product = this._product.asReadonly();
  readonly quantity = this._quantity.asReadonly();

  readonly selectedColor = computed<ColorOption | undefined>(() =>
    this._product()?.colors.find((c) => c.id === this._selectedColorId()),
  );

  readonly selectedSize = computed<SizeOption | undefined>(() =>
    this._product()?.sizes.find((s) => s.id === this._selectedSizeId()),
  );

  readonly lineTotal = computed(() => (this._product()?.price ?? 0) * this._quantity());

  readonly canAddToCart = computed(
    () => !!this._product()?.inStock && !!this.selectedColor() && !!this.selectedSize(),
  );

  loadProduct(product: ProductDetail): void {
    this._product.set(product);
    this._selectedColorId.set(product.colors[0]?.id ?? null);
    this._selectedSizeId.set(product.sizes[0]?.id ?? null);
    this._quantity.set(1);
  }

  selectColor(colorId: string): void {
    this._selectedColorId.set(colorId);
  }

  selectSize(sizeId: string): void {
    this._selectedSizeId.set(sizeId);
  }

  increment(): void {
    this._quantity.update((q) => q + 1);
  }

  decrement(): void {
    this._quantity.update((q) => Math.max(1, q - 1));
  }
}
