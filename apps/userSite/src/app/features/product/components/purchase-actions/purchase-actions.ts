import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideShoppingCart } from '@ng-icons/lucide';
import { HlmButton } from '@spartan/helm/button';
import { toast } from '@spartan/helm/sonner';
import { ProductStore } from '../../service/product-store';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';
import { flyToCart } from '../../service/cart-utils';
import { CartService } from '../../../../core/service/cart.service';

@Component({
  selector: 'app-purchase-actions',
  templateUrl: './purchase-actions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, QuantityStepper],
  providers: [provideIcons({ lucideCircleCheck, lucideShoppingCart })],
})
export class PurchaseActions {
  protected readonly store = inject(ProductStore);
  private readonly cartService = inject(CartService);

  protected addToCart(event: MouseEvent): void {
    const product = this.store.product();
    const variant = this.store.currentVariant();
    const quantity = this.store.quantity();

    if (!product || !variant) {
      toast.warning('Please select an available product variant.');
      return;
    }

    const variantOptionsMap: Record<string, string> = {};
    if (variant.options) {
      for (const opt of variant.options) {
        variantOptionsMap[opt.attributeName || opt.attributeKey] = opt.value || opt.slug;
      }
    }

    this.cartService.addItem({
      variantId: variant.id,
      productId: product.slug,
      productTitle: product.title,
      productSlug: product.slug,
      productImageUrl: product.images?.[0]?.url || null,
      variantOptions: variantOptionsMap,
      sku: variant.id,
      unitAmount: variant.priceAmount,
      quantity,
    });

    toast.success(`Added ${quantity} × "${product.title}" to cart!`);
    flyToCart(event);
  }

  protected toggleWishlist(event: MouseEvent): void {
    this.store.toggleWishlist();
    if (this.store.isWishlisted()) {
      this._burstParticles(event);
    }
  }

  private _burstParticles(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('span');
      particle.textContent = '❤';
      const angle = (i / 12) * 360;
      const distance = 40 + Math.random() * 50;
      const dx = Math.cos((angle * Math.PI) / 180) * distance;
      const dy = Math.sin((angle * Math.PI) / 180) * distance;
      const size = 8 + Math.random() * 10;
      const duration = 600 + Math.random() * 300;

      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        color: #ef4444;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
        transition: transform ${duration}ms cubic-bezier(.17,.67,.35,1.2), opacity ${duration}ms ease-out;
      `;
      document.body.appendChild(particle);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          particle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`;
          particle.style.opacity = '0';
        });
      });

      setTimeout(() => particle.remove(), duration + 50);
    }
  }
}
