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
import { HlmBadge } from '@spartan/helm/badge';
import { ProductStore } from '@invento/user-site/app/features/product';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';
import { flyToCart } from '@invento/user-site/app/features/product';
import { environment } from '../../../../../environments/environment';

import { TranslatePipe } from '@invento/core';

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
  private readonly router = inject(Router);

  protected async addToCart(event: MouseEvent): Promise<void> {
    await flyToCart(event);
    this.router.navigate(['/', environment.storeSlug, 'checkout']);
  }
}
