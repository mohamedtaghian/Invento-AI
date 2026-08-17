import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShoppingCart, lucideLoader2 } from '@ng-icons/lucide';
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
} from '@spartan/helm/card';
import { toast } from '@spartan/helm/sonner';
import { ProductListItem } from '../../types/product';
import { flyToCart } from '../../service/cart-utils';
import { CartService } from '../../../../core/service/cart.service';
import { ProductApiService } from '../../service/product-api.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-full block' },
  imports: [
    RouterLink,
    CurrencyPipe,
    SlicePipe,
    NgIcon,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
  ],
  providers: [provideIcons({ lucideShoppingCart, lucideLoader2 })],
})
export class ProductCard {
  public readonly product = input.required<ProductListItem>();
  protected readonly storeSlug = environment.storeSlug;

  private readonly cartService = inject(CartService);
  private readonly productApi = inject(ProductApiService);
  protected readonly isAdding = signal<boolean>(false);

  protected onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.isAdding()) return;
    this.isAdding.set(true);

    const p = this.product();

    this.productApi.getProductBySlug(this.storeSlug, p.slug).subscribe({
      next: (detail) => {
        this.isAdding.set(false);
        const variant = detail.variants?.find((v) => v.inStock) || detail.variants?.[0];
        if (!variant) {
          toast.warning('This product is currently out of stock.');
          return;
        }

        const variantOptionsMap: Record<string, string> = {};
        variant.options?.forEach((opt) => {
          variantOptionsMap[opt.attributeName || opt.attributeKey] = opt.value || opt.slug;
        });

        this.cartService.addItem({
          variantId: variant.id,
          productId: p.slug,
          productTitle: p.title,
          productSlug: p.slug,
          productImageUrl: p.imageUrl || detail.images?.[0]?.url || null,
          variantOptions: variantOptionsMap,
          sku: variant.id,
          unitAmount: variant.priceAmount || p.minPriceAmount,
          quantity: 1,
        });

        toast.success(`Added "${p.title}" to cart!`);
        flyToCart(event);
      },
      error: () => {
        this.isAdding.set(false);
        toast.error('Could not add product to cart.');
      },
    });
  }
}
