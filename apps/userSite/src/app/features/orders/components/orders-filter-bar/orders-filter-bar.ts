import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { lucideSearch, lucideCircleX } from '@ng-icons/lucide';
import { OrdersDataService } from '../../service/orders-data.service';
import type { OrderFilter } from '../../types/orders';

@Component({
  selector: 'app-orders-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      lucideSearch,
      lucideCircleX,
    }),
  ],
  templateUrl: './orders-filter-bar.html',
  styleUrl: './orders-filter-bar.css',
})
export class OrdersFilterBarComponent {
  protected readonly ordersService = inject(OrdersDataService);

  protected readonly filterTabs: { id: OrderFilter; label: string }[] = [
    { id: 'all', label: 'All Orders' },
    { id: 'processing', label: 'Processing' },
    { id: 'in-transit', label: 'In Transit' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  protected onFilterChange(filter: OrderFilter): void {
    this.ordersService.setFilter(filter);
  }

  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.ordersService.setSearchQuery(input.value);
  }

  protected clearSearch(): void {
    this.ordersService.setSearchQuery('');
  }

  protected getCountForFilter(filter: OrderFilter): number {
    return this.ordersService.statusCounts()[filter];
  }
}
