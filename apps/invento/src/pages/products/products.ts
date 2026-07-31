import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideSearch,
  lucideChevronRight,
  lucidePlus,
  lucideX,
  lucideAlertCircle,
  lucideLoader2,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmCardImports } from '@spartan/helm/card';
import { HlmInputImports } from '@spartan/helm/input';

import { Product } from '../../features/products/product.model';
import { ProductService } from '../../features/products/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    NgClass,
    NgIcon,
    HlmButton,
    HlmCardImports,
    HlmInputImports,
  ],
  providers: [
    provideIcons({
      lucideDownload,
      lucideSearch,
      lucideChevronRight,
      lucidePlus,
      lucideX,
      lucideAlertCircle,
      lucideLoader2,
    }),
  ],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  private readonly productService = inject(ProductService);

  readonly isDrawerOpen = signal(false);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading.set(true);

    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load products', err);
        this.isLoading.set(false);
      },
    });
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update((v) => !v);
  }
}
