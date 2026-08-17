import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { HlmCarouselImports } from '@spartan/helm/carousel';
import { ProductCard } from '../product-card/product-card';
import { ProductApiService } from '@invento/user-site/app/features/product';
import { environment } from '../../../../../environments/environment';
import { ProductListItem } from '@invento/user-site/app/features/product/types/product';
import { Subscription } from 'rxjs';
import { HlmTypographyImports } from '@spartan/helm/typography';

import { TranslatePipe } from '@invento/core';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...HlmCarouselImports, ProductCard, ...HlmTypographyImports, TranslatePipe],
})
export class RecommendedProducts implements OnInit, OnDestroy {
  private readonly apiService = inject(ProductApiService);

  public readonly products = signal<ProductListItem[]>([]);
  private sub?: Subscription;

  ngOnInit(): void {
    // Fetch top 10 rated or default products to show as recommended
    this.sub = this.apiService
      .getProducts(environment.storeSlug, { limit: 10 })
      .subscribe((res) => {
        this.products.set(res.items);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
