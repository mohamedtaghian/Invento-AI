import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RELATED_PRODUCTS } from '../../data/product-mock-data';
import { ProductCard } from './product-card/product-card';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
})
export class RecommendedProducts {
  protected readonly products = RELATED_PRODUCTS;
}
