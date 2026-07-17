import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { ProductStore } from '../../data/product-store';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGallery {
  protected readonly store = inject(ProductStore);
  private readonly _activeIndex = signal(0);
  protected readonly activeIndex = this._activeIndex.asReadonly();
  protected readonly activeImage = computed(
    () => this.store.product()?.images[this._activeIndex()] ?? null,
  );

  protected selectImage(index: number): void {
    this._activeIndex.set(index);
  }
}
