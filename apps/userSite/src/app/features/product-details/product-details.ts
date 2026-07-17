import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsData } from '@invento/user-site/app/features/product/service/products-data';
import { ProductStore } from './data/product-store';
import { AURA_WATCH } from './data/product-mock-data';
import { BreadcrumbTrail } from './components/breadcrumb-trail/breadcrumb-trail';
import { ProductGallery } from './components/product-gallery/product-gallery';
import { ProductSummary } from './components/product-summary/product-summary';
import { VariantSelector } from './components/variant-selector/variant-selector';
import { PurchaseActions } from './components/purchase-actions/purchase-actions';
import { ProductDetailsAccordion } from './components/product-details-accordion/product-details-accordion';
import { RecommendedProducts } from './components/recommended-products/recommended-products';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductStore],
  imports: [
    BreadcrumbTrail,
    ProductGallery,
    ProductSummary,
    VariantSelector,
    PurchaseActions,
    ProductDetailsAccordion,
    RecommendedProducts,
  ],
})
export class ProductDetails {
  private readonly _route = inject(ActivatedRoute);
  private readonly _productsData = inject(ProductsData);
  protected readonly store = inject(ProductStore);

  constructor() {
    const productId = toSignal(this._route.paramMap.pipe(map((params) => params.get('id') ?? '')), {
      initialValue: '',
    });

    const product = this._productsData.getProductById(productId());
    this.store.loadProduct(product ?? AURA_WATCH);
  }
}
