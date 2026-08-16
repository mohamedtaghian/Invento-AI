import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HlmBadge } from '@spartan/helm/badge';
import { ProductStore } from '../../service/product-store';

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, HlmBadge],
})
export class ProductSummary {
  protected readonly store = inject(ProductStore);
}
