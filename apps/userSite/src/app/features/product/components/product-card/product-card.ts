import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShoppingCart } from '@ng-icons/lucide';
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
} from '@spartan/helm/card';
import { ProductListItem } from '@invento/user-site/app/features/product/types/product';
import { flyToCart } from '@invento/user-site/app/features/product/service/cart-utils';
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
  providers: [provideIcons({ lucideShoppingCart })],
})
export class ProductCard {
  public readonly product = input.required<ProductListItem>();
  protected readonly storeSlug = environment.storeSlug;

  protected onAddToCart(event: MouseEvent): void {
    event.stopPropagation();
    flyToCart(event);
  }
}
