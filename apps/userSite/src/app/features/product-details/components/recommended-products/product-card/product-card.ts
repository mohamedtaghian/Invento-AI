import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideStar } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { HlmCard, HlmCardContent } from '@spartan/helm/card';
import type { RelatedProduct } from '../../../data/product.interface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, NgIcon, HlmButton, HlmCard, HlmCardContent],
  providers: [provideIcons({ lucideHeart, lucideStar })],
})
export class ProductCard {
  readonly product = input.required<RelatedProduct>();
}
