import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan/helm/button';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucidePackage, lucideCircleX } from '@ng-icons/lucide';
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
    }),
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  protected readonly ordersService = inject(OrdersDataService);

  constructor() {
    // Automatically load orders on initial component mount (prepared for backend integration)
    this.ordersService.loadOrders();
  }

  protected resetFilters(): void {
    this.ordersService.setFilter('all');
    this.ordersService.setSearchQuery('');
  }
}
