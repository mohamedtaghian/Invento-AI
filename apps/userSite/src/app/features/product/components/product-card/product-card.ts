import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShoppingCart, lucideImage, lucidePlus, lucideMinus } from '@ng-icons/lucide';
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
} from '@spartan/helm/card';
import { toast } from '@spartan/helm/sonner';
import { TranslatePipe } from '@invento/core';
import { flyToCart } from '@invento/user-site/app/features/product';
import { CartService } from '@invento/user-site/core/service/cart.service';

import { HlmButton } from '@spartan/helm/button';
import { HlmTypographyImports } from '@spartan/helm/typography';
import { ProductListItem } from '@invento/user-site/app/features/product/types/product';
import { PageBadge, ColorSwatch } from '@invento/shared';
import { environment } from '@invento/user-site/environments/environment';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-full block' },
  imports: [
    RouterLink,
    CurrencyPipe,
    SlicePipe,
    TranslatePipe,
    NgIcon,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    HlmButton,
    HlmTypographyImports,
    PageBadge,
    ColorSwatch,
  ],
  providers: [provideIcons({ lucideShoppingCart, lucideImage, lucidePlus, lucideMinus })],
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

    const targetEl = (event.currentTarget || event.target) as HTMLElement;
    const startRect = targetEl?.getBoundingClientRect ? targetEl.getBoundingClientRect() : null;

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
        flyToCart(startRect);
      },
      error: () => {
        this.isAdding.set(false);
        toast.error('Could not add product to cart.');
      },
    });
  }
}
