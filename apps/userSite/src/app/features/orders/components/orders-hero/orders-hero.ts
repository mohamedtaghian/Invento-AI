import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import gsap from 'gsap';
import { HlmBadgeImports } from '@spartan/helm/badge';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucidePackage, lucideTruck, lucideCircleCheck, lucideDollarSign } from '@ng-icons/lucide';
import { OrdersDataService } from '../../service/orders-data.service';

@Component({
  selector: 'app-orders-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe, HlmBadgeImports, NgIconComponent],
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
      gsap.from('.orders-hero-anim', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.from('.orders-stat-card', {
        scale: 0.95,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        delay: 0.2,
        ease: 'back.out(1.5)',
      });
    });
  }
}
