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
import { HlmButton } from '@spartan/helm/button';
import { HlmTypographyImports } from '@spartan/helm/typography';
import { ProductListItem } from '@invento/user-site/app/features/product/types/product';
import { flyToCart } from '@invento/user-site/app/features/product';
import { TranslatePipe } from '@invento/core';
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

  protected onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    flyToCart(event);
  }
}
