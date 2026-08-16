import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan/helm/button';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  lucidePackage,
  lucideCircleX,
  lucideLock,
  lucideLogIn,
  lucideChevronLeft,
  lucideChevronRight,
  lucideShoppingBag,
} from '@ng-icons/lucide';
import { environment } from '../../../environments/environment';
import { OrdersDataService } from './service/orders-data.service';
import { OrdersHeroComponent } from './components/orders-hero/orders-hero';
import { OrdersFilterBarComponent } from './components/orders-filter-bar/orders-filter-bar';
import { OrderCardComponent } from './components/order-card/order-card';

@Component({
  selector: 'app-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    HlmButtonImports,
    NgIconComponent,
    OrdersHeroComponent,
    OrdersFilterBarComponent,
    OrderCardComponent,
  ],
  providers: [
    provideIcons({
      lucidePackage,
      lucideCircleX,
      lucideLock,
      lucideLogIn,
      lucideChevronLeft,
      lucideChevronRight,
      lucideShoppingBag,
    }),
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit {
  protected readonly ordersService = inject(OrdersDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected storeSlug = environment.storeSlug;

  ngOnInit(): void {
    this.storeSlug =
      this.route.snapshot.paramMap.get('storeSlug') ??
      this.route.parent?.snapshot.paramMap.get('storeSlug') ??
      environment.storeSlug;

    this.ordersService.loadOrders(this.storeSlug);
  }

  protected resetFilters(): void {
    this.ordersService.setFilter('all');
    this.ordersService.setSearchQuery('');
  }

  protected reload(): void {
    this.ordersService.loadOrders(this.storeSlug);
  }

  protected onPageChange(page: number): void {
    this.ordersService.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected goToLogin(): void {
    this.router.navigate(['/', this.storeSlug, 'auth', 'login']);
  }
}
