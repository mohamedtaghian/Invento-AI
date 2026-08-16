import { ChangeDetectionStrategy, Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { HlmScrollAreaImports } from '@spartan/helm/scroll-area';
import { NgScrollbar } from 'ngx-scrollbar';
import { ProductCard } from '../product-card/product-card';
import { ProductApiService } from '../../service/product-api.service';
import { environment } from '../../../../../environments/environment';
import { ProductListItem } from '../../types/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmScrollAreaImports, NgScrollbar, ProductCard],
})
export class RecommendedProducts implements OnInit, OnDestroy {
  private readonly apiService = inject(ProductApiService);
  
  public readonly products = signal<ProductListItem[]>([]);
  private sub?: Subscription;

  ngOnInit(): void {
    // Fetch top 4 rated or default products to show as recommended
    this.sub = this.apiService.getProducts(environment.storeSlug, { limit: 4 }).subscribe(res => {
      this.products.set(res.items);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
