import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../types/product';

@Component({
  selector: 'app-products-grid',
  templateUrl: './products-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
})
export class ProductsGrid {
  public readonly products = input.required<Product[]>();
}
