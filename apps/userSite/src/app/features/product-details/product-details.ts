import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideStar,
  lucideCheckCircle,
  lucideMinus,
  lucidePlus,
  lucideHeart,
  lucideChevronDown,
  lucideShoppingCart,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan/helm/badge';
import { HlmButton } from '@spartan/helm/button';
import { ProductsData } from '@invento/user-site/app/features/product/service/products-data';
import { ProductGallery } from '@invento/user-site/app/features/product-details/components/product-gallery/product-gallery';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmBadge, HlmButton, RouterLink, ProductGallery, DecimalPipe],
  providers: [
    provideIcons({
      lucideChevronRight,
      lucideStar,
      lucideCheckCircle,
      lucideMinus,
      lucidePlus,
      lucideHeart,
      lucideChevronDown,
      lucideShoppingCart,
    }),
  ],
})
export class ProductDetails {
  private readonly _route = inject(ActivatedRoute);
  private readonly _productsData = inject(ProductsData);

  private readonly _productId = toSignal(
    this._route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  protected readonly detail = computed(() => this._productsData.getProductById(this._productId()));

  protected readonly recommendedProducts = this._productsData.recommendedProducts;

  protected readonly selectedColor = signal(0);
  protected readonly selectedSize = signal(0);
  protected readonly quantity = signal(1);

  protected selectColor(index: number): void {
    this.selectedColor.set(index);
  }

  protected selectSize(index: number): void {
    this.selectedSize.set(index);
  }

  protected incrementQuantity(): void {
    this.quantity.update((q) => Math.min(q + 1, 99));
  }

  protected decrementQuantity(): void {
    this.quantity.update((q) => Math.max(q - 1, 1));
  }
}
