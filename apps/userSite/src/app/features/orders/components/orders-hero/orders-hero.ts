import { TranslatePipe } from '@invento/core';
import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import gsap from 'gsap';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { HlmTypographyImports } from '@spartan/helm/typography';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucidePackage, lucideTruck, lucideCircleCheck, lucideDollarSign } from '@ng-icons/lucide';
import { OrdersDataService } from '@invento/user-site/app/features/orders';

@Component({
  selector: 'app-orders-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    CommonModule,
    CurrencyPipe,
    HlmBadgeImports,
    ...HlmTypographyImports,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      lucidePackage,
      lucideTruck,
      lucideCircleCheck,
      lucideDollarSign,
    }),
  ],
  templateUrl: './orders-hero.html',
})
export class OrdersHeroComponent {
  protected readonly ordersService = inject(OrdersDataService);

  constructor() {
    afterNextRender(() => {
      const heroAnim = document.querySelectorAll('.orders-hero-anim');
      if (heroAnim.length > 0) {
        gsap.from(heroAnim, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      const statCards = document.querySelectorAll('.orders-stat-card');
      if (statCards.length > 0) {
        gsap.from(statCards, {
          scale: 0.95,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          delay: 0.2,
          ease: 'back.out(1.5)',
        });
      }
    });
  }
}
