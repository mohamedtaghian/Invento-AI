import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleCheck,
  lucideShoppingCart,
  lucideTriangleAlert,
  lucideBan,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
<<<<<<< HEAD
import { toast } from '@spartan/helm/sonner';
import { ProductStore } from '../../service/product-store';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';
import { flyToCart } from '../../service/cart-utils';
import { CartService } from '../../../../core/service/cart.service';
=======
import { HlmBadge } from '@spartan/helm/badge';
import { ProductStore } from '@invento/user-site/app/features/product';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';
import { flyToCart } from '@invento/user-site/app/features/product';
import { environment } from '../../../../../environments/environment';

import { TranslatePipe } from '@invento/core';
>>>>>>> refactor/product-review--user-site

@Component({
  selector: 'app-purchase-actions',
  templateUrl: './purchase-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, QuantityStepper, HlmBadge, TranslatePipe],
  providers: [
    provideIcons({ lucideCircleCheck, lucideShoppingCart, lucideTriangleAlert, lucideBan }),
  ],
})
export class PurchaseActions {
  protected readonly store = inject(ProductStore);
<<<<<<< HEAD
  private readonly cartService = inject(CartService);

  protected addToCart(event: MouseEvent): void {
    const product = this.store.product();
    const variant = this.store.currentVariant();
    const quantity = this.store.quantity();

    if (!product || !variant) {
      toast.warning('Please select an available product variant.');
      return;
    }

    const variantOptionsMap: Record<string, string> = {};
    if (variant.options) {
      for (const opt of variant.options) {
        variantOptionsMap[opt.attributeName || opt.attributeKey] = opt.value || opt.slug;
      }
    }

    this.cartService.addItem({
      variantId: variant.id,
      productId: product.slug,
      productTitle: product.title,
      productSlug: product.slug,
      productImageUrl: product.images?.[0]?.url || null,
      variantOptions: variantOptionsMap,
      sku: variant.id,
      unitAmount: variant.priceAmount,
      quantity,
    });

    toast.success(`Added ${quantity} × "${product.title}" to cart!`);
    flyToCart(event);
=======
  private readonly router = inject(Router);

  protected async addToCart(event: MouseEvent): Promise<void> {
    await flyToCart(event);
    this.router.navigate(['/', environment.storeSlug, 'checkout']);
>>>>>>> refactor/product-review--user-site
  }
}
