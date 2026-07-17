import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart, lucideShoppingCart } from '@ng-icons/lucide';
import {
  HlmCard,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
} from '@spartan/helm/card';
import { HlmBadge } from '@spartan/helm/badge';
import { Product } from '@invento/user-site/app/features/product/types/product.interface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-full block' },
  imports: [
    DecimalPipe,
    NgIcon,
    HlmCard,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    HlmBadge,
  ],
  providers: [provideIcons({ lucideHeart, lucideShoppingCart })],
})
export class ProductCard {
  public readonly product = input.required<Product>();
  protected readonly isFavorited = signal(false);

  protected toggleFavorite(event: MouseEvent): void {
    this.isFavorited.update((v) => !v);
    if (this.isFavorited()) {
      this._burstParticles(event);
    }
  }

  protected onAddToCart(event: MouseEvent): void {
    this._flyToCart(event);
  }

  private _flyToCart(event: MouseEvent): void {
    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon) return;

    const btn = event.currentTarget as HTMLElement;
    const startRect = btn.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const flyer = document.createElement('div');
    flyer.style.cssText = `
      position: fixed;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 9999;
      left: ${startX - 18}px;
      top: ${startY - 18}px;
    `;
    flyer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>`;
    document.body.appendChild(flyer);

    const duration = 700;
    const startTime = performance.now();

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentX = startX + (endX - startX) * ease - 18;
      const currentY = startY + (endY - startY) * ease - Math.sin(Math.PI * progress) * 100 - 18;
      const scale = 1 - progress * 0.7;
      const opacity = progress > 0.8 ? 1 - (progress - 0.8) * 5 : 1;

      flyer.style.left = `${currentX}px`;
      flyer.style.top = `${currentY}px`;
      flyer.style.transform = `scale(${scale})`;
      flyer.style.opacity = `${opacity}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        flyer.remove();

        cartIcon.style.transition = 'transform 0.15s ease';
        cartIcon.style.transform = 'scale(1.4)';
        setTimeout(() => {
          cartIcon.style.transform = 'scale(1)';
        }, 200);

        const countEl = document.getElementById('cart-count');
        if (countEl) {
          const current = parseInt(countEl.textContent || '0', 10);
          const newCount = current + 1;
          countEl.textContent = String(newCount);
          countEl.classList.remove('hidden');
          countEl.style.transition = 'transform 0.15s ease';
          countEl.style.transform = 'scale(1.5)';
          setTimeout(() => {
            countEl.style.transform = 'scale(1)';
          }, 150);
        }
      }
    };

    requestAnimationFrame(animate);
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
