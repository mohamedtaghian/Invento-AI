import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideHeart, lucideShoppingCart } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { ProductStore } from '../../data/product-store';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';

@Component({
  selector: 'app-purchase-actions',
  templateUrl: './purchase-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, QuantityStepper],
  providers: [provideIcons({ lucideCircleCheck, lucideHeart, lucideShoppingCart })],
})
export class PurchaseActions {
  protected readonly store = inject(ProductStore);
  private readonly _isWishlisted = signal(false);
  protected readonly isWishlisted = this._isWishlisted.asReadonly();

  protected toggleWishlist(): void {
    this._isWishlisted.update((w) => !w);
  }

  protected addToCart(): void {
    console.info('Added to cart', {
      productId: this.store.product()?.id,
      colorId: this.store.selectedColor()?.id,
      sizeId: this.store.selectedSize()?.id,
      quantity: this.store.quantity(),
    });
  }
}
