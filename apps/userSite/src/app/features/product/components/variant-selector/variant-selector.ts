import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductStore } from '@invento/user-site/app/features/product/service/product-store';
import { HlmTypographyImports } from '@spartan/helm/typography';

@Component({
  selector: 'app-variant-selector',
  templateUrl: './variant-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTypographyImports],
})
export class VariantSelector {
  protected readonly store = inject(ProductStore);
}
