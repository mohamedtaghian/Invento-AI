import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { ProductStore } from '@invento/user-site/app/features/product/service/product-store';

@Component({
  selector: 'app-quantity-stepper',
  templateUrl: './quantity-stepper.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton],
  providers: [provideIcons({ lucideMinus, lucidePlus })],
})
export class QuantityStepper {
  protected readonly store = inject(ProductStore);
}
