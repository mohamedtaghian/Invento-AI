import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HlmBadge } from '@spartan/helm/badge';
import { ProductStore } from '@invento/user-site/app/features/product/service/product-store';
import { HlmTypographyImports } from '@spartan/helm/typography';

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, HlmBadge, HlmTypographyImports],
})
export class ProductSummary {
  protected readonly store = inject(ProductStore);
}
