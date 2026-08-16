import { ChangeDetectionStrategy, Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { ProductApiService } from '../../service/product-api.service';
import { ProductStore } from '../../service/product-store';
import { BreadcrumbTrail } from '../breadcrumb-trail/breadcrumb-trail';
import { ProductGallery } from '../product-gallery/product-gallery';
import { ProductSummary } from '../product-summary/product-summary';
import { VariantSelector } from '../variant-selector/variant-selector';
import { PurchaseActions } from '../purchase-actions/purchase-actions';
import { ProductDetailsAccordion } from '../product-details-accordion/product-details-accordion';
import { RecommendedProducts } from '../recommended-products/recommended-products';
import { environment } from '../../../../../environments/environment';

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
export class ProductDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ProductApiService);
  protected readonly store = inject(ProductStore);

  public readonly isLoading = signal<boolean>(true);
  public readonly notFound = signal<boolean>(false);

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        const productSlug = params.get('id'); // Defined as :id in app.routes.ts, but represents productSlug
        if (!productSlug) {
          return of(null);
        }
        this.isLoading.set(true);
        this.notFound.set(false);
        return this.apiService.getProductBySlug(environment.storeSlug, productSlug).pipe(
          catchError(() => of(null))
        );
      })
    ).subscribe(product => {
      if (product) {
        this.store.loadProduct(product);
      } else {
        this.notFound.set(true);
      }
      this.isLoading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
