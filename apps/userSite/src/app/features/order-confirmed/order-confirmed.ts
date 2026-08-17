import { Component, afterNextRender, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import gsap from 'gsap';

// Spartan UI & Icons
import { HlmButton } from '@spartan/helm/button';
import { HlmCard } from '@spartan/helm/card';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucideCheckCircle,
  lucidePackage,
  lucideArrowRight,
  lucideShoppingBag,
  lucideLoader2,
} from '@ng-icons/lucide';

import { CartService } from '../../core/service/cart.service';
import { OrdersDataService } from '../orders/service/orders-data.service';
import { environment } from '../../../environments/environment';
import { FormatOrderDatePipe } from '../../core/pipes/format-date.pipe';
import type { PlacedOrderResponse } from '../../core/interface/cart.interface';
import type { OrderDetail } from '../orders/types/orders';

@Component({
  selector: 'app-order-confirmed',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    HlmButton,
    HlmCard,
    NgIconComponent,
    FormatOrderDatePipe,
  ],

  providers: [
    provideIcons({
      lucideCheckCircle,
      lucidePackage,
      lucideArrowRight,
      lucideShoppingBag,
      lucideLoader2,
    }),
  ],
  templateUrl: './order-confirmed.html',
})
export class OrderConfirmedComponent implements OnInit {
  protected readonly cartService = inject(CartService);
  protected readonly ordersService = inject(OrdersDataService);
  private readonly route = inject(ActivatedRoute);

  readonly activeStoreSlug = computed(() => {
    return (
      this.route.snapshot.paramMap.get('storeSlug') ||
      this.route.parent?.snapshot.paramMap.get('storeSlug') ||
      environment.storeSlug
    );
  });

  readonly order = signal<PlacedOrderResponse | OrderDetail | null>(null);
  readonly isLoading = signal<boolean>(true);

  constructor() {
    afterNextRender(() => {
      // Animated Checkmark Pop
      const successCircle = document.querySelectorAll('.success-circle');
      if (successCircle.length > 0) {
        gsap.from(successCircle, {
          scale: 0,
          rotation: -45,
          duration: 0.6,
          ease: 'back.out(2)',
        });
      }

      // Draw SVG Checkmark Path
      const checkmarkPath = document.querySelectorAll('.checkmark-path');
      if (checkmarkPath.length > 0) {
        gsap.fromTo(
          checkmarkPath,
          { strokeDasharray: 100, strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            delay: 0.8,
            ease: 'power2.inOut',
          },
        );
      }

      // Sequenced Entrance Animation for Cards
      const confirmCards = document.querySelectorAll('.confirm-anim');
      if (confirmCards.length > 0) {
        gsap.from(confirmCards, {
          y: 20,
          opacity: 0,
          stagger: 0.2,
          delay: 0.4,
        });
      }

      // Stagger Timeline Steps
      const timelineSteps = document.querySelectorAll('.border-l-2 > div');
      if (timelineSteps.length > 0) {
        gsap.from(timelineSteps, {
          x: -10,
          opacity: 0,
          stagger: 0.15,
          delay: 0.8,
        });
      }
    });
  }

  ngOnInit(): void {
    const slug = this.activeStoreSlug();
    const storedLastOrder = this.cartService.lastPlacedOrder();

    if (storedLastOrder) {
      this.order.set(storedLastOrder);
      this.isLoading.set(false);
      return;
    }

    // Check query params for orderNumber
    const orderNumStr = this.route.snapshot.queryParamMap.get('orderNumber');
    if (orderNumStr) {
      const orderNum = Number(orderNumStr);
      if (!isNaN(orderNum)) {
        this.ordersService.loadOrderDetails(orderNum, slug).then((detail) => {
          if (detail) {
            this.order.set(detail);
            this.cartService.setLastPlacedOrder(detail as PlacedOrderResponse);
          }
          this.isLoading.set(false);
        });
        return;
      }
    }

    // Fallback: Fetch customer's latest order from API
    this.ordersService.getMyOrders(slug, 1, 1).subscribe({
      next: (res) => {
        const latest = res.items?.[0];
        if (latest && latest.orderNumber != null) {
          this.ordersService.loadOrderDetails(latest.orderNumber, slug).then((detail) => {
            if (detail) {
              this.order.set(detail);
              this.cartService.setLastPlacedOrder(detail as PlacedOrderResponse);
            }
            this.isLoading.set(false);
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
