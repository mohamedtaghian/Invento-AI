import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmScrollAreaImports } from '@spartan/helm/scroll-area';
import { NgScrollbar } from 'ngx-scrollbar';
import { RELATED_PRODUCTS } from '../../mock/products';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmScrollAreaImports, NgScrollbar, ProductCard],
})
export class RecommendedProducts {
  protected readonly products = RELATED_PRODUCTS;
}
