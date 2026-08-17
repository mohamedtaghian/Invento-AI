import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { ProductStore } from '@invento/user-site/app/features/product/service/product-store';

@Component({
  selector: 'app-product-details-accordion',
  templateUrl: './product-details-accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideChevronDown })],
  imports: [NgIcon],
})
export class ProductDetailsAccordion {
  protected readonly store = inject(ProductStore);
}
