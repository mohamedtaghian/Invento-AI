import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { ProductStore } from '../../service/product-store';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGallery {
  protected readonly store = inject(ProductStore);
  private readonly _activeIndex = signal(0);
  protected readonly activeIndex = this._activeIndex.asReadonly();
  protected readonly activeImage = computed(
    () => this.store.product()?.images[this._activeIndex()] ?? null,
  );

  protected selectImage(index: number): void {
    this._activeIndex.set(index);
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
