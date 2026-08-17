import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { ProductListItem } from '@invento/user-site/app/features/product/types/product';
import { HlmTypographyImports } from '@spartan/helm/typography';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard, HlmTypographyImports],
})
export class ProductsGrid {
  public readonly products = input.required<ProductListItem[]>();
}
