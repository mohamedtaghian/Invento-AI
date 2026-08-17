import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideShoppingCart } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { ProductStore } from '@invento/user-site/app/features/product/service/product-store';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';
import { flyToCart } from '@invento/user-site/app/features/product/service/cart-utils';

@Component({
  selector: 'app-purchase-actions',
  templateUrl: './purchase-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, QuantityStepper],
  providers: [provideIcons({ lucideCircleCheck, lucideShoppingCart })],
})
export class PurchaseActions {
  protected readonly store = inject(ProductStore);

  protected addToCart(event: MouseEvent): void {
    flyToCart(event);
  }
}
